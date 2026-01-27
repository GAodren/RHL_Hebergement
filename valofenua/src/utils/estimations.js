import { supabase } from './supabase';

/**
 * Sauvegarde une estimation dans la base de données
 */
export async function saveEstimation(userId, formData, result, adjustedPrice = null) {
  const { data, error } = await supabase
    .from('estimations')
    .insert({
      user_id: userId,
      commune: formData.commune,
      categorie: formData.categorie,
      type_bien: formData.type_bien || null,
      surface: formData.surface || null,
      surface_terrain: formData.surface_terrain || null,
      prix_bas: result.prix_bas,
      prix_moyen: result.prix_moyen,
      prix_haut: result.prix_haut,
      prix_m2_moyen: result.prix_m2_moyen,
      prix_ajuste: adjustedPrice,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Récupère toutes les estimations d'un utilisateur
 */
export async function getEstimations(userId) {
  const { data, error } = await supabase
    .from('estimations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Récupère une estimation par son ID
 */
export async function getEstimationById(id) {
  const { data, error } = await supabase
    .from('estimations')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

/**
 * Met à jour une estimation (notes, prix ajusté)
 */
export async function updateEstimation(id, updates) {
  const { data, error } = await supabase
    .from('estimations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

/**
 * Supprime une estimation
 */
export async function deleteEstimation(id) {
  const { error } = await supabase
    .from('estimations')
    .delete()
    .eq('id', id);

  return { error };
}
