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
  garage: 'Garage',
  parking: 'Parking',
  terrasse: 'Terrasse',
};

// Styles pour le PDF professionnel 9 pages
const styles = StyleSheet.create({
  // === PAGE COMMUNE ===
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  // Style pour texte bold (utiliser fontFamily au lieu de fontWeight)
  textBold: {
    fontFamily: 'Helvetica-Bold',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 9,
    color: '#94A3B8',
  },
  // Logo en haut à droite des pages
  pageLogoContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 70,
    height: 70,
  },
  pageLogoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
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
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
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
  coverAgencyLogoContainer: {
    width: 70,
    height: 70,
  },
  coverAgencyLogoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  coverAgencyInfo: {
    flex: 1,
    marginLeft: 15,
  },
  coverAgencyName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
    color: '#0077B6',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: '2px solid #0077B6',
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  photoItem: {
    width: '48%',
  },
  photoContainer: {
    height: 120,
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
    padding: 10,
    paddingBottom: 6,
    border: '1px solid #E2E8F0',
  },
  caracteristiquesRow: {
    flexDirection: 'row',
    marginBottom: 6,
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
    fontFamily: 'Helvetica-Bold',
  },
  atoutsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  atoutsLabel: {
    fontSize: 9,
    color: '#64748B',
    textTransform: 'uppercase',
    marginRight: 4,
    paddingTop: 5,
  },
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
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
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
    color: '#10B981',
  },
  variationNegative: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#EF4444',
  },
  variationSince: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
  },

  // === COMMENTAIRE AGENT ===
  agentCommentBox: {
    marginTop: 8,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 10,
    borderLeft: '4px solid #0077B6',
  },
  agentCommentTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
    color: '#0077B6',
    marginBottom: 4,
  },
  comparablePrice: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
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
    alignItems: 'center',
    marginBottom: 25,
  },
  estimationBox: {
    backgroundColor: '#0077B6',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  estimationLabel: {
    fontSize: 12,
    color: '#BAE6FD',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  estimationPrice: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  estimationPriceM2: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 5,
  },
  estimationPriceM2Label: {
    fontSize: 9,
    color: '#BAE6FD',
    textAlign: 'center',
    marginBottom: 2,
  },
  estimationPriceM2Value: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  priceRangeContainer: {
    marginTop: 25,
    width: '100%',
  },
  priceRangeTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
    color: '#10B981',
  },
  priceMid: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#0077B6',
  },
  priceHigh: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#F59E0B',
  },

  // === PAGE 6: CONTACT ===
  contactPage: {
    padding: 30,
    paddingTop: 25,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  disclaimerBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 4,
    padding: 8,
    marginTop: 'auto',
    border: '1px solid #FCD34D',
  },
  disclaimerTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#92400E',
    marginBottom: 2,
  },
  disclaimerText: {
    fontSize: 6,
    color: '#92400E',
    lineHeight: 1.2,
  },
  // Styles pour la commission
  commissionBox: {
    marginTop: 20,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 15,
    border: '1px solid #BBF7D0',
  },
  commissionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
    marginBottom: 10,
    textAlign: 'center',
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commissionLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  commissionValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
  },
  commissionValueGreen: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#16A34A',
  },
  commissionDivider: {
    borderTop: '1px solid #BBF7D0',
    marginVertical: 8,
  },
  finalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finalPriceLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
  },
  finalPriceValue: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
  },
  // Styles pour le prix net
  prixNetBox: {
    marginTop: 15,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    border: '2px solid #10B981',
  },
  prixNetLabel: {
    fontSize: 10,
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  prixNetValue: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#10B981',
  },
  contactBlocksContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  contactBlock: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    border: '1px solid #E2E8F0',
  },
  contactBlockTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0077B6',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactBlockContent: {
    alignItems: 'center',
  },
  agencyLogoContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  agencyLogoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  agentPhoto: {
    width: 70,
    height: 70,
    objectFit: 'cover',
    borderRadius: 35,
    marginBottom: 8,
  },
  contactName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
    marginBottom: 3,
    textAlign: 'center',
  },
  contactSubtext: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 1,
  },
  // Styles pour blocs pleine largeur
  contactBlockFull: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 15,
    border: '1px solid #E2E8F0',
    marginBottom: 10,
  },
  contactBlockContentHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  contactInfoColumn: {
    flex: 1,
  },
  agencyLogoLargeContainer: {
    width: 80,
    height: 80,
  },
  agencyLogoLargeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  agentPhotoLarge: {
    width: 60,
    height: 60,
    objectFit: 'cover',
    borderRadius: 30,
  },
  contactNameLarge: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  contactSubtextLarge: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 1,
  },
  agencyDescriptionBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1px solid #E2E8F0',
  },
  agencyDescriptionText: {
    fontSize: 8,
    color: '#475569',
    lineHeight: 1.3,
    fontStyle: 'italic',
  },

  // === PAGE 7: PIÈCES JUSTIFICATIVES ===
  justificatifsPage: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  justificatifsTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0077B6',
    textAlign: 'center',
    marginBottom: 8,
  },
  justificatifsSubtitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#0077B6',
    textAlign: 'center',
    marginBottom: 30,
  },
  justificatifsSection: {
    marginBottom: 35,
  },
  justificatifsSectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: '1px solid #E2E8F0',
  },
  justificatifsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingLeft: 5,
  },
  checkbox: {
    width: 14,
    height: 14,
    border: '1.5px solid #64748B',
    borderRadius: 2,
    marginRight: 10,
    marginTop: 1,
  },
  justificatifsText: {
    fontSize: 10,
    color: '#334155',
    flex: 1,
    lineHeight: 1.4,
  },
  justificatifsNote: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    border: '1px solid #E2E8F0',
  },
  justificatifsNoteText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },

  // === PAGE 2: ÉTUDE COMPARATIVE DE MARCHÉ ===
  ecmPage: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  ecmMainTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#0077B6',
    textAlign: 'center',
    marginBottom: 5,
  },
  ecmSubtitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0077B6',
    textAlign: 'center',
    marginBottom: 30,
  },
  ecmIntroBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 18,
    marginBottom: 25,
    borderLeft: '4px solid #0077B6',
  },
  ecmIntroTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0077B6',
    marginBottom: 10,
  },
  ecmIntroText: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  ecmSection: {
    marginBottom: 20,
  },
  ecmSectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '1px solid #E2E8F0',
  },
  ecmSectionContent: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  ecmIconRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  ecmIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0077B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ecmIconText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
  },
  ecmSectionTextBlock: {
    flex: 1,
  },

  // === PAGE "COMMENT DÉTERMINER LE PRIX DE VENTE" ===
  prixVentePage: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  prixVenteTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0077B6',
    marginBottom: 25,
    paddingBottom: 10,
    borderBottom: '2px solid #0077B6',
    textAlign: 'center',
  },
  prixVenteIntro: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.6,
    marginBottom: 30,
    textAlign: 'justify',
  },
  pyramidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  pyramidLevelsWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  pyramidLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  pyramidChevron: {
    width: 20,
    height: 50,
  },
  pyramidLevelContent: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pyramidLevelRed: {
    backgroundColor: '#DC2626',
    width: 200,
  },
  pyramidLevelOrange: {
    backgroundColor: '#F59E0B',
    width: 240,
  },
  pyramidLevelGreen: {
    backgroundColor: '#84CC16',
    width: 280,
  },
  pyramidText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  pyramidTextRed: {},
  pyramidTextOrange: {},
  pyramidTextGreen: {},
  pyramidLegendContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 25,
    height: 160,
    justifyContent: 'space-between',
  },
  pyramidArrowContainer: {
    alignItems: 'center',
    height: 120,
    justifyContent: 'center',
  },
  pyramidArrowLine: {
    width: 2,
    height: 80,
    backgroundColor: '#64748B',
  },
  pyramidArrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#64748B',
  },
  pyramidLegendTop: {
    alignItems: 'center',
  },
  pyramidLegendArrow: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
  },
  pyramidLegendText: {
    fontSize: 9,
    color: '#64748B',
  },
  pyramidLegendBottom: {
    alignItems: 'center',
  },
  pyramidLegendBottomText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
  },
  prixVenteExplication: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 20,
    border: '1px solid #E2E8F0',
    marginTop: 20,
  },
  prixVenteExplicationText: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.7,
    textAlign: 'justify',
  },
});

