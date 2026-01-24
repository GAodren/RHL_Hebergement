import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Fonction pour récupérer le profil (ou le créer s'il n'existe pas)
  const fetchProfile = useCallback(async (userId, userEmail) => {
    try {
      const { data, error } = await supabase
        .from('users_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // PGRST116 = pas de ligne trouvée, on crée le profil
      if (error && error.code === 'PGRST116') {
        const { data: newProfile, error: insertError } = await supabase
          .from('users_profiles')
          .insert([{ id: userId, email: userEmail }])
          .select()
          .single();

        if (!insertError && newProfile) {
          setProfile(newProfile);
        }
        return;
      }

      if (!error && data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Erreur fetchProfile:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Initialisation de l'authentification
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Erreur init auth:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        // Ignorer l'événement initial, on gère avec getSession
        if (event === 'INITIAL_SESSION') return;

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    initAuth();

    return () => {
      mounted = false;
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo.${fileExt}`;

      // Supprimer l'ancien logo s'il existe
      if (profile?.logo_url) {
        const oldPath = profile.logo_url.split('/').slice(-2).join('/');
        await supabase.storage.from('logos').remove([oldPath]);
      }

      // Upload du nouveau logo
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        return { error: uploadError };
      }

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      // Mettre à jour le profil avec l'URL du logo
      const { data, error } = await updateProfile({ logo_url: publicUrl });
      return { data, error, url: publicUrl };
    } catch (error) {
      console.error('Erreur uploadLogo:', error);
      return { error };
    }
  }, [user, profile, updateProfile]);

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
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
