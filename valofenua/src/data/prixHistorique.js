/**
 * Données historiques des prix au m² par commune (en XPF)
 *
 * ⚠️ AVERTISSEMENT: Ces données sont des ESTIMATIONS basées sur les tendances
 * du marché immobilier polynésien. Elles ne constituent pas des données officielles.
 *
 * Tendances appliquées:
 * - 2020: Impact COVID, légère baisse/stagnation
 * - 2021: Début de reprise
 * - 2022: Forte hausse (boom post-COVID, télétravail)
 * - 2023: Croissance soutenue
 * - 2024: Croissance modérée (effet JO Teahupoo pour certaines zones)
 * - 2025: Stabilisation avec légère hausse
 */

export const prixHistorique = {
  // ═══════════════════════════════════════════════════════════════════════════
  // TAHITI - Communes principales
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Zone Premium (Grand Papeete) ---
  Papeete: {
    2020: 480000,
    2021: 505000,
    2022: 560000,
    2023: 610000,
    2024: 645000,
    2025: 665000,
  },
  Punaauia: {
    2020: 420000,
    2021: 445000,
    2022: 495000,
    2023: 545000,
    2024: 580000,
    2025: 600000,
  },
  Arue: {
    2020: 400000,
    2021: 425000,
    2022: 475000,
    2023: 520000,
    2024: 555000,
    2025: 575000,
  },

  // --- Zone Mid-High ---
  Pirae: {
    2020: 380000,
    2021: 400000,
    2022: 445000,
    2023: 485000,
    2024: 515000,
    2025: 535000,
  },
  Faaa: {
    2020: 350000,
    2021: 370000,
    2022: 410000,
    2023: 450000,
    2024: 480000,
    2025: 500000,
  },
  Mahina: {
    2020: 340000,
    2021: 360000,
    2022: 400000,
    2023: 440000,
    2024: 470000,
    2025: 490000,
  },

  // --- Zone Intermédiaire ---
  Paea: {
    2020: 320000,
    2021: 340000,
    2022: 380000,
    2023: 420000,
    2024: 450000,
    2025: 470000,
  },
  Papara: {
    2020: 280000,
    2021: 300000,
    2022: 340000,
    2023: 380000,
    2024: 410000,
    2025: 430000,
  },

  // --- Zone Presqu'île (Taiarapu) ---
  'Taiarapu-Est': {
    2020: 250000,
    2021: 265000,
    2022: 300000,
    2023: 335000,
    2024: 360000,
    2025: 380000,
  },
  'Taiarapu-Ouest': {
    2020: 240000,
    2021: 255000,
    2022: 290000,
    2023: 325000,
    2024: 350000,
    2025: 370000,
  },
  Taravao: {
    2020: 270000,
    2021: 290000,
    2022: 330000,
    2023: 370000,
    2024: 400000,
    2025: 420000,
  },
  Afaahiti: {
    2020: 245000,
    2021: 260000,
    2022: 295000,
    2023: 330000,
    2024: 355000,
    2025: 375000,
  },
  Teahupoo: {
    // Effet JO 2024 - hausse plus marquée
    2020: 230000,
    2021: 255000,
    2022: 310000,
    2023: 360000,
    2024: 390000,
    2025: 410000,
  },
  Toahotu: {
    2020: 240000,
    2021: 255000,
    2022: 290000,
    2023: 325000,
    2024: 350000,
    2025: 370000,
  },
  Vairao: {
    2020: 235000,
    2021: 250000,
    2022: 285000,
    2023: 320000,
    2024: 345000,
    2025: 365000,
  },
  Tautira: {
    2020: 210000,
    2021: 225000,
    2022: 260000,
    2023: 290000,
    2024: 315000,
    2025: 335000,
  },

  // --- Zone Côte Est ---
  'Teva I Uta': {
    2020: 260000,
    2021: 275000,
    2022: 310000,
    2023: 345000,
    2024: 370000,
    2025: 390000,
  },
  Mataiea: {
    2020: 255000,
    2021: 270000,
    2022: 305000,
    2023: 340000,
    2024: 365000,
    2025: 385000,
  },
  Papeari: {
    2020: 250000,
    2021: 265000,
    2022: 300000,
    2023: 335000,
    2024: 360000,
    2025: 380000,
  },
  'Hitiaa O Te Ra': {
    2020: 230000,
    2021: 245000,
    2022: 280000,
    2023: 315000,
    2024: 340000,
    2025: 360000,
  },
  Papenoo: {
    2020: 260000,
    2021: 275000,
    2022: 310000,
    2023: 345000,
    2024: 370000,
    2025: 390000,
  },
  Tiarei: {
    2020: 215000,
    2021: 230000,
    2022: 265000,
    2023: 295000,
    2024: 320000,
    2025: 340000,
  },
  Hitiaa: {
    2020: 215000,
    2021: 230000,
    2022: 265000,
    2023: 295000,
    2024: 320000,
    2025: 340000,
  },
  Mahaena: {
    2020: 210000,
    2021: 225000,
    2022: 260000,
    2023: 290000,
    2024: 315000,
    2025: 335000,
  },
  Faaone: {
    2020: 220000,
    2021: 235000,
    2022: 270000,
    2023: 300000,
    2024: 325000,
    2025: 345000,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MOOREA-MAIAO
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Moorea (commune principale) ---
  Moorea: {
    2020: 390000,
    2021: 420000,
    2022: 480000,
    2023: 530000,
    2024: 570000,
    2025: 595000,
  },

  // --- Districts de Moorea ---
  Temae: {
    // Zone aéroport/hôtels - premium
    2020: 430000,
    2021: 460000,
    2022: 525000,
    2023: 580000,
    2024: 620000,
    2025: 645000,
  },
  Maharepa: {
    // Centre commercial/touristique
    2020: 410000,
    2021: 440000,
    2022: 500000,
    2023: 555000,
    2024: 595000,
    2025: 620000,
  },
  Paopao: {
    // Baie de Cook
    2020: 400000,
    2021: 430000,
    2022: 490000,
    2023: 545000,
    2024: 585000,
    2025: 610000,
  },
  Pihaena: {
    2020: 395000,
    2021: 425000,
    2022: 485000,
    2023: 535000,
    2024: 575000,
    2025: 600000,
  },
  Teavaro: {
    2020: 420000,
    2021: 450000,
    2022: 510000,
    2023: 565000,
    2024: 605000,
    2025: 630000,
  },
  Papetoai: {
    // Baie d'Opunohu
    2020: 385000,
    2021: 415000,
    2022: 475000,
    2023: 525000,
    2024: 565000,
    2025: 590000,
  },
  Haapiti: {
    // Côte ouest, coucher de soleil
    2020: 370000,
    2021: 395000,
    2022: 450000,
    2023: 500000,
    2024: 540000,
    2025: 565000,
  },
  Afareaitu: {
    // Chef-lieu administratif
    2020: 340000,
    2021: 365000,
    2022: 415000,
    2023: 460000,
    2024: 495000,
    2025: 515000,
  },
  Vaiare: {
    // Port ferry
    2020: 330000,
    2021: 355000,
    2022: 405000,
    2023: 450000,
    2024: 485000,
    2025: 505000,
  },
  Atiha: {
    2020: 320000,
    2021: 345000,
    2022: 395000,
    2023: 440000,
    2024: 475000,
    2025: 495000,
  },
  Haumi: {
    2020: 310000,
    2021: 335000,
    2022: 385000,
    2023: 430000,
    2024: 465000,
    2025: 485000,
  },
  Vaianae: {
    2020: 300000,
    2021: 325000,
    2022: 375000,
    2023: 420000,
    2024: 455000,
    2025: 475000,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RAIATEA (Îles Sous-le-Vent)
  // ═══════════════════════════════════════════════════════════════════════════

  Uturoa: {
    // Capitale administrative des ISLV
    2020: 320000,
    2021: 345000,
    2022: 395000,
    2023: 440000,
    2024: 475000,
    2025: 500000,
  },
  Taputapuatea: {
    // Site UNESCO
    2020: 260000,
    2021: 280000,
    2022: 320000,
    2023: 360000,
    2024: 395000,
    2025: 415000,
  },
  Tumaraa: {
    2020: 250000,
    2021: 270000,
    2022: 310000,
    2023: 350000,
    2024: 385000,
    2025: 405000,
  },
  Avera: {
    2020: 280000,
    2021: 305000,
    2022: 350000,
    2023: 395000,
    2024: 430000,
    2025: 455000,
  },
  Tevaitoa: {
    2020: 265000,
    2021: 285000,
    2022: 325000,
    2023: 365000,
    2024: 400000,
    2025: 420000,
  },
  Opoa: {
    2020: 240000,
    2021: 260000,
    2022: 300000,
    2023: 335000,
    2024: 365000,
    2025: 385000,
  },
  Fetuna: {
    2020: 220000,
    2021: 240000,
    2022: 280000,
    2023: 315000,
    2024: 345000,
    2025: 365000,
  },
  Puohine: {
    2020: 210000,
    2021: 230000,
    2022: 270000,
    2023: 305000,
    2024: 335000,
    2025: 355000,
  },
  Vaiaau: {
    2020: 230000,
    2021: 250000,
    2022: 290000,
    2023: 325000,
    2024: 355000,
    2025: 375000,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTRES ÎLES (données agrégées par île)
  // ═══════════════════════════════════════════════════════════════════════════

  'Bora Bora': {
    // Île touristique ultra-premium
    2020: 650000,
    2021: 700000,
    2022: 800000,
    2023: 880000,
    2024: 940000,
    2025: 980000,
  },
  Tahaa: {
    // "Île vanille"
    2020: 240000,
    2021: 260000,
    2022: 300000,
    2023: 340000,
    2024: 375000,
    2025: 395000,
  },
  Huahine: {
    2020: 280000,
    2021: 305000,
    2022: 350000,
    2023: 395000,
    2024: 430000,
    2025: 455000,
  },
  Rangiroa: {
    // Plus grand atoll des Tuamotu
    2020: 200000,
    2021: 220000,
    2022: 260000,
    2023: 300000,
    2024: 335000,
    2025: 360000,
  },
  Fakarava: {
    // Réserve de biosphère UNESCO
    2020: 180000,
    2021: 200000,
    2022: 240000,
    2023: 280000,
    2024: 315000,
    2025: 340000,
  },
  Tikehau: {
    2020: 190000,
    2021: 210000,
    2022: 250000,
    2023: 290000,
    2024: 325000,
    2025: 350000,
  },
  'Nuku Hiva': {
    // Capitale des Marquises
    2020: 220000,
    2021: 240000,
    2022: 280000,
    2023: 320000,
    2024: 355000,
    2025: 380000,
  },
  'Hiva Oa': {
    // Île de Gauguin et Brel
    2020: 210000,
    2021: 230000,
    2022: 270000,
    2023: 310000,
    2024: 345000,
    2025: 370000,
  },
};

// Années disponibles
export const annees = [2020, 2021, 2022, 2023, 2024, 2025];

// Liste des îles/archipels pour le regroupement
export const iles = {
  tahiti: [
    'Papeete', 'Punaauia', 'Arue', 'Pirae', 'Faaa', 'Mahina', 'Paea', 'Papara',
    'Taiarapu-Est', 'Taiarapu-Ouest', 'Teva I Uta', 'Hitiaa O Te Ra',
    'Taravao', 'Afaahiti', 'Teahupoo', 'Toahotu', 'Vairao', 'Tautira',
    'Mataiea', 'Papeari', 'Papenoo', 'Tiarei', 'Hitiaa', 'Mahaena', 'Faaone',
  ],
  moorea: [
    'Moorea', 'Temae', 'Maharepa', 'Paopao', 'Pihaena', 'Teavaro',
    'Papetoai', 'Haapiti', 'Afareaitu', 'Vaiare', 'Atiha', 'Haumi', 'Vaianae',
  ],
  raiatea: [
    'Uturoa', 'Taputapuatea', 'Tumaraa', 'Avera', 'Tevaitoa',
    'Opoa', 'Fetuna', 'Puohine', 'Vaiaau',
  ],
  autresIles: [
    'Bora Bora', 'Tahaa', 'Huahine', 'Rangiroa', 'Fakarava',
    'Tikehau', 'Nuku Hiva', 'Hiva Oa',
  ],
};

/**
 * Récupère les données historiques pour une commune
 * @param {string} commune - Nom de la commune
 * @returns {Array} Tableau d'objets {annee, prix}
 */
export function getHistoriqueCommune(commune) {
  const data = prixHistorique[commune];
  if (!data) return [];

  return annees.map(annee => ({
    annee,
    prix: data[annee],
  }));
}

/**
 * Calcule la variation de prix entre deux années
 * @param {string} commune - Nom de la commune
 * @param {number} anneeDebut - Année de début
 * @param {number} anneeFin - Année de fin
 * @returns {object} {variation, pourcentage}
 */
export function getVariation(commune, anneeDebut = 2020, anneeFin = 2025) {
  const data = prixHistorique[commune];
  if (!data) return { variation: 0, pourcentage: 0 };

  const prixDebut = data[anneeDebut];
  const prixFin = data[anneeFin];
  const variation = prixFin - prixDebut;
  const pourcentage = ((variation / prixDebut) * 100).toFixed(1);

  return { variation, pourcentage: Number(pourcentage) };
}

/**
 * Récupère le prix actuel (2025) pour une commune
 * @param {string} commune - Nom de la commune
 * @returns {number} Prix au m² en 2025
 */
export function getPrixActuel(commune) {
  return prixHistorique[commune]?.[2025] || 0;
}

/**
 * Récupère toutes les communes disponibles
 * @returns {string[]} Liste des noms de communes
 */
export function getAllCommunes() {
  return Object.keys(prixHistorique);
}

/**
 * Récupère les communes d'une île spécifique
 * @param {string} ile - Nom de l'île (tahiti, moorea, raiatea, autresIles)
 * @returns {string[]} Liste des communes de l'île
 */
export function getCommunesByIle(ile) {
  return iles[ile] || [];
}

/**
 * Trouve l'île d'appartenance d'une commune
 * @param {string} commune - Nom de la commune
 * @returns {string|null} Nom de l'île ou null
 */
export function getIleByCommune(commune) {
  for (const [ile, communes] of Object.entries(iles)) {
    if (communes.includes(commune)) {
      return ile;
    }
  }
  return null;
}

/**
 * Calcule les statistiques d'une île
 * @param {string} ile - Nom de l'île
 * @param {number} annee - Année (défaut: 2025)
 * @returns {object} {min, max, moyenne, communes}
 */
export function getStatsByIle(ile, annee = 2025) {
  const communes = iles[ile] || [];
  const prix = communes
    .map(c => prixHistorique[c]?.[annee])
    .filter(p => p !== undefined);

  if (prix.length === 0) return null;

  return {
    min: Math.min(...prix),
    max: Math.max(...prix),
    moyenne: Math.round(prix.reduce((a, b) => a + b, 0) / prix.length),
    communes: communes.length,
  };
}
