import { Document, Page, Text, View, StyleSheet, Image, Svg, Path } from '@react-pdf/renderer';
import { formatPriceXPF, formatPriceMF } from '../utils/formatPrice';
import { getHistoriqueCommune, getVariation } from '../data/prixHistorique';

// Nettoyer l'URL de la photo si elle commence par "photo_url:"
const cleanPhotoUrl = (photoUrl) => {
  if (!photoUrl) return null;
  if (photoUrl.startsWith('photo_url:')) {
    return photoUrl.substring('photo_url:'.length).trim();
  }
  return photoUrl;
};

// Labels pour l'état du bien
const ETATS_BIEN_LABELS = {
  neuf: 'Neuf / Récent',
  excellent: 'Excellent état',
  bon: 'Bon état général',
  rafraichir: 'À rafraîchir',
  renover: 'À rénover',
};

// Labels pour les caractéristiques
const CARACTERISTIQUES_LABELS = {
  villa: 'Villa',
  vue_mer: 'Vue mer',
  vue_montagne: 'Vue montagne',
  bord_mer: 'Bord de mer / Accès plage',
  piscine: 'Piscine',
  terrasse: 'Terrasse',
};

// Styles pour le PDF professionnel 6 pages
const styles = StyleSheet.create({
  // === PAGE COMMUNE ===
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 9,
    color: '#94A3B8',
  },

  // === PAGE 1: COUVERTURE ===
  coverPage: {
    padding: 0,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  coverPhotoContainer: {
    height: 350,
    width: '100%',
    backgroundColor: '#1E293B',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverNoPhoto: {
    height: 350,
    width: '100%',
    backgroundColor: '#0077B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverNoPhotoText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  coverContent: {
    padding: 40,
    flex: 1,
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 8,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
  },
  coverClientBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
    borderLeft: '4px solid #0077B6',
  },
  coverClientLabel: {
    fontSize: 9,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  coverClientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  coverBienInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginBottom: 30,
    paddingVertical: 15,
    borderTop: '1px solid #E2E8F0',
    borderBottom: '1px solid #E2E8F0',
  },
  coverBienItem: {
    alignItems: 'center',
  },
  coverBienLabel: {
    fontSize: 8,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  coverBienValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  coverAgencySection: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTop: '2px solid #0077B6',
  },
  coverAgencyLogo: {
    width: 70,
    height: 70,
    objectFit: 'contain',
  },
  coverAgencyInfo: {
    flex: 1,
    marginLeft: 15,
  },
  coverAgencyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  coverAgentName: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 1,
  },
  coverAgentContact: {
    fontSize: 9,
    color: '#64748B',
  },
  coverDate: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'right',
  },

  // === PAGE 2: FICHE TECHNIQUE ===
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '2px solid #0077B6',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 25,
  },
  photoItem: {
    width: '48%',
  },
  photoContainer: {
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  photoDescription: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 5,
    textAlign: 'center',
  },
  caracteristiquesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 20,
    border: '1px solid #E2E8F0',
  },
  caracteristiquesRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  caracteristiquesColumn: {
    flex: 1,
  },
  caracLabel: {
    fontSize: 9,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  caracValue: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 5,
  },
  badge: {
    backgroundColor: '#E0F4FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 9,
    color: '#0077B6',
  },

  // === PAGE 3: ANALYSE DU MARCHÉ ===
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  marketCommune: {
    fontSize: 14,
    color: '#64748B',
  },
  chartContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 20,
    marginBottom: 25,
    border: '1px solid #E2E8F0',
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  chartSvg: {
    flex: 1,
  },
  chartStats: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  variationPositive: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  variationNegative: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  variationSince: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  chartYears: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartYear: {
    fontSize: 9,
    color: '#64748B',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    border: '1px solid #E2E8F0',
  },
  statLabel: {
    fontSize: 9,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  // === COMMENTAIRE AGENT ===
  agentCommentBox: {
    marginTop: 25,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 20,
    borderLeft: '4px solid #0077B6',
  },
  agentCommentTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 10,
  },
  agentCommentText: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.6,
  },

  // === PAGE 4: BIENS SIMILAIRES ===
  comparablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  comparableCard: {
    width: '48%',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  comparableImageContainer: {
    height: 130,
    backgroundColor: '#F1F5F9',
  },
  comparableImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  comparableNoImage: {
    height: 130,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparableNoImageText: {
    fontSize: 9,
    color: '#94A3B8',
  },
  comparableContent: {
    padding: 12,
  },
  comparableType: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 4,
  },
  comparablePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  comparableDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparableDetail: {
    fontSize: 9,
    color: '#64748B',
  },

  // === PAGE 5: ESTIMATION FINALE ===
  estimationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  estimationBox: {
    backgroundColor: '#0077B6',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  estimationLabel: {
    fontSize: 12,
    color: '#BAE6FD',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  estimationPrice: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  estimationPriceXPF: {
    fontSize: 14,
    color: '#BAE6FD',
  },
  priceRangeContainer: {
    marginTop: 40,
    width: '100%',
  },
  priceRangeTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
    textAlign: 'center',
  },
  priceRangeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 15,
    border: '1px solid #E2E8F0',
  },
  priceRangeItem: {
    alignItems: 'center',
    flex: 1,
  },
  priceRangeLabel: {
    fontSize: 8,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
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
  priceM2Info: {
    marginTop: 20,
    textAlign: 'center',
  },
  priceM2Label: {
    fontSize: 9,
    color: '#64748B',
  },
  priceM2Value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 2,
  },

  // === PAGE 6: CONTACT ===
  contactPage: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  disclaimerBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 20,
    marginTop: 30,
    border: '1px solid #FCD34D',
  },
  disclaimerTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 10,
    color: '#92400E',
    lineHeight: 1.5,
  },
  contactSection: {
    marginBottom: 'auto',
  },
  contactCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 30,
    border: '1px solid #E2E8F0',
    alignItems: 'center',
  },
  contactLogo: {
    width: 100,
    height: 100,
    objectFit: 'contain',
    marginBottom: 20,
  },
  contactAgencyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 5,
    textAlign: 'center',
  },
  contactAgentName: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactDetails: {
    width: '100%',
    borderTop: '1px solid #E2E8F0',
    paddingTop: 20,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 10,
  },
  contactItem: {
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 8,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  contactValue: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  ctaBox: {
    marginTop: 30,
    backgroundColor: '#0077B6',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default function RapportPDF({ result, formData, adjustedPrice, agentProfile, bienPhoto, photosSupplementaires = [], nomClient = '', texteAnalyseMarche = '', texteEtudeComparative = '', sectionVisibility, hiddenComparables = [] }) {
  const { prix_bas, prix_moyen, prix_haut, prix_m2_moyen } = result;

  // Visibilité par défaut si non fournie
  const visibility = sectionVisibility || {
    marketTrends: true,
    statsGrid: true,
    priceGap: true,
    similarOffers: true,
    bienDetails: true,
  };

  // Vérifier si on a des détails du bien à afficher
  const hasBienDetails = formData.etat_bien || (formData.caracteristiques && formData.caracteristiques.length > 0);

  // Filtrer les biens similaires en excluant les masqués
  const visibleComparables = result.comparables
    ? result.comparables.filter((_, index) => !hiddenComparables.includes(index)).slice(0, 4)
    : [];

  // Informations de l'agent et de l'agence
  const agentFullName = agentProfile ? [agentProfile.prenom, agentProfile.nom].filter(Boolean).join(' ') : '';
  const agencyName = agentProfile?.agence || '';
  const agentPhone = agentProfile?.telephone || '';
  const agentEmail = agentProfile?.email || '';
  const agentLogo = agentProfile?.logo_url || null;
  const cartePro = agentProfile?.numero_carte_pro || '';
  const agencyAddress = agentProfile?.adresse || '';
  const agencyWebsite = agentProfile?.site_web || '';

  // Le prix affiché est soit le prix ajusté, soit le prix moyen
  const displayPrice = adjustedPrice || prix_moyen;

  // Pour les terrains, on utilise surface_terrain, sinon surface habitable
  const surfacePrincipale = formData.categorie === 'Terrain' ? formData.surface_terrain : formData.surface;

  const prixM2Bas = surfacePrincipale ? Math.round(prix_bas / surfacePrincipale) : 0;
  const prixM2Haut = surfacePrincipale ? Math.round(prix_haut / surfacePrincipale) : 0;
  const prixM2Display = surfacePrincipale ? Math.round(displayPrice / surfacePrincipale) : 0;

  const formatDate = () => {
    return new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Données tendance marché
  const historique = getHistoriqueCommune(formData.commune);
  const variation = getVariation(formData.commune);

  return (
    <Document>
      {/* === PAGE 1: COUVERTURE === */}
      <Page size="A4" style={styles.coverPage}>
        {/* Grande photo du bien */}
        {bienPhoto ? (
          <View style={styles.coverPhotoContainer}>
            <Image style={styles.coverPhoto} src={bienPhoto} />
          </View>
        ) : (
          <View style={styles.coverNoPhoto}>
            <Text style={styles.coverNoPhotoText}>Photo du bien</Text>
          </View>
        )}

        <View style={styles.coverContent}>
          {/* Titre */}
          <Text style={styles.coverTitle}>Dossier d'Estimation Immobilière</Text>
          <Text style={styles.coverSubtitle}>{formData.commune} • {formatDate()}</Text>

          {/* Nom du client */}
          {nomClient && (
            <View style={styles.coverClientBox}>
              <Text style={styles.coverClientLabel}>Préparé pour</Text>
              <Text style={styles.coverClientName}>{nomClient}</Text>
            </View>
          )}

          {/* Infos du bien */}
          <View style={styles.coverBienInfo}>
            <View style={styles.coverBienItem}>
              <Text style={styles.coverBienLabel}>Type</Text>
              <Text style={styles.coverBienValue}>{formData.categorie} {formData.type_bien || ''}</Text>
            </View>
            <View style={styles.coverBienItem}>
              <Text style={styles.coverBienLabel}>Surface</Text>
              <Text style={styles.coverBienValue}>{surfacePrincipale} m²</Text>
            </View>
            <View style={styles.coverBienItem}>
              <Text style={styles.coverBienLabel}>Localisation</Text>
              <Text style={styles.coverBienValue}>{formData.commune}</Text>
            </View>
          </View>

          {/* Section agence */}
          <View style={styles.coverAgencySection}>
            {agentLogo && (
              <Image style={styles.coverAgencyLogo} src={agentLogo} />
            )}
            <View style={styles.coverAgencyInfo}>
              {agencyName && <Text style={styles.coverAgencyName}>{agencyName}</Text>}
              {agentFullName && <Text style={styles.coverAgentName}>{agentFullName}</Text>}
              {cartePro && <Text style={styles.coverAgentContact}>Carte professionnelle : {cartePro}</Text>}
            </View>
            <Text style={styles.coverDate}>{formatDate()}</Text>
          </View>
        </View>

        <Text style={styles.pageNumber}>1 / 6</Text>
      </Page>

      {/* === PAGE 2: FICHE TECHNIQUE === */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageTitle}>Fiche Technique du Bien</Text>

        {/* Photos supplémentaires */}
        {photosSupplementaires && photosSupplementaires.length > 0 && (
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionTitle}>Galerie Photos</Text>
            <View style={styles.photosGrid}>
              {photosSupplementaires.slice(0, 4).map((photo, index) => {
                const photoUrl = photo.url || photo;
                const description = photo.description || '';
                return (
                  <View key={index} style={styles.photoItem}>
                    <View style={styles.photoContainer}>
                      <Image style={styles.photoImage} src={photoUrl} />
                    </View>
                    {description && (
                      <Text style={styles.photoDescription}>{description}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Caractéristiques */}
        <Text style={styles.sectionTitle}>Caractéristiques</Text>
        <View style={styles.caracteristiquesBox}>
          <View style={styles.caracteristiquesRow}>
            <View style={styles.caracteristiquesColumn}>
              <Text style={styles.caracLabel}>Surface habitable</Text>
              <Text style={styles.caracValue}>{formData.surface || '-'} m²</Text>
            </View>
            <View style={styles.caracteristiquesColumn}>
              <Text style={styles.caracLabel}>Surface terrain</Text>
              <Text style={styles.caracValue}>{formData.surface_terrain || '-'} m²</Text>
            </View>
          </View>

          {formData.etat_bien && (
            <View style={{ marginBottom: 15 }}>
              <Text style={styles.caracLabel}>État du bien</Text>
              <Text style={styles.caracValue}>{ETATS_BIEN_LABELS[formData.etat_bien] || formData.etat_bien}</Text>
            </View>
          )}

          {formData.caracteristiques && formData.caracteristiques.length > 0 && (
            <View>
              <Text style={styles.caracLabel}>Atouts</Text>
              <View style={styles.badgesList}>
                {formData.caracteristiques.map((carac, index) => (
                  <View key={index} style={styles.badge}>
                    <Text style={styles.badgeText}>{CARACTERISTIQUES_LABELS[carac] || carac}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <Text style={styles.pageNumber}>2 / 6</Text>
      </Page>

      {/* === PAGE 3: ANALYSE DU MARCHÉ === */}
      <Page size="A4" style={styles.page}>
        <View style={styles.marketHeader}>
          <Text style={styles.pageTitle}>Analyse du Marché Local</Text>
        </View>
        <Text style={styles.marketCommune}>{formData.commune}</Text>

        {/* Graphique de tendance */}
        {visibility.marketTrends && historique.length > 0 && (() => {
          const width = 350;
          const height = 100;
          const padding = { top: 10, right: 10, bottom: 10, left: 10 };

          const prices = historique.map(d => d.prix);
          const minPrice = Math.min(...prices) * 0.95;
          const maxPrice = Math.max(...prices) * 1.05;

          const xScale = (index) => {
            return padding.left + (index / (historique.length - 1)) * (width - padding.left - padding.right);
          };

          const yScale = (price) => {
            return height - padding.bottom - ((price - minPrice) / (maxPrice - minPrice)) * (height - padding.top - padding.bottom);
          };

          const linePath = historique
            .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.prix)}`)
            .join(' ');

          const areaPath = `${linePath} L ${xScale(historique.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

          const isPositive = variation.pourcentage >= 0;
          const lineColor = isPositive ? '#10B981' : '#EF4444';
          const areaColor = isPositive ? '#D1FAE5' : '#FEE2E2';

          return (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Évolution du prix au m² - {formData.commune}</Text>
              <View style={styles.chartWrapper}>
                <View style={styles.chartSvg}>
                  <Svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 100 }}>
                    <Path d={areaPath} fill={areaColor} />
                    <Path d={linePath} fill="none" stroke={lineColor} strokeWidth={2} />
                  </Svg>
                  <View style={styles.chartYears}>
                    <Text style={styles.chartYear}>{historique[0]?.annee}</Text>
                    <Text style={styles.chartYear}>{historique[historique.length - 1]?.annee}</Text>
                  </View>
                </View>
                <View style={styles.chartStats}>
                  <Text style={isPositive ? styles.variationPositive : styles.variationNegative}>
                    {isPositive ? '+' : ''}{variation.pourcentage}%
                  </Text>
                  <Text style={styles.variationSince}>depuis 2020</Text>
                  <Text style={styles.currentPrice}>
                    {formatPriceXPF(historique[historique.length - 1]?.prix || 0)}/m²
                  </Text>
                </View>
              </View>
            </View>
          );
        })()}

        {/* Statistiques du marché */}
        {visibility.statsGrid && (
          <View>
            <Text style={styles.sectionTitle}>Indicateurs du Marché</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Prix/m² du secteur</Text>
                <Text style={styles.statValue}>{formatPriceXPF(prix_m2_moyen)}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Surface du bien</Text>
                <Text style={styles.statValue}>{surfacePrincipale} m²</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Prix/m² (fourchette basse)</Text>
                <Text style={styles.statValue}>{formatPriceXPF(prixM2Bas)}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Prix/m² (fourchette haute)</Text>
                <Text style={styles.statValue}>{formatPriceXPF(prixM2Haut)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Texte personnalisé après analyse marché */}
        {texteAnalyseMarche && (
          <View style={styles.agentCommentBox}>
            <Text style={styles.agentCommentText}>{texteAnalyseMarche}</Text>
          </View>
        )}

        <Text style={styles.pageNumber}>3 / 6</Text>
      </Page>

      {/* === PAGE 4: BIENS SIMILAIRES === */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageTitle}>Étude Comparative</Text>
        <Text style={styles.sectionTitle}>Biens similaires sur le marché</Text>

        {visibility.similarOffers && visibleComparables.length > 0 ? (
          <View style={styles.comparablesGrid}>
            {visibleComparables.map((offer, index) => {
              const photoUrl = cleanPhotoUrl(offer.photo_url);
              return (
                <View key={index} style={styles.comparableCard}>
                  {photoUrl ? (
                    <View style={styles.comparableImageContainer}>
                      <Image style={styles.comparableImage} src={photoUrl} />
                    </View>
                  ) : (
                    <View style={styles.comparableNoImage}>
                      <Text style={styles.comparableNoImageText}>Photo non disponible</Text>
                    </View>
                  )}
                  <View style={styles.comparableContent}>
                    <Text style={styles.comparableType}>{offer.type_bien}</Text>
                    <Text style={styles.comparablePrice}>
                      {offer.prix_formatte || `${(offer.prix / 1000000).toFixed(1)} MF`}
                    </Text>
                    <View style={styles.comparableDetails}>
                      <Text style={styles.comparableDetail}>{offer.surface} m²</Text>
                      <Text style={styles.comparableDetail}>{offer.commune}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#64748B' }}>
              Aucun bien similaire à afficher
            </Text>
          </View>
        )}

        {/* Texte personnalisé après étude comparative */}
        {texteEtudeComparative && (
          <View style={styles.agentCommentBox}>
            <Text style={styles.agentCommentText}>{texteEtudeComparative}</Text>
          </View>
        )}

        <Text style={styles.pageNumber}>4 / 6</Text>
      </Page>

      {/* === PAGE 5: ESTIMATION FINALE === */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageTitle}>Synthèse et Estimation</Text>

        <View style={styles.estimationContainer}>
          {/* Prix principal */}
          <View style={styles.estimationBox}>
            <Text style={styles.estimationLabel}>Avis de Valeur</Text>
            <Text style={styles.estimationPrice}>{formatPriceMF(displayPrice)}</Text>
            <Text style={styles.estimationPriceXPF}>soit {formatPriceXPF(displayPrice)}</Text>
          </View>

          {/* Fourchette de prix */}
          {visibility.priceGap && (
            <View style={styles.priceRangeContainer}>
              <Text style={styles.priceRangeTitle}>Fourchette de prix du marché</Text>
              <View style={styles.priceRangeBox}>
                <View style={styles.priceRangeItem}>
                  <Text style={styles.priceRangeLabel}>Prix bas</Text>
                  <Text style={styles.priceLow}>{formatPriceMF(prix_bas)}</Text>
                </View>
                <View style={styles.priceRangeItem}>
                  <Text style={styles.priceRangeLabel}>Médian</Text>
                  <Text style={styles.priceMid}>{formatPriceMF(prix_moyen)}</Text>
                </View>
                <View style={styles.priceRangeItem}>
                  <Text style={styles.priceRangeLabel}>Prix haut</Text>
                  <Text style={styles.priceHigh}>{formatPriceMF(prix_haut)}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Prix au m² */}
          <View style={styles.priceM2Info}>
            <Text style={styles.priceM2Label}>Prix au m² estimé</Text>
            <Text style={styles.priceM2Value}>{formatPriceXPF(prixM2Display)}/m²</Text>
          </View>
        </View>

        <Text style={styles.pageNumber}>5 / 6</Text>
      </Page>

      {/* === PAGE 6: CONTACT === */}
      <Page size="A4" style={styles.contactPage}>
        <Text style={styles.pageTitle}>Conclusion</Text>

        {/* Contact */}
        <View style={styles.contactSection}>
          <View style={styles.contactCard}>
            {agentLogo && (
              <Image style={styles.contactLogo} src={agentLogo} />
            )}
            {agencyName && <Text style={styles.contactAgencyName}>{agencyName}</Text>}
            {agentFullName && <Text style={styles.contactAgentName}>{agentFullName}</Text>}

            <View style={styles.contactDetails}>
              <View style={styles.contactRow}>
                {agentPhone && (
                  <View style={styles.contactItem}>
                    <Text style={styles.contactLabel}>Téléphone</Text>
                    <Text style={styles.contactValue}>{agentPhone}</Text>
                  </View>
                )}
                {agentEmail && (
                  <View style={styles.contactItem}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>{agentEmail}</Text>
                  </View>
                )}
              </View>
              {(agencyAddress || agencyWebsite) && (
                <View style={styles.contactRow}>
                  {agencyAddress && (
                    <View style={styles.contactItem}>
                      <Text style={styles.contactLabel}>Adresse</Text>
                      <Text style={styles.contactValue}>{agencyAddress}</Text>
                    </View>
                  )}
                  {agencyWebsite && (
                    <View style={styles.contactItem}>
                      <Text style={styles.contactLabel}>Site web</Text>
                      <Text style={styles.contactValue}>{agencyWebsite}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* CTA */}
            <View style={styles.ctaBox}>
              <Text style={styles.ctaText}>
                Passons à l'étape suivante : rencontrons-nous pour définir votre stratégie de vente.
              </Text>
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>Information importante</Text>
          <Text style={styles.disclaimerText}>
            Ce document constitue un avis de valeur établi sur la base des données du marché immobilier polynésien.
            Il est fourni à titre indicatif et ne constitue pas une expertise immobilière au sens juridique du terme.
            Seule une expertise réalisée par un expert agréé peut faire foi en cas de litige.
          </Text>
        </View>

        <Text style={styles.pageNumber}>6 / 6</Text>
      </Page>
    </Document>
  );
}
