import { Link } from 'react-router-dom';
import {
  Target,
  Database,
  Shield,
  Users,
  TrendingUp,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import Logo from '../components/Logo';

export default function About() {
  return (
    <main className="flex-grow">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-[#E0F4FF] to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo className="w-16 h-16" showText={false} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
            À propos de ValoFenua
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            L'outil d'estimation immobilière dédié au marché polynésien. Gratuit, rapide et transparent.
          </p>
        </div>
      </section>

      {/* Notre mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#E0F4FF] rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-[#0077B6]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              Notre mission
            </h2>
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              ValoFenua est né d'un constat simple : le marché immobilier polynésien manque d'outils accessibles pour les particuliers et les professionnels souhaitant estimer rapidement la valeur d'un bien.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mt-4">
              Notre objectif est de <strong className="text-slate-800">démocratiser l'accès à l'information immobilière</strong> en Polynésie française. Que vous soyez propriétaire souhaitant vendre, acheteur potentiel ou agent immobilier, ValoFenua vous offre une estimation claire et rapide basée sur les données réelles du marché local.
            </p>
          </div>
        </div>
      </section>

      {/* D'où viennent nos données */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#E0F4FF] rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-[#0077B6]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              D'où viennent nos données ?
            </h2>
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Nos estimations sont basées sur l'analyse de <strong className="text-slate-800">plus de 1 300 annonces immobilières</strong> actives et passées sur le marché polynésien.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <MapPin className="w-5 h-5 text-[#0077B6] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800">12 communes couvertes</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    De Papeete à Taiarapu, nous couvrons les principales communes de Tahiti et ses environs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-[#0077B6] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800">Données actualisées</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Notre base de données est régulièrement mise à jour pour refléter l'évolution du marché.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre méthodologie */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#E0F4FF] rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#0077B6]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              Notre méthodologie
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100">
              <div className="w-8 h-8 bg-[#0077B6] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Collecte des annonces</h4>
                <p className="text-slate-600 mt-1">
                  Nous analysons les annonces de vente sur les principales plateformes immobilières polynésiennes.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100">
              <div className="w-8 h-8 bg-[#0077B6] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Segmentation par critères</h4>
                <p className="text-slate-600 mt-1">
                  Les biens sont classés par commune, catégorie (maison, appartement, terrain), type et surface.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100">
              <div className="w-8 h-8 bg-[#0077B6] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Calcul de la fourchette</h4>
                <p className="text-slate-600 mt-1">
                  Nous calculons une fourchette de prix (bas, moyen, haut) basée sur les biens similaires vendus ou en vente dans le même secteur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos engagements */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#E0F4FF] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#0077B6]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              Nos engagements
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h4 className="font-semibold text-lg text-slate-800 mb-3">100% gratuit</h4>
              <p className="text-slate-600">
                ValoFenua est et restera entièrement gratuit. Pas de frais cachés, pas d'abonnement, pas de surprise.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h4 className="font-semibold text-lg text-slate-800 mb-3">Sans inscription</h4>
              <p className="text-slate-600">
                Obtenez votre estimation immédiatement, sans créer de compte ni fournir vos informations personnelles.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h4 className="font-semibold text-lg text-slate-800 mb-3">Données confidentielles</h4>
              <p className="text-slate-600">
                Nous ne collectons ni ne stockons aucune donnée personnelle. Votre recherche reste privée.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h4 className="font-semibold text-lg text-slate-800 mb-3">Transparence</h4>
              <p className="text-slate-600">
                Nos sources de données sont clairement identifiées et notre méthodologie est expliquée en détail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Avertissement */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Avertissement important</h4>
                <p className="text-amber-700 text-sm leading-relaxed">
                  ValoFenua fournit une <strong>estimation indicative</strong> basée sur les prix du marché. Cette estimation ne constitue en aucun cas une évaluation officielle, une expertise immobilière certifiée ou un avis de valeur engagé. Pour une évaluation précise de votre bien, nous vous recommandons de faire appel à un professionnel de l'immobilier ou à un expert agréé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pour qui ? */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#E0F4FF] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-[#0077B6]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              ValoFenua, pour qui ?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🏠</div>
              <h4 className="font-semibold text-lg text-slate-800 mb-2">Propriétaires</h4>
              <p className="text-slate-600 text-sm">
                Vous souhaitez vendre ? Obtenez une première idée du prix de votre bien avant de contacter un agent.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔍</div>
              <h4 className="font-semibold text-lg text-slate-800 mb-2">Acheteurs</h4>
              <p className="text-slate-600 text-sm">
                Vérifiez si le prix demandé pour un bien correspond au marché local avant de faire une offre.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💼</div>
              <h4 className="font-semibold text-lg text-slate-800 mb-2">Professionnels</h4>
              <p className="text-slate-600 text-sm">
                Agents immobiliers, utilisez ValoFenua comme outil complémentaire pour vos estimations rapides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0077B6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Prêt à estimer votre bien ?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Obtenez une estimation gratuite en moins de 2 minutes, basée sur les données du marché polynésien.
          </p>
          <Link
            to="/estimation"
            className="inline-flex items-center gap-2 bg-white text-[#0077B6] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-colors shadow-lg"
          >
            Estimer maintenant
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
