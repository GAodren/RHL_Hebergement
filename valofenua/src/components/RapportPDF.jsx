import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatPriceXPF, formatPriceMF } from '../utils/formatPrice';

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #0077B6',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 5,
  },
  logoSubtitle: {
    fontSize: 10,
    color: '#64748B',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bienBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    border: '1px solid #BAE6FD',
  },
  bienLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 3,
  },
  bienValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  estimationBox: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  estimationLabel: {
    fontSize: 10,
    color: '#BAE6FD',
    marginBottom: 5,
  },
  estimationValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  estimationSubValue: {
    fontSize: 10,
    color: '#BAE6FD',
    marginTop: 5,
  },
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    border: '1px solid #E2E8F0',
  },
  priceColumn: {
    alignItems: 'center',
    flex: 1,
  },
  priceLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  priceLow: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },
  priceMid: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0077B6',
  },
  priceHigh: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    width: '48%',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    border: '1px solid #E2E8F0',
  },
  statLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 3,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  comparablesSection: {
    marginTop: 10,
  },
  comparableItem: {
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    marginBottom: 8,
    border: '1px solid #E2E8F0',
  },
  comparableTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 3,
  },
  comparableDetails: {
    fontSize: 9,
    color: '#64748B',
  },
  comparablePrice: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0077B6',
    marginTop: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1px solid #E2E8F0',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 3,
  },
  date: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'right',
    marginTop: 10,
  },
  disclaimer: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 6,
    marginTop: 15,
    border: '1px solid #FCD34D',
  },
  disclaimerText: {
    fontSize: 9,
    color: '#92400E',
  },
});

export default function RapportPDF({ result, formData }) {
  const { prix_bas, prix_moyen, prix_haut, prix_m2_moyen, comparables } = result;

  const prixM2Bas = Math.round(prix_bas / formData.surface);
  const prixM2Haut = Math.round(prix_haut / formData.surface);
  const ecartPrix = prix_haut - prix_bas;
  const pourcentageEcart = ((ecartPrix / prix_moyen) * 100).toFixed(0);

  const getBienLabel = () => {
    const parts = [];
    if (formData.categorie) parts.push(formData.categorie);
    if (formData.type_bien) parts.push(formData.type_bien);
    parts.push(`de ${formData.surface} m²`);
    parts.push(`à ${formData.commune}`);
    return parts.join(' ');
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bienLabel}>Type de bien</Text>
                <Text style={styles.bienValue}>{formData.categorie} {formData.type_bien || ''}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bienLabel}>Surface</Text>
                <Text style={styles.bienValue}>{formData.surface} m²</Text>
              </View>
            </View>
            <View>
              <Text style={styles.bienLabel}>Localisation</Text>
              <Text style={styles.bienValue}>{formData.commune}</Text>
            </View>
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
              <Text style={styles.statLabel}>Surface du bien</Text>
              <Text style={styles.statValue}>{formData.surface} m²</Text>
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
          <View style={[styles.statBox, { width: '100%' }]}>
            <Text style={styles.statLabel}>Écart de prix</Text>
            <Text style={styles.statValue}>{formatPriceMF(ecartPrix)} (±{pourcentageEcart}% autour de l'estimation)</Text>
          </View>
        </View>

        {/* Offres similaires */}
        {comparables && comparables.length > 0 && (
          <View style={styles.comparablesSection}>
            <Text style={styles.sectionTitle}>Offres similaires sur le marché</Text>
            {comparables.slice(0, 3).map((offre, index) => (
              <View key={index} style={styles.comparableItem}>
                <Text style={styles.comparableTitle}>{offre.titre || `${offre.categorie} ${offre.type_bien || ''}`}</Text>
                <Text style={styles.comparableDetails}>
                  {offre.surface} m² • {offre.commune}
                </Text>
                <Text style={styles.comparablePrice}>{formatPriceMF(offre.prix)}</Text>
              </View>
            ))}
          </View>
        )}

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
          <Text style={styles.footerText}>Données basées sur les annonces de immobilier.pf</Text>
        </View>
      </Page>
    </Document>
  );
}
