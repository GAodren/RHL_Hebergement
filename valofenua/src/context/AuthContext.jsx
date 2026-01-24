import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refs pour éviter les race conditions
  const initializedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Fonction pour récupérer le profil (ou le créer s'il n'existe pas)
  const fetchProfile = useCallback(async (userId, userEmail) => {
    if (!isMountedRef.current) return;

    try {
      console.log('fetchProfile: Recherche du profil pour userId:', userId);

      const { data, error } = await supabase
        .from('users_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!isMountedRef.current) return;

      // PGRST116 = pas de ligne trouvée
      if (error && error.code === 'PGRST116') {
        console.log('fetchProfile: Profil non trouvé, création automatique...');

        // Créer le profil automatiquement
        const { data: newProfile, error: insertError } = await supabase
          .from('users_profiles')
          .insert([{ id: userId, email: userEmail }])
          .select()
          .single();

        if (insertError) {
          console.error('fetchProfile: Erreur création profil:', insertError);
          setProfile(null);
        } else {
          console.log('fetchProfile: Profil créé avec succès:', newProfile);
          setProfile(newProfile);
        }
        return;
      }

      if (error) {
        console.error('fetchProfile: Erreur récupération profil:', error);
        setProfile(null);
        return;
      }

      console.log('fetchProfile: Profil trouvé:', data);
      setProfile(data);
    } catch (error) {
      console.error('fetchProfile: Erreur inattendue:', error);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Fonction d'initialisation
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isMountedRef.current) return;

        if (error) {
          console.error('Erreur getSession:', error);
        }

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser.id, currentUser.email);
        }

        // Marquer comme initialisé et terminer le loading
        initializedRef.current = true;
        if (isMountedRef.current) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
        initializedRef.current = true;
        if (isMountedRef.current) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMountedRef.current) return;

        // Ignorer INITIAL_SESSION car on le gère avec getSession()
        if (event === 'INITIAL_SESSION') {
          return;
        }

        console.log('Auth state change:', event);

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser.id, currentUser.email);
        } else {
          setProfile(null);
        }
      }
    );

    // Lancer l'initialisation
    initializeAuth();

    // Timeout de sécurité
    const timeoutId = setTimeout(() => {
      if (isMountedRef.current && !initializedRef.current) {
        setLoading(false);
        initializedRef.current = true;
      }
    }, 3000);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutId);
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
