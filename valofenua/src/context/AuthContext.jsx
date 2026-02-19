import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer ou créer le profil
  const fetchProfile = useCallback(async (userId, userEmail) => {
    try {
      const { data, error } = await supabase
        .from('users_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Profil non trouvé, on le crée
      if (error && error.code === 'PGRST116') {
        const { data: newProfile } = await supabase
          .from('users_profiles')
          .insert([{ id: userId, email: userEmail }])
          .select()
          .single();

        if (newProfile) {
          setProfile(newProfile);
        }
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Erreur fetchProfile:', err);
    }
  }, []);

  // Initialisation au chargement
  useEffect(() => {
    let isMounted = true;
    let loadingFinished = false;

    const finishLoading = () => {
      if (isMounted && !loadingFinished) {
        loadingFinished = true;
        setLoading(false);
      }
    };

    const initAuth = async () => {
      try {
        // Récupérer la session existante
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error('Erreur getSession:', error);
          setUser(null);
          setProfile(null);
          finishLoading();
          return;
        }

        if (session?.user) {
          setUser(session.user);
          // Charger le profil en arrière-plan, ne pas bloquer
          fetchProfile(session.user.id, session.user.email).finally(finishLoading);
        } else {
          setUser(null);
          setProfile(null);
          finishLoading();
        }
      } catch (err) {
        console.error('Erreur initAuth:', err);
        if (isMounted) {
          setUser(null);
          setProfile(null);
          finishLoading();
        }
      }
    };

    // Écouter les changements d'auth (connexion/déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        // Ne pas traiter l'événement initial (géré par getSession)
        if (event === 'INITIAL_SESSION') return;

        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id, session.user.email);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    // Timeout de sécurité (3 secondes max)
    const timeout = setTimeout(() => {
      console.warn('Auth timeout - forçage du loading à false');
      finishLoading();
    }, 3000);

    initAuth();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, data.user.email);
      }

      return { data, error };
    } catch (error) {
      console.error('Erreur login:', error);
      return { data: null, error };
    }
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    // Réinitialiser l'état AVANT d'appeler signOut pour une UI réactive
    setUser(null);
    setProfile(null);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }

    return { error: null };
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: { message: 'Non connecté' } };

    try {
      const { data, error } = await supabase
        .from('users_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (!error && data) {
        setProfile(data);
      }
      return { data, error };
    } catch (error) {
      console.error('Erreur updateProfile:', error);
      return { data: null, error };
    }
  }, [user]);

  const uploadLogo = useCallback(async (file) => {
    if (!user) return { error: { message: 'Non connecté' } };

    try {
      // Utiliser un nom fixe pour toujours écraser l'ancien
      const fileName = `${user.id}/logo`;

      // Upload du nouveau logo (écrase l'ancien grâce à upsert)
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        return { error: uploadError };
      }

      // Récupérer l'URL publique avec un timestamp pour éviter le cache
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      const urlWithCache = `${publicUrl}?t=${Date.now()}`;

      // Mettre à jour le profil avec l'URL du logo
      const { data, error } = await updateProfile({ logo_url: urlWithCache });
      return { data, error, url: urlWithCache };
    } catch (error) {
      console.error('Erreur uploadLogo:', error);
      return { error };
    }
  }, [user, updateProfile]);

  const uploadAgentPhoto = useCallback(async (file) => {
    if (!user) return { error: { message: 'Non connecté' } };

    try {
      const fileName = `${user.id}/photo_agent`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Erreur upload photo agent:', uploadError);
        return { error: uploadError };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      const urlWithCache = `${publicUrl}?t=${Date.now()}`;

      const { data, error } = await updateProfile({ photo_agent_url: urlWithCache });
      return { data, error, url: urlWithCache };
    } catch (error) {
      console.error('Erreur uploadAgentPhoto:', error);
      return { error };
    }
  }, [user, updateProfile]);

  const refreshProfile = useCallback(() => {
    if (user) {
      return fetchProfile(user.id, user.email);
    }
  }, [user, fetchProfile]);

  const value = {
    user,
    profile,
    loading,
    login,
    logout,
    updateProfile,
    uploadLogo,
    uploadAgentPhoto,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
