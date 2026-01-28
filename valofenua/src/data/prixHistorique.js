/**
 * Données historiques des prix au m² par commune (en XPF)
 * Source: Estimations basées sur les tendances du marché immobilier polynésien
 *
 * Tendances appliquées:
 * - 2020: Impact COVID, légère baisse/stagnation
 * - 2021: Début de reprise
 * - 2022: Forte hausse (boom post-COVID, télétravail)
 * - 2023: Croissance soutenue
 * - 2024: Croissance modérée
 * - 2025: Stabilisation avec légère hausse
 */

export const prixHistorique = {
  // Communes premium
  Punaauia: {
    2020: 420000,
    2021: 445000,
    2022: 495000,
    2023: 545000,
    2024: 580000,
    2025: 600000,
  },
  Papeete: {
    2020: 480000,
    2021: 505000,
    2022: 560000,
    2023: 610000,
    2024: 645000,
    2025: 665000,
  },
  Arue: {
    2020: 400000,
    2021: 425000,
    2022: 475000,
    2023: 520000,
    2024: 555000,
    2025: 575000,
  },

  // Communes mid-high
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

  // Communes mid
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

  // Communes plus rurales / éloignées
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
  'Teva I Uta': {
    2020: 260000,
    2021: 275000,
    2022: 310000,
    2023: 345000,
    2024: 370000,
    2025: 390000,
  },
  'Hitiaa O Te Ra': {
    2020: 230000,
    2021: 245000,
    2022: 280000,
    2023: 315000,
    2024: 340000,
    2025: 360000,
  },
};

// Années disponibles
export const annees = [2020, 2021, 2022, 2023, 2024, 2025];

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
