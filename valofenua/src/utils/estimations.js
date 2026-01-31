import { supabase } from './supabase';

/**
 * Upload une photo de bien vers Supabase Storage
 */
export async function uploadBienPhoto(userId, estimationId, photoBase64) {
  if (!photoBase64) return { url: null, error: null };

  try {
    // Extraire le type et les données du base64
    const matches = photoBase64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return { url: null, error: 'Format image invalide' };
    }

    const extension = matches[1];
    const base64Data = matches[2];
    const fileName = `${userId}/${estimationId}.${extension}`;

    // Convertir base64 en Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: `image/${extension}` });

    // Upload vers Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('estimation-photos')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Erreur upload photo:', uploadError);
      return { url: null, error: uploadError };
    }

    // Récupérer l'URL publique
    const { data: urlData } = supabase.storage
      .from('estimation-photos')
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (err) {
    console.error('Erreur upload photo:', err);
    return { url: null, error: err };
  }
}

/**
 * Sauvegarde une estimation dans la base de données
 */
export async function saveEstimation(userId, formData, result, adjustedPrice = null, photoUrl = null) {
  const { data, error } = await supabase
    .from('estimations')
    .insert({
      user_id: userId,
      commune: formData.commune,
      categorie: formData.categorie,
      type_bien: formData.type_bien || null,
      surface: formData.surface || null,
      surface_terrain: formData.surface_terrain || null,
      etat_bien: formData.etat_bien || null,
      caracteristiques: formData.caracteristiques || [],
      prix_bas: result.prix_bas,
      prix_moyen: result.prix_moyen,
      prix_haut: result.prix_haut,
      prix_m2_moyen: result.prix_m2_moyen,
      prix_ajuste: adjustedPrice,
      photo_url: photoUrl,
      comparables: result.comparables || [],
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
