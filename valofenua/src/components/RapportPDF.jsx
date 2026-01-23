import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatPriceXPF, formatPriceMF } from '../utils/formatPrice';

// Styles pour le PDF - Version compacte pour tenir sur une page
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 15,
    borderBottom: '2px solid #0077B6',
    paddingBottom: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 2,
  },
  logoSubtitle: {
    fontSize: 8,
    color: '#64748B',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    marginTop: 5,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bienBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    border: '1px solid #BAE6FD',
  },
  bienLabel: {
    fontSize: 8,
    color: '#64748B',
    marginBottom: 2,
  },
  bienValue: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  estimationBox: {
    backgroundColor: '#0077B6',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  estimationLabel: {
    fontSize: 8,
    color: '#BAE6FD',
    marginBottom: 2,
  },
  estimationValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  estimationSubValue: {
    fontSize: 8,
    color: '#BAE6FD',
    marginTop: 2,
  },
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    border: '1px solid #E2E8F0',
  },
  priceColumn: {
    alignItems: 'center',
    flex: 1,
  },
  priceLabel: {
    fontSize: 7,
    color: '#64748B',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  priceLow: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
  },
  priceMid: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0077B6',
  },
  priceHigh: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  statBox: {
    width: '48%',
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    border: '1px solid #E2E8F0',
  },
  statLabel: {
    fontSize: 7,
    color: '#64748B',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: '1px solid #E2E8F0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 7,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 2,
  },
  date: {
    fontSize: 8,
    color: '#64748B',
    textAlign: 'right',
    marginTop: 6,
  },
  disclaimer: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    border: '1px solid #FCD34D',
  },
  disclaimerText: {
    fontSize: 8,
    color: '#92400E',
  },
});

export default function RapportPDF({ result, formData }) {
  const { prix_bas, prix_moyen, prix_haut, prix_m2_moyen } = result;

  // Pour les terrains, on utilise surface_terrain, sinon surface habitable
  const surfacePrincipale = formData.categorie === 'Terrain' ? formData.surface_terrain : formData.surface;

  const prixM2Bas = surfacePrincipale ? Math.round(prix_bas / surfacePrincipale) : 0;
  const prixM2Haut = surfacePrincipale ? Math.round(prix_haut / surfacePrincipale) : 0;
  const ecartPrix = prix_haut - prix_bas;
  const pourcentageEcart = ((ecartPrix / prix_moyen) * 100).toFixed(0);

  const getBienLabel = () => {
    const parts = [];
    if (formData.categorie) parts.push(formData.categorie);
    if (formData.type_bien) parts.push(formData.type_bien);

    if (formData.categorie === 'Terrain') {
      parts.push(`de ${formData.surface_terrain} m²`);
    } else {
      parts.push(`de ${formData.surface} m²`);
      if (formData.surface_terrain) {
        parts.push(`(terrain ${formData.surface_terrain} m²)`);
      }
    }

    parts.push(`à ${formData.commune}`);
    return parts.join(' ');
  };

  // Label de surface selon la catégorie
  const getSurfaceLabel = () => {
    return formData.categorie === 'Terrain' ? 'Surface terrain' : 'Surface habitable';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.logo}>ValoFenua</Text>
          <Text style={styles.logoSubtitle}>Estimation immobilière en Polynésie française</Text>
        </View>

        <Text style={styles.title}>Rapport d'estimation immobilière</Text>

        {/* Description du bien */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bien estimé</Text>
          <View style={styles.bienBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bienLabel}>Type de bien</Text>
                <Text style={styles.bienValue}>{formData.categorie} {formData.type_bien || ''}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bienLabel}>{getSurfaceLabel()}</Text>
                <Text style={styles.bienValue}>{surfacePrincipale} m²</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bienLabel}>Localisation</Text>
                <Text style={styles.bienValue}>{formData.commune}</Text>
              </View>
            </View>
            {formData.categorie === 'Maison' && formData.surface_terrain && (
              <View style={{ marginTop: 4 }}>
                <Text style={styles.bienLabel}>Surface terrain</Text>
                <Text style={styles.bienValue}>{formData.surface_terrain} m²</Text>
              </View>
            )}
          </View>
        </View>

        {/* Estimation principale */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valeur estimée</Text>
          <View style={styles.estimationBox}>
            <Text style={styles.estimationLabel}>ESTIMATION DU BIEN</Text>
            <Text style={styles.estimationValue}>{formatPriceMF(prix_moyen)}</Text>
            <Text style={styles.estimationSubValue}>soit {formatPriceXPF(prix_moyen)}</Text>
          </View>
        </View>

        {/* Fourchette de prix */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fourchette de prix</Text>
          <View style={styles.priceRange}>
            <View style={styles.priceColumn}>
              <Text style={styles.priceLabel}>Prix bas</Text>
              <Text style={styles.priceLow}>{formatPriceMF(prix_bas)}</Text>
            </View>
            <View style={styles.priceColumn}>
              <Text style={styles.priceLabel}>Estimation</Text>
              <Text style={styles.priceMid}>{formatPriceMF(prix_moyen)}</Text>
            </View>
            <View style={styles.priceColumn}>
              <Text style={styles.priceLabel}>Prix haut</Text>
              <Text style={styles.priceHigh}>{formatPriceMF(prix_haut)}</Text>
            </View>
          </View>
        </View>

        {/* Statistiques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails du marché</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Prix/m² du secteur</Text>
              <Text style={styles.statValue}>{formatPriceXPF(prix_m2_moyen)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{getSurfaceLabel()}</Text>
              <Text style={styles.statValue}>{surfacePrincipale} m²</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Prix/m² (fourchette basse)</Text>
              <Text style={styles.statValue}>{formatPriceXPF(prixM2Bas)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Prix/m² (fourchette haute)</Text>
              <Text style={styles.statValue}>{formatPriceXPF(prixM2Haut)}</Text>
            </View>
          </View>
          <View style={[styles.statBox, { width: '100%', marginTop: 6 }]}>
            <Text style={styles.statLabel}>Écart de prix</Text>
            <Text style={styles.statValue}>{formatPriceMF(ecartPrix)} (±{pourcentageEcart}% autour de l'estimation)</Text>
          </View>
        </View>

        {/* Avertissement */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Cette estimation est basée sur les annonces actives du marché immobilier polynésien.
            Elle est fournie à titre indicatif et ne constitue pas une évaluation officielle.
          </Text>
        </View>

        {/* Date */}
        <Text style={styles.date}>Rapport généré le {formatDate()}</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ValoFenua - Estimation immobilière en Polynésie française</Text>
        </View>
      </Page>
    </Document>
  );
}
