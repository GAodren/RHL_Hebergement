import { Document, Page, Text, View, StyleSheet, Image, Svg, Path, Line, Rect } from '@react-pdf/renderer';
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

// Styles pour le PDF - Design agence
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  // Header avec identité agence
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #0077B6',
    paddingBottom: 15,
  },
  headerWithLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  agencyLogo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
    marginRight: 20,
  },
  headerInfo: {
    flex: 1,
  },
  agencyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  agencyNameLarge: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  agentInfoHeader: {
    marginTop: 8,
  },
  agentName: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 2,
  },
  agentContact: {
    fontSize: 10,
    color: '#64748B',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    marginBottom: 12,
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
    padding: 12,
    marginBottom: 12,
    border: '1px solid #BAE6FD',
  },
  bienWithPhoto: {
    flexDirection: 'row',
    gap: 15,
  },
  bienPhotoContainer: {
    width: 100,
    height: 100,
    borderRadius: 6,
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
  },
  bienPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  bienInfo: {
    flex: 1,
  },
  bienRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  bienColumn: {
    flex: 1,
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
  // Prix proposé (principal)
  priceBox: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 9,
    color: '#BAE6FD',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priceSubValue: {
    fontSize: 9,
    color: '#BAE6FD',
    marginTop: 4,
  },
  // Fourchette de prix
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    border: '1px solid #E2E8F0',
  },
  priceColumn: {
    alignItems: 'center',
    flex: 1,
  },
  priceRangeLabel: {
    fontSize: 7,
    color: '#64748B',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  priceLow: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#10B981',
  },
  priceMid: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0077B6',
  },
  priceHigh: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  // Statistiques
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
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
  // Avertissement
  disclaimer: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    border: '1px solid #FCD34D',
  },
  disclaimerText: {
    fontSize: 8,
    color: '#92400E',
  },
  date: {
    fontSize: 8,
    color: '#64748B',
    textAlign: 'right',
    marginTop: 8,
  },
  // Footer avec infos agence complètes
  footer: {
    marginTop: 20,
    borderTop: '1px solid #E2E8F0',
    paddingTop: 15,
  },
  aboutSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    border: '1px solid #E2E8F0',
  },
  aboutTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  aboutText: {
    fontSize: 8,
    color: '#475569',
    lineHeight: 1.4,
  },
  footerDivider: {
    marginTop: 10,
  },
  footerAgency: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footerAgencyName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  footerAgencyContact: {
    fontSize: 8,
    color: '#64748B',
    marginBottom: 1,
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  // Tendance du marché
  marketTrendsSection: {
    marginBottom: 12,
  },
  marketTrendsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 12,
    border: '1px solid #E2E8F0',
    maxWidth: 250,
  },
  marketTrendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  marketTrendsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  marketTrendsCommune: {
    fontSize: 8,
    color: '#64748B',
  },
  marketTrendsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  marketTrendsChart: {
    flex: 1,
  },
  marketTrendsYears: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  marketTrendsYear: {
    fontSize: 7,
    color: '#64748B',
  },
  marketTrendsStats: {
    alignItems: 'flex-end',
    minWidth: 70,
  },
  marketTrendsVariation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  variationText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#10B981',
  },
  variationTextNegative: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  marketTrendsSince: {
    fontSize: 7,
    color: '#64748B',
    marginBottom: 4,
  },
  marketTrendsCurrentPrice: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  // Biens similaires
  similarOffersSection: {
    marginBottom: 12,
  },
  similarOffersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  similarOfferCard: {
    width: '48%',
    border: '1px solid #E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  similarOfferImageContainer: {
    height: 70,
    backgroundColor: '#F1F5F9',
  },
  similarOfferImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  similarOfferNoImage: {
    height: 70,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  similarOfferNoImageText: {
    fontSize: 7,
    color: '#94A3B8',
  },
  similarOfferContent: {
    padding: 8,
  },
  similarOfferType: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 2,
  },
  similarOfferPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  similarOfferDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  similarOfferDetail: {
    fontSize: 7,
    color: '#64748B',
  },
});

