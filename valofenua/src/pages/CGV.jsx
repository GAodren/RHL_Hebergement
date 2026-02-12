import { ScrollText } from 'lucide-react';
import Logo from '../components/Logo';

export default function CGV() {
  return (
    <main className="flex-grow">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-[#E0F4FF] to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo className="h-16" showText={false} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Conditions régissant l'utilisation du service ValoFenua
          </p>
        </div>
      </section>

      {/* Content section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            {/* Préambule */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Article 1 - Préambule</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'utilisation du site internet ValoFenua accessible à l'adresse valofenua.com (ci-après le "Site").
                </p>
                <p className="text-slate-600 mb-4">
                  ValoFenua est un service professionnel d'estimation immobilière en ligne destiné aux agences et agents immobiliers souhaitant obtenir une estimation indicative de la valeur d'un bien immobilier situé en Polynésie française.
                </p>
                <p className="text-slate-600 mb-0">
                  L'utilisation du Site implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Site.
                </p>
              </div>
            </div>

            {/* Objet du service */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Article 2 - Objet du service</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  ValoFenua propose un service d'estimation immobilière professionnel permettant aux utilisateurs autorisés d'obtenir une fourchette de prix indicative pour un bien immobilier basée sur :
                </p>
                <ul className="text-slate-600 mb-4 list-disc list-inside space-y-2">
                  <li>La commune où se situe le bien</li>
                  <li>La catégorie du bien (maison, appartement, terrain)</li>
                  <li>Le type de bien (Studio, F1, F2, F3, F4, F5, etc.)</li>
                  <li>La surface habitable en mètres carrés</li>
                </ul>
                <p className="text-slate-600 mb-0">
                  Ce service est fourni à titre purement informatif et ne constitue en aucun cas une expertise immobilière, une évaluation officielle ou un engagement de la part de ValoFenua.
                </p>
              </div>
            </div>

            {/* Accès au service */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Article 3 - Accès au service</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  Le service ValoFenua est réservé aux professionnels de l'immobilier disposant d'un compte utilisateur. L'accès est soumis à un abonnement et les comptes sont créés par l'administrateur du service.
                </p>
                <p className="text-slate-600 mb-4">
                  ValoFenua se réserve le droit de modifier, suspendre ou interrompre tout ou partie du service à tout moment, sans préavis ni indemnité.
                </p>
                <p className="text-slate-600 mb-0">
                  ValoFenua ne saurait être tenu responsable des interruptions de service liées à des problèmes techniques, des opérations de maintenance ou des causes extérieures.
                </p>
              </div>
            </div>

            {/* Utilisation du service */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Article 4 - Utilisation du service</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  L'utilisateur s'engage à utiliser le service de manière conforme à sa destination et aux présentes CGU. Il s'interdit notamment :
                </p>
                <ul className="text-slate-600 mb-4 list-disc list-inside space-y-2">
                  <li>D'utiliser le service à des fins illicites ou contraires à l'ordre public</li>
                  <li>De tenter de porter atteinte au bon fonctionnement du Site</li>
                  <li>D'extraire, collecter ou exploiter de manière automatisée les données du Site</li>
                  <li>De reproduire ou exploiter le service à des fins commerciales sans autorisation</li>
                </ul>
                <p className="text-slate-600 mb-0">
                  ValoFenua se réserve le droit de bloquer l'accès au service en cas d'utilisation abusive ou non conforme aux présentes CGU.
                </p>
              </div>
            </div>

            {/* Limitation de responsabilité */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Article 5 - Limitation de responsabilité</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  Les estimations fournies par ValoFenua sont basées sur les données du marché immobilier local disponibles et sont données à titre purement indicatif.
                </p>
                <p className="text-slate-600 mb-4">
                  Ces estimations ne prennent pas en compte tous les facteurs pouvant influencer la valeur d'un bien (état général, travaux récents, vue, exposition, étage, parking, etc.).
                </p>
                <p className="text-slate-600 mb-4">
                  ValoFenua ne garantit pas l'exactitude, l'exhaustivité ou l'actualité des estimations fournies et décline toute responsabilité en cas de :
                </p>
                <ul className="text-slate-600 mb-4 list-disc list-inside space-y-2">
                  <li>Décisions prises sur la base des estimations fournies</li>
                  <li>Différence entre l'estimation et le prix réel de vente ou d'achat</li>
                  <li>Préjudice direct ou indirect résultant de l'utilisation du service</li>
                </ul>
                <p className="text-slate-600 mb-0">
                  Pour une évaluation précise de votre bien, nous vous recommandons de consulter un professionnel de l'immobilier ou un expert agréé.
                </p>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Article 6 - Propriété intellectuelle</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  L'ensemble des éléments du Site (textes, images, logos, graphismes, base de données, logiciels, etc.) est protégé par les droits de propriété intellectuelle et appartient à ValoFenua ou à ses partenaires.
                </p>
                <p className="text-slate-600 mb-0">
                  Toute reproduction, représentation, modification ou exploitation non autorisée de ces éléments est strictement interdite et constitue une contrefaçon sanctionnée par la loi.
                </p>
              </div>
            </div>

            {/* Protection des données */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Article 7 - Protection des données</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  ValoFenua s'engage à respecter la confidentialité des données des utilisateurs. Les informations saisies dans le formulaire d'estimation ne sont pas stockées et sont uniquement utilisées pour générer une estimation en temps réel.
                </p>
                <p className="text-slate-600 mb-0">
                  Pour plus d'informations sur notre politique de protection des données, veuillez consulter nos Mentions Légales.
                </p>
              </div>
            </div>

            {/* Modification des CGU */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Article 8 - Modification des CGU</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  ValoFenua se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le Site.
                </p>
                <p className="text-slate-600 mb-0">
                  L'utilisation du service après la publication des modifications vaut acceptation des nouvelles CGU.
                </p>
              </div>
            </div>

            {/* Droit applicable */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Article 9 - Droit applicable</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  Les présentes CGU sont régies par le droit français applicable en Polynésie française.
                </p>
                <p className="text-slate-600 mb-0">
                  En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGU, les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera soumis aux tribunaux compétents de Papeete.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Article 10 - Contact</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-0">
                  Pour toute question relative aux présentes CGU, vous pouvez nous contacter à l'adresse : <a href="mailto:contact@valofenua.com" className="text-[#0077B6] hover:underline">contact@valofenua.com</a>
                </p>
              </div>
            </div>

            {/* Date de mise à jour */}
            <div className="mt-10 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500 text-center">
                Dernière mise à jour : Janvier 2025
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