export default function RapportPDF({ result, formData, adjustedPrice, commission, agentProfile, bienPhoto, photosSupplementaires = [], nomClient = '', texteAnalyseMarche = '', texteEtudeComparative = '', texteSynthese = '', sectionVisibility, selectedComparables = [], editedComparables = {} }) {
  const { prix_bas, prix_moyen, prix_haut, prix_m2_moyen } = result;

  // Calcul des prix au m² bas et haut à partir des prix totaux
  const surface = formData.surface || formData.surface_terrain || 1;
  const prixM2Bas = Math.round(prix_bas / surface);
  const prixM2Haut = Math.round(prix_haut / surface);

  // Visibilité par défaut si non fournie
  const visibility = sectionVisibility || {
    marketTrends: true,
    statsGrid: true,
    priceGap: true,
    similarOffers: true,
    bienDetails: true,
  };

  // Vérifier si on a des détails du bien à afficher
  const hasBienDetails = formData.etat_bien || formData.nb_chambres || formData.nb_sdb || (formData.caracteristiques && formData.caracteristiques.length > 0);

  // Filtrer les biens similaires sélectionnés et appliquer les modifications
  const visibleComparables = result.comparables
    ? result.comparables
        .map((offer, index) => {
          const edited = editedComparables[index] || {};
          const hasEditedPrice = edited.prix !== undefined;
          const newPrix = hasEditedPrice ? edited.prix : offer.prix;
          return {
            ...offer,
            originalIndex: index,
            prix: newPrix,
            prix_formatte: hasEditedPrice ? `${(newPrix / 1000000).toFixed(1)} MF` : offer.prix_formatte,
            surface: edited.surface !== undefined ? edited.surface : offer.surface,
            photo_url: edited.photo_url || offer.photo_url
          };
        })
        .filter((_, index) => selectedComparables.includes(index))
        .slice(0, 4)
    : [];

  // Informations de l'agent et de l'agence
  const agentFullName = agentProfile ? [agentProfile.prenom, agentProfile.nom].filter(Boolean).join(' ') : '';
  const agencyName = agentProfile?.agence || '';
  const agentPhone = agentProfile?.telephone || '';
  const agentEmail = agentProfile?.email || '';
  const agentLogo = agentProfile?.logo_url || null;
  const agentPhoto = agentProfile?.photo_agent_url || null;
  const cartePro = agentProfile?.numero_carte_pro || '';
  const agencyAddress = agentProfile?.adresse || '';
  const agencyPhone = agentProfile?.telephone_agence || '';
  const agencyWebsite = agentProfile?.site_web || '';
  const agencyDescription = agentProfile?.description_agence || '';

  // Le prix affiché est soit le prix ajusté, soit le prix moyen
  const displayPrice = adjustedPrice || prix_moyen;

  // Calcul de la commission (retrait du prix de vente pour obtenir le prix net)
  const hasCommission = commission && commission > 0;
  const commissionAmount = hasCommission ? Math.round(displayPrice * (commission / 100)) : 0;
  // Prix de vente = prix affiché (avec commission incluse)
  const prixDeVente = displayPrice;
  // Prix net = prix de vente - commission
  const prixNet = hasCommission ? displayPrice - commissionAmount : displayPrice;

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
          <Text style={styles.coverTitle}>Avis de Valeur Immobilier</Text>
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
              <Text style={styles.coverBienLabel}>Surface habitable</Text>
              <Text style={styles.coverBienValue}>{formData.surface || '-'} m²</Text>
            </View>
            <View style={styles.coverBienItem}>
              <Text style={styles.coverBienLabel}>Surface terrain</Text>
              <Text style={styles.coverBienValue}>{formData.surface_terrain || '-'} m²</Text>
            </View>
            <View style={styles.coverBienItem}>
              <Text style={styles.coverBienLabel}>Localisation</Text>
              <Text style={styles.coverBienValue}>{formData.commune}</Text>
            </View>
          </View>

          {/* Section agence */}
          <View style={styles.coverAgencySection}>
            {agentLogo && (
              <View style={styles.coverAgencyLogoContainer}>
                <Image style={styles.coverAgencyLogoImage} src={agentLogo} />
              </View>
            )}
            <View style={styles.coverAgencyInfo}>
              {agencyName && <Text style={styles.coverAgencyName}>{agencyName}</Text>}
              {agentFullName && <Text style={styles.coverAgentName}>{agentFullName}</Text>}
              {cartePro && <Text style={styles.coverAgentContact}>Carte professionnelle : {cartePro}</Text>}
            </View>
            <Text style={styles.coverDate}>{formatDate()}</Text>
          </View>
        </View>

        <Text style={styles.pageNumber}>1 / 9</Text>
      </Page>

      {/* === PAGE 2: ÉTUDE COMPARATIVE DE MARCHÉ === */}
      <Page size="A4" style={styles.ecmPage}>
        {agentLogo && (
          <View style={styles.pageLogoContainer}>
            <Image style={styles.pageLogoImage} src={agentLogo} />
          </View>
        )}

        <Text style={styles.pageTitle}>Étude Comparative de Marché</Text>

        {/* Introduction ECM */}
        <View style={styles.ecmIntroBox}>
          <Text style={styles.ecmIntroTitle}>Qu'est-ce qu'une Étude Comparative de Marché (ECM) ?</Text>
          <Text style={styles.ecmIntroText}>
            L'étude comparative de marché permet d'évaluer un bien immobilier en le comparant aux autres biens du marché. Le bien est analysé par rapport aux biens similaires récemment vendus, actuellement en vente, ou restés invendus. Cette comparaison s'appuie sur trois critères essentiels : la localisation, les caractéristiques du bien, et les prix pratiqués sur le marché.
          </Text>
        </View>

        {/* Section Localisation */}
        <View style={styles.ecmSection}>
          <View style={styles.ecmIconRow}>
            <View style={styles.ecmIconCircle}>
              <Text style={styles.ecmIconText}>1</Text>
            </View>
            <View style={styles.ecmSectionTextBlock}>
              <Text style={styles.ecmSectionTitle}>Localisation du bien</Text>
              <Text style={styles.ecmSectionContent}>
                La situation géographique comprend la ville, la commune, l'emplacement au sein du quartier, l'orientation, la vue et les points d'intérêt ou nuisances à proximité. Cette analyse intègre également les projets d'aménagement susceptibles d'impacter la valeur du bien. L'attractivité de l'adresse et la demande en logement sur le secteur sont des facteurs déterminants.
              </Text>
            </View>
          </View>
        </View>

        {/* Section Caractéristiques */}
        <View style={styles.ecmSection}>
          <View style={styles.ecmIconRow}>
            <View style={styles.ecmIconCircle}>
              <Text style={styles.ecmIconText}>2</Text>
            </View>
            <View style={styles.ecmSectionTextBlock}>
              <Text style={styles.ecmSectionTitle}>Caractéristiques et spécificités</Text>
              <Text style={styles.ecmSectionContent}>
                La surface, le nombre de pièces, l'agencement, la date de construction, la qualité des matériaux, les équipements, les prestations, les charges et taxes, ainsi que la rareté du bien. Tous ces éléments sont essentiels pour réaliser une analyse cohérente et objective de la valeur du bien immobilier.
              </Text>
            </View>
          </View>
        </View>

        {/* Section Prix du marché */}
        <View style={styles.ecmSection}>
          <View style={styles.ecmIconRow}>
            <View style={styles.ecmIconCircle}>
              <Text style={styles.ecmIconText}>3</Text>
            </View>
            <View style={styles.ecmSectionTextBlock}>
              <Text style={styles.ecmSectionTitle}>Prix du marché immobilier</Text>
              <Text style={styles.ecmSectionContent}>
                Pour établir le juste prix de vente, il est nécessaire de prendre en compte tous les facteurs influant sur la valeur : l'analyse de la localisation, les caractéristiques et spécificités, mais aussi le dynamisme du marché. L'ECM s'appuie sur l'étude des biens similaires vendus, des biens récemment mis en vente, et des biens restés invendus sur le secteur.
              </Text>
            </View>
          </View>
        </View>

        {/* Conclusion */}
        <View style={{ backgroundColor: '#F8FAFC', borderRadius: 8, padding: 15, border: '1px solid #E2E8F0', marginTop: 10 }}>
          <Text style={{ fontSize: 10, color: '#334155', lineHeight: 1.6, textAlign: 'center', fontStyle: 'italic' }}>
            Cette méthodologie rigoureuse nous permet de vous proposer un avis de valeur fiable et argumenté, reflétant la réalité du marché immobilier local.
          </Text>
        </View>

        <Text style={styles.pageNumber}>2 / 9</Text>
      </Page>

      {/* === PAGE 3: FICHE TECHNIQUE === */}
      <Page size="A4" style={styles.page}>
        {agentLogo && (
          <View style={styles.pageLogoContainer}>
            <Image style={styles.pageLogoImage} src={agentLogo} />
          </View>
        )}
        <Text style={styles.pageTitle}>Fiche Technique du Bien</Text>

        {/* Photos supplémentaires */}
        {photosSupplementaires && photosSupplementaires.length > 0 && (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.sectionTitle}>Galerie Photos</Text>
            <View style={styles.photosGrid}>
              {photosSupplementaires.slice(0, 6).map((photo, index) => {
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
            <View style={styles.caracteristiquesColumn}>
              {formData.nb_sdb && (
                <>
                  <Text style={styles.caracLabel}>Salles d'eau</Text>
                  <Text style={styles.caracValue}>{formData.nb_sdb}</Text>
                </>
              )}
            </View>
          </View>

          <View style={[styles.caracteristiquesRow, { marginBottom: 0 }]}>
            {formData.nb_chambres && (
              <View style={styles.caracteristiquesColumn}>
                <Text style={styles.caracLabel}>Chambres</Text>
                <Text style={styles.caracValue}>{formData.nb_chambres}</Text>
              </View>
            )}
            {formData.etat_bien && (
              <View style={styles.caracteristiquesColumn}>
                <Text style={styles.caracLabel}>État du bien</Text>
                <Text style={styles.caracValue}>{ETATS_BIEN_LABELS[formData.etat_bien] || formData.etat_bien}</Text>
              </View>
            )}
            <View style={styles.caracteristiquesColumn} />
          </View>

          {formData.caracteristiques && formData.caracteristiques.length > 0 && (
            <View style={styles.atoutsRow}>
              <Text style={styles.atoutsLabel}>Atouts :</Text>
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

        <Text style={styles.pageNumber}>3 / 9</Text>
      </Page>

      {/* === PAGE 4: ANALYSE DU MARCHÉ === */}
      <Page size="A4" style={styles.page}>
        {agentLogo && (
          <View style={styles.pageLogoContainer}>
            <Image style={styles.pageLogoImage} src={agentLogo} />
          </View>
        )}
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
                <Text style={styles.statLabel}>Secteur</Text>
                <Text style={styles.statValue}>{formData.commune}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Prix/m² du secteur</Text>
                <Text style={styles.statValue}>{formatPriceXPF(prix_m2_moyen)}</Text>
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

        <Text style={styles.pageNumber}>4 / 9</Text>
      </Page>

      {/* === PAGE 5: BIENS SIMILAIRES === */}
      <Page size="A4" style={styles.page}>
        {agentLogo && (
          <View style={styles.pageLogoContainer}>
            <Image style={styles.pageLogoImage} src={agentLogo} />
          </View>
        )}
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

        <Text style={styles.pageNumber}>5 / 9</Text>
      </Page>

      {/* === PAGE 6: COMMENT DÉTERMINER LE PRIX DE VENTE === */}
      <Page size="A4" style={styles.page}>
        {agentLogo && (
          <View style={styles.pageLogoContainer}>
            <Image style={styles.pageLogoImage} src={agentLogo} />
          </View>
        )}
        <Text style={styles.pageTitle}>Comment déterminer le prix de vente</Text>

        <Text style={{ fontSize: 11, color: '#334155', lineHeight: 1.6, marginBottom: 20 }}>
          Le prix de vente est un élément clé pour réussir votre transaction immobilière. Un prix bien calibré attire davantage d'acheteurs et accélère la vente, tandis qu'un prix mal ajusté peut freiner l'intérêt et allonger les délais.
        </Text>

        {/* Les 3 scénarios de prix */}
        <View style={{ marginBottom: 20 }}>
          {/* Scénario 1 : Prix trop élevé */}
          <View style={{ backgroundColor: '#FEF2F2', borderRadius: 8, padding: 15, marginBottom: 12, borderLeft: '4px solid #DC2626' }}>
            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#DC2626', marginBottom: 6 }}>
              Prix supérieur au marché (+10% ou plus)
            </Text>
            <Text style={{ fontSize: 10, color: '#7F1D1D', lineHeight: 1.5 }}>
              Très peu d'acheteurs potentiels. Le bien risque de rester longtemps sur le marché, ce qui peut donner l'impression qu'il y a un problème avec le bien. Cela conduit souvent à des baisses de prix successives.
            </Text>
          </View>

          {/* Scénario 2 : Prix du marché */}
          <View style={{ backgroundColor: '#F0FDF4', borderRadius: 8, padding: 15, marginBottom: 12, borderLeft: '4px solid #16A34A' }}>
            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#16A34A', marginBottom: 6 }}>
              Prix aligné sur le marché
            </Text>
            <Text style={{ fontSize: 10, color: '#14532D', lineHeight: 1.5 }}>
              Intérêt optimal des acheteurs. Le bien attire un maximum de visiteurs qualifiés, ce qui peut même créer une situation de concurrence favorable et permettre une négociation minimale.
            </Text>
          </View>

          {/* Scénario 3 : Prix sous-évalué */}
          <View style={{ backgroundColor: '#FEF3C7', borderRadius: 8, padding: 15, marginBottom: 12, borderLeft: '4px solid #D97706' }}>
            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#D97706', marginBottom: 6 }}>
              Prix inférieur au marché
            </Text>
            <Text style={{ fontSize: 10, color: '#78350F', lineHeight: 1.5 }}>
              Vente rapide mais perte financière potentielle. Un prix trop bas peut aussi susciter la méfiance des acheteurs qui peuvent penser qu'il y a un vice caché.
            </Text>
          </View>
        </View>

        {/* Section : Comment nous calculons le prix */}
        <View style={{ backgroundColor: '#F8FAFC', borderRadius: 8, padding: 18, border: '1px solid #E2E8F0', marginBottom: 15 }}>
          <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#0077B6', marginBottom: 12 }}>
            Notre méthode d'évaluation
          </Text>

          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0077B6', marginRight: 8 }}>1.</Text>
              <Text style={{ fontSize: 10, color: '#334155', flex: 1, lineHeight: 1.4 }}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>Analyse des biens comparables</Text> : nous étudions les ventes récentes et les biens actuellement en vente dans votre secteur géographique.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0077B6', marginRight: 8 }}>2.</Text>
              <Text style={{ fontSize: 10, color: '#334155', flex: 1, lineHeight: 1.4 }}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>Caractéristiques du bien</Text> : surface, nombre de pièces, état général, équipements (piscine, terrasse, vue mer...).
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0077B6', marginRight: 8 }}>3.</Text>
              <Text style={{ fontSize: 10, color: '#334155', flex: 1, lineHeight: 1.4 }}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>Emplacement</Text> : commune, quartier, proximité des commerces et services, qualité de l'environnement.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0077B6', marginRight: 8 }}>4.</Text>
              <Text style={{ fontSize: 10, color: '#334155', flex: 1, lineHeight: 1.4 }}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>Tendances du marché</Text> : évolution des prix dans votre commune sur les derniers mois.
              </Text>
            </View>
          </View>
        </View>

        {/* Conseil */}
        <View style={{ backgroundColor: '#EFF6FF', borderRadius: 8, padding: 15, border: '1px solid #BFDBFE' }}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1E40AF', marginBottom: 6 }}>
            Notre conseil
          </Text>
          <Text style={{ fontSize: 10, color: '#1E3A8A', lineHeight: 1.5 }}>
            Faites confiance à l'Étude Comparative de Marché pour fixer un prix juste dès le départ. Un bien correctement estimé se vend en moyenne deux fois plus vite qu'un bien surévalué.
          </Text>
        </View>

        <Text style={styles.pageNumber}>6 / 9</Text>
      </Page>

      {/* === PAGE 7: SYNTHÈSE ET ESTIMATION === */}
      <Page size="A4" style={styles.page}>
        {agentLogo && (
          <View style={styles.pageLogoContainer}>
            <Image style={styles.pageLogoImage} src={agentLogo} />
          </View>
        )}
        <Text style={styles.pageTitle}>Synthèse et Avis de Valeur</Text>

        <View style={{ alignItems: 'center', alignSelf: 'center', marginBottom: 20, maxWidth: 400 }}>
          <Text style={{ fontSize: 11, color: '#64748B', textAlign: 'center', lineHeight: 1.5 }}>
            Cet avis de valeur est basé sur l'analyse approfondie du bien immobilier,
          </Text>
          <Text style={{ fontSize: 11, color: '#64748B', textAlign: 'center', lineHeight: 1.5 }}>
            de ses spécificités ainsi que des prix des biens similaires sur le marché.
          </Text>
        </View>

        <View style={styles.estimationContainer}>
          {/* Prix de vente */}
          <View style={styles.estimationBox}>
            <Text style={styles.estimationLabel}>Prix de Vente</Text>
            <Text style={styles.estimationPrice}>{formatPriceXPF(prixDeVente)}</Text>
          </View>

          {/* Prix net (si commission définie) */}
          {hasCommission && (
            <View style={styles.prixNetBox}>
              <Text style={styles.prixNetLabel}>Prix Net du Bien</Text>
              <Text style={styles.prixNetValue}>{formatPriceXPF(prixNet)}</Text>
            </View>
          )}

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

        </View>

        {/* Texte personnalisé synthèse */}
        {texteSynthese && (
          <View style={styles.agentCommentBox}>
            <Text style={styles.agentCommentText}>{texteSynthese}</Text>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>Information importante</Text>
          <Text style={styles.disclaimerText}>
            Ce document a été réalisé par l'agence à partir des données du marché immobilier de votre secteur publiées sur le web. Ces données sont mises à jour en temps réel afin de suivre au plus près les évolutions du marché.
            Les indicateurs et avis de valeur de cette étude sont communiqués sous l'entière responsabilité du professionnel.
          </Text>
        </View>

        <Text style={styles.pageNumber}>7 / 9</Text>
      </Page>

      {/* === PAGE 8: CONTACT === */}
      <Page size="A4" style={styles.contactPage}>
        {agentLogo && (
          <View style={{ ...styles.pageLogoContainer, width: 50, height: 50, top: 15, right: 15 }}>
            <Image style={styles.pageLogoImage} src={agentLogo} />
          </View>
        )}
        <Text style={styles.pageTitle}>Votre Interlocuteur</Text>

        {/* Bloc Agence - pleine largeur */}
        <View style={styles.contactBlockFull}>
          <Text style={styles.contactBlockTitle}>L'Agence</Text>
          <View style={styles.contactBlockContentHorizontal}>
            {agentLogo && (
              <View style={styles.agencyLogoLargeContainer}>
                <Image style={styles.agencyLogoLargeImage} src={agentLogo} />
              </View>
            )}
            <View style={styles.contactInfoColumn}>
              {agencyName && <Text style={styles.contactNameLarge}>{agencyName}</Text>}
              {agencyAddress && <Text style={styles.contactSubtextLarge}>{agencyAddress}</Text>}
              {agencyPhone && <Text style={styles.contactSubtextLarge}>{agencyPhone}</Text>}
              {agencyWebsite && <Text style={styles.contactSubtextLarge}>{agencyWebsite}</Text>}
            </View>
          </View>
          {/* Description en dessous (limitée à 20 lignes dans le profil) */}
          {agencyDescription && (
            <View style={styles.agencyDescriptionBox}>
              <Text style={styles.agencyDescriptionText}>
                {agencyDescription}
              </Text>
            </View>
          )}
        </View>

        {/* Bloc Agent - pleine largeur */}
        <View style={{ ...styles.contactBlockFull, padding: 15, marginBottom: 10 }}>
          <Text style={{ ...styles.contactBlockTitle, marginBottom: 8, fontSize: 10 }}>Votre Conseiller</Text>
          <View style={{ ...styles.contactBlockContentHorizontal, gap: 15 }}>
            {agentPhoto && (
              <Image style={{ ...styles.agentPhotoLarge, width: 72, height: 72, borderRadius: 36 }} src={agentPhoto} />
            )}
            <View style={styles.contactInfoColumn}>
              {agentFullName && <Text style={{ ...styles.contactNameLarge, fontSize: 14 }}>{agentFullName}</Text>}
              {agentPhone && <Text style={{ ...styles.contactSubtextLarge, fontSize: 10 }}>{agentPhone}</Text>}
              {agentEmail && <Text style={{ ...styles.contactSubtextLarge, fontSize: 10 }}>{agentEmail}</Text>}
              {cartePro && <Text style={{ ...styles.contactSubtextLarge, fontSize: 10 }}>Carte pro : {cartePro}</Text>}
            </View>
          </View>
        </View>

        <Text style={styles.pageNumber}>8 / 9</Text>
      </Page>

      {/* === PAGE 9: PIÈCES JUSTIFICATIVES === */}
      <Page size="A4" style={styles.justificatifsPage}>
        {agentLogo && (
          <View style={styles.pageLogoContainer}>
            <Image style={styles.pageLogoImage} src={agentLogo} />
          </View>
        )}

        <Text style={styles.pageTitle}>Pièces justificatives</Text>
        <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 25, marginTop: -10 }}>Pour la rédaction du mandat</Text>

        {/* Section 1: Pour le contact */}
        <View style={styles.justificatifsSection}>
          <Text style={styles.justificatifsSectionTitle}>1. POUR LE CONTACT</Text>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}>Une pièce justificative d'identité telle que la carte d'identité ou passeport.</Text>
          </View>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}>Une copie du livret de famille.</Text>
          </View>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}><Text style={styles.textBold}>Si pacsé</Text> : certificat de PACS.</Text>
          </View>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}><Text style={styles.textBold}>Si divorcé</Text> : le jugement de divorce.</Text>
          </View>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}><Text style={styles.textBold}>Si marié</Text> : la copie du contrat de mariage afin de savoir le régime choisi et donc l'impact que la vente va avoir sur son patrimoine.</Text>
          </View>
        </View>

        {/* Section 2: Pour le bien */}
        <View style={styles.justificatifsSection}>
          <Text style={styles.justificatifsSectionTitle}>2. POUR LE BIEN</Text>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}>L'acte de propriété.</Text>
          </View>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}>La Taxe Foncière.</Text>
          </View>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}>Les documents relatifs aux divers travaux effectués.</Text>
          </View>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}>Les plans du logement.</Text>
          </View>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}>Les documents relatifs à son prêt immobilier (il doit en outre préciser si celui-ci est hypothécaire).</Text>
          </View>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}><Text style={styles.textBold}>Dossier de Diagnostic Technique</Text> : diagnostic amiante / diagnostic électricité / diagnostic ERP / diagnostic État des nuisances sonores aériennes / diagnostic gaz / diagnostic mérule / diagnostic DPE / diagnostic plomb / diagnostic termites / diagnostic technique de l'immeuble en copropriété / le diagnostic métrage loi Carrez.</Text>
          </View>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}><Text style={styles.textBold}>Si le bien est vendu loué</Text> : le propriétaire bailleur doit fournir le bail, les trois dernières quittances de loyer et l'état des lieux d'entrée du locataire, Assurance.</Text>
          </View>

          <View style={styles.justificatifsItem}>
            <View style={styles.checkbox} />
            <Text style={styles.justificatifsText}><Text style={styles.textBold}>Si le bien est vendu vide mais était loué dernièrement</Text> : Préavis du locataire / Lettre du congé pour vente avec refus du locataire.</Text>
          </View>
        </View>

        <Text style={styles.pageNumber}>9 / 9</Text>
      </Page>
    </Document>
  );
}