export default function RapportPDF({ result, formData, adjustedPrice, agentProfile, bienPhoto, sectionVisibility }) {
  const { prix_bas, prix_moyen, prix_haut, prix_m2_moyen } = result;

  // Visibilité par défaut si non fournie
  const visibility = sectionVisibility || {
    marketTrends: true,
    statsGrid: true,
    priceGap: true,
    similarOffers: true,
    note: true,
  };

  // Informations de l'agent et de l'agence
  const agentFullName = agentProfile ? [agentProfile.prenom, agentProfile.nom].filter(Boolean).join(' ') : '';
  const agencyName = agentProfile?.agence || '';
  const agentPhone = agentProfile?.telephone || '';
  const agentEmail = agentProfile?.email || '';
  const agentLogo = agentProfile?.logo_url || null;
  const cartePro = agentProfile?.numero_carte_pro || '';
  const agencyAddress = agentProfile?.adresse || '';
  const agencyWebsite = agentProfile?.site_web || '';
  const agencyDescription = agentProfile?.description_agence || '';

  // Le prix affiché est soit le prix ajusté, soit le prix moyen
  const displayPrice = adjustedPrice || prix_moyen;

  // Pour les terrains, on utilise surface_terrain, sinon surface habitable
  const surfacePrincipale = formData.categorie === 'Terrain' ? formData.surface_terrain : formData.surface;

  const prixM2Bas = surfacePrincipale ? Math.round(prix_bas / surfacePrincipale) : 0;
  const prixM2Haut = surfacePrincipale ? Math.round(prix_haut / surfacePrincipale) : 0;

  // Option B : afficher la fourchette seulement si le prix est dans la fourchette
  const showPriceRange = displayPrice >= prix_bas && displayPrice <= prix_haut;

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

  // Vérifier si on a des infos d'agence à afficher
  const hasAgencyInfo = agencyName || agentFullName;
  const hasAgencyFooterInfo = agencyAddress || agentPhone || agentEmail || agencyWebsite;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête avec identité agence */}
        <View style={styles.header}>
          {agentLogo ? (
            // Header avec logo
            <View style={styles.headerWithLogo}>
              <Image style={styles.agencyLogo} src={agentLogo} />
              <View style={styles.headerInfo}>
                {agencyName && <Text style={styles.agencyName}>{agencyName}</Text>}
                <View style={styles.agentInfoHeader}>
                  {agentFullName && <Text style={styles.agentName}>{agentFullName}</Text>}
                  {agentPhone && <Text style={styles.agentContact}>{agentPhone}</Text>}
                  {cartePro && <Text style={styles.agentContact}>Carte pro : {cartePro}</Text>}
                </View>
              </View>
            </View>
          ) : (
            // Header sans logo - nom de l'agence en grand
            <View>
              <Text style={styles.agencyNameLarge}>{agencyName || 'Estimation Immobilière'}</Text>
              <View style={styles.agentInfoHeader}>
                {agentFullName && <Text style={styles.agentName}>{agentFullName}</Text>}
                {agentPhone && <Text style={styles.agentContact}>{agentPhone}</Text>}
                {cartePro && <Text style={styles.agentContact}>Carte pro : {cartePro}</Text>}
              </View>
            </View>
          )}
        </View>

        <Text style={styles.title}>Rapport d'estimation immobilière</Text>

        {/* Description du bien */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bien estimé</Text>
          <View style={styles.bienBox}>
            <View style={bienPhoto ? styles.bienWithPhoto : {}}>
              {bienPhoto && (
                <View style={styles.bienPhotoContainer}>
                  <Image style={styles.bienPhoto} src={bienPhoto} />
                </View>
              )}
              <View style={bienPhoto ? styles.bienInfo : {}}>
                <View style={styles.bienRow}>
                  <View style={styles.bienColumn}>
                    <Text style={styles.bienLabel}>Type de bien</Text>
                    <Text style={styles.bienValue}>{formData.categorie} {formData.type_bien || ''}</Text>
                  </View>
                  <View style={styles.bienColumn}>
                    <Text style={styles.bienLabel}>{getSurfaceLabel()}</Text>
                    <Text style={styles.bienValue}>{surfacePrincipale} m²</Text>
                  </View>
                  <View style={styles.bienColumn}>
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
          </View>
        </View>

        {/* Prix de vente proposé */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prix de vente proposé</Text>
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Estimation du bien</Text>
            <Text style={styles.priceValue}>{formatPriceMF(displayPrice)}</Text>
            <Text style={styles.priceSubValue}>soit {formatPriceXPF(displayPrice)}</Text>
          </View>
        </View>

        {/* Fourchette de prix - seulement si visible et prix dans la fourchette */}
        {visibility.priceGap && showPriceRange && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fourchette de prix du marché</Text>
            <View style={styles.priceRange}>
              <View style={styles.priceColumn}>
                <Text style={styles.priceRangeLabel}>Prix bas</Text>
                <Text style={styles.priceLow}>{formatPriceMF(prix_bas)}</Text>
              </View>
              <View style={styles.priceColumn}>
                <Text style={styles.priceRangeLabel}>Médian</Text>
                <Text style={styles.priceMid}>{formatPriceMF(prix_moyen)}</Text>
              </View>
              <View style={styles.priceColumn}>
                <Text style={styles.priceRangeLabel}>Prix haut</Text>
                <Text style={styles.priceHigh}>{formatPriceMF(prix_haut)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Statistiques du marché */}
        {visibility.statsGrid && (
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
          </View>
        )}

        {/* Tendance du marché avec graphique */}
        {visibility.marketTrends && formData.commune && (() => {
          const historique = getHistoriqueCommune(formData.commune);
          const variation = getVariation(formData.commune);
          if (historique.length === 0) return null;

          // Dimensions du graphique
          const width = 200;
          const height = 50;
          const padding = { top: 5, right: 5, bottom: 5, left: 5 };

          // Calculer les échelles
          const prices = historique.map(d => d.prix);
          const minPrice = Math.min(...prices) * 0.95;
          const maxPrice = Math.max(...prices) * 1.05;

          const xScale = (index) => {
            return padding.left + (index / (historique.length - 1)) * (width - padding.left - padding.right);
          };

          const yScale = (price) => {
            return height - padding.bottom - ((price - minPrice) / (maxPrice - minPrice)) * (height - padding.top - padding.bottom);
          };

          // Générer le path pour la ligne
          const linePath = historique
            .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.prix)}`)
            .join(' ');

          // Path pour la zone sous la courbe (area)
          const areaPath = `${linePath} L ${xScale(historique.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

          const isPositive = variation.pourcentage >= 0;
          const lineColor = isPositive ? '#10B981' : '#EF4444';
          const areaColor = isPositive ? '#D1FAE5' : '#FEE2E2';

          return (
            <View style={styles.marketTrendsSection}>
              <Text style={styles.sectionTitle}>Tendance du marché</Text>
              <View style={styles.marketTrendsBox}>
                <View style={styles.marketTrendsHeader}>
                  <Text style={styles.marketTrendsTitle}>Évolution du prix au m²</Text>
                  <Text style={styles.marketTrendsCommune}>{formData.commune}</Text>
                </View>
                <View style={styles.marketTrendsContent}>
                  <View style={styles.marketTrendsChart}>
                    <Svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 50 }}>
                      {/* Zone sous la courbe */}
                      <Path d={areaPath} fill={areaColor} />
                      {/* Ligne principale */}
                      <Path
                        d={linePath}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth={1.5}
                      />
                    </Svg>
                    <View style={styles.marketTrendsYears}>
                      <Text style={styles.marketTrendsYear}>{historique[0]?.annee}</Text>
                      <Text style={styles.marketTrendsYear}>{historique[historique.length - 1]?.annee}</Text>
                    </View>
                  </View>
                  <View style={styles.marketTrendsStats}>
                    <View style={styles.marketTrendsVariation}>
                      <Text style={isPositive ? styles.variationText : styles.variationTextNegative}>
                        {isPositive ? '+' : ''}{variation.pourcentage}%
                      </Text>
                    </View>
                    <Text style={styles.marketTrendsSince}>depuis 2020</Text>
                    <Text style={styles.marketTrendsCurrentPrice}>
                      {formatPriceXPF(historique[historique.length - 1]?.prix || 0)}/m²
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })()}

        {/* Biens similaires avec images */}
        {visibility.similarOffers && result.comparables && result.comparables.length > 0 && (
          <View style={styles.similarOffersSection}>
            <Text style={styles.sectionTitle}>Biens similaires sur le marché</Text>
            <View style={styles.similarOffersGrid}>
              {result.comparables.slice(0, 4).map((offer, index) => {
                const photoUrl = cleanPhotoUrl(offer.photo_url);
                return (
                  <View key={index} style={styles.similarOfferCard}>
                    {/* Image du bien */}
                    {photoUrl ? (
                      <View style={styles.similarOfferImageContainer}>
                        <Image style={styles.similarOfferImage} src={photoUrl} />
                      </View>
                    ) : (
                      <View style={styles.similarOfferNoImage}>
                        <Text style={styles.similarOfferNoImageText}>Photo non disponible</Text>
                      </View>
                    )}
                    {/* Contenu */}
                    <View style={styles.similarOfferContent}>
                      <Text style={styles.similarOfferType}>{offer.type_bien}</Text>
                      <Text style={styles.similarOfferPrice}>
                        {offer.prix_formatte || `${(offer.prix / 1000000).toFixed(1)} MF`}
                      </Text>
                      <View style={styles.similarOfferDetails}>
                        <Text style={styles.similarOfferDetail}>{offer.surface} m²</Text>
                        <Text style={styles.similarOfferDetail}>{offer.commune}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Avertissement - toujours affiché */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Cette estimation est basée sur les données du marché immobilier polynésien.
            Elle est fournie à titre indicatif et ne constitue pas une évaluation officielle.
          </Text>
        </View>

        {/* Date */}
        <Text style={styles.date}>Rapport réalisé le {formatDate()}</Text>

        {/* Footer avec À propos de l'agence et coordonnées */}
        <View style={styles.footer}>
          {/* À propos de l'agence */}
          {agencyDescription && (
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>À propos de l'agence</Text>
              <Text style={styles.aboutText}>{agencyDescription}</Text>
            </View>
          )}

          {/* Coordonnées de l'agence */}
          {hasAgencyFooterInfo && (
            <View style={styles.footerDivider}>
              <View style={styles.footerAgency}>
                <View>
                  {agencyName && <Text style={styles.footerAgencyName}>{agencyName}</Text>}
                  {agencyAddress && <Text style={styles.footerAgencyContact}>{agencyAddress}</Text>}
                  {agentPhone && <Text style={styles.footerAgencyContact}>Tél : {agentPhone}</Text>}
                </View>
                <View style={styles.footerRight}>
                  {agentEmail && <Text style={styles.footerAgencyContact}>{agentEmail}</Text>}
                  {agencyWebsite && <Text style={styles.footerAgencyContact}>{agencyWebsite}</Text>}
                </View>
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
