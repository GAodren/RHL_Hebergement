const API_URL = 'https://n8n.srv1206491.hstgr.cloud/webhook/estimation';

export async function getEstimation({ commune, categorie, type_bien, surface, surface_terrain, etat_bien, caracteristiques, nb_sdb }) {
  // Pour les terrains, on envoie surface_terrain dans le champ "surface"
  const surfaceToSend = categorie === 'Terrain' ? Number(surface_terrain) : Number(surface);

  const body = {
    commune,
    categorie,
    surface: surfaceToSend,
  };

  // Ajouter type_bien seulement s'il est défini (pas pour les terrains)
  if (type_bien) {
    body.type_bien = type_bien;
  }

  // Ajouter surface_terrain pour les maisons si défini
  if (categorie === 'Maison' && surface_terrain) {
    body.surface_terrain = Number(surface_terrain);
  }

  // Ajouter état du bien si défini
  if (etat_bien) {
    body.etat_bien = etat_bien;
  }

  // Ajouter caractéristiques si définies
  if (caracteristiques && caracteristiques.length > 0) {
    body.caracteristiques = caracteristiques;
  }

  // Ajouter nombre de salles d'eau si défini
  if (nb_sdb) {
    body.nb_sdb = Number(nb_sdb);
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de l\'estimation');
  }

  const data = await response.json();

  // Le webhook renvoie un tableau [{}] au lieu d'un objet direct
  const result = Array.isArray(data) ? data[0] : data;

  // Combiner les deux sections de comparables en un seul tableau tagué
  if (result.comparables_proches || result.comparables_similaires) {
    const proches = (result.comparables_proches || []).map(c => ({ ...c, section: 'proche' }));
    const similaires = (result.comparables_similaires || []).map(c => ({ ...c, section: 'similaire' }));
    result.comparables = [...proches, ...similaires];
    delete result.comparables_proches;
    delete result.comparables_similaires;
  }

  return result;
}

// Liste des communes disponibles
export const COMMUNES = [
  'Papeete',
  'Punaauia',
  'Faaa',
  'Pirae',
  'Arue',
  'Mahina',
  'Paea',
  'Papara',
  'Taiarapu-Est',
  'Taiarapu-Ouest',
  'Teva I Uta',
  'Hitiaa O Te Ra',
];

// Catégories de biens
export const CATEGORIES = ['Maison', 'Appartement', 'Terrain'];

// Types de biens par catégorie
export const TYPES_BIEN_MAISON = ['Studio', 'F1', 'F2', 'F3', 'F4', 'F5', '>F5'];
export const TYPES_BIEN_APPARTEMENT = ['Studio', 'F1', 'F2', 'F3', 'F4', 'F5'];

// Types de biens (legacy, pour compatibilité)
export const TYPES_BIEN = ['Studio', 'F1', 'F2', 'F3', 'F4', 'F5', '>F5'];
