import { FileText } from 'lucide-react';
import Logo from '../components/Logo';

export default function MentionsLegales() {
  return (
    <main className="flex-grow">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-[#E0F4FF] to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo className="h-16" showText={false} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
            Mentions Légales
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Informations légales concernant le site ValoFenua
          </p>
        </div>
      </section>

      {/* Content section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            {/* Éditeur du site */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Éditeur du site</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-2">
                  <strong>Raison sociale :</strong> ValoFenua
                </p>
                <p className="text-slate-600 mb-2">
                  <strong>Forme juridique :</strong> Entreprise individuelle
                </p>
                <p className="text-slate-600 mb-2">
                  <strong>Siège social :</strong> Papeete, Polynésie française
                </p>
                <p className="text-slate-600 mb-2">
                  <strong>Email :</strong> contact@valofenua.com
                </p>
                <p className="text-slate-600 mb-0">
                  <strong>Directeur de la publication :</strong> ValoFenua
                </p>
              </div>
            </div>

            {/* Hébergement */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Hébergement</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-2">
                  <strong>Hébergeur :</strong> Vercel Inc.
                </p>
                <p className="text-slate-600 mb-2">
                  <strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, USA
                </p>
                <p className="text-slate-600 mb-0">
                  <strong>Site web :</strong> https://vercel.com
                </p>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Propriété intellectuelle</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  L'ensemble du contenu du site ValoFenua (textes, images, logos, graphismes, icônes, etc.) est la propriété exclusive de ValoFenua ou de ses partenaires.
                </p>
                <p className="text-slate-600 mb-4">
                  Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable de ValoFenua.
                </p>
                <p className="text-slate-600 mb-0">
                  Toute exploitation non autorisée du site ou de son contenu sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions légales en vigueur.
                </p>
              </div>
            </div>

            {/* Données personnelles */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Protection des données personnelles</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  ValoFenua s'engage à protéger la vie privée des utilisateurs de son site. Aucune donnée personnelle n'est collectée lors de l'utilisation de notre outil d'estimation.
                </p>
                <p className="text-slate-600 mb-4">
                  Les informations saisies dans le formulaire d'estimation (commune, type de bien, surface) ne sont pas stockées et sont uniquement utilisées pour générer une estimation en temps réel.
                </p>
                <p className="text-slate-600 mb-0">
                  En cas de contact via le formulaire de contact, les données transmises (nom, email, message) sont uniquement utilisées pour répondre à votre demande et ne sont pas conservées au-delà du traitement de celle-ci.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Cookies</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  Le site ValoFenua peut utiliser des cookies techniques strictement nécessaires au bon fonctionnement du site.
                </p>
                <p className="text-slate-600 mb-0">
                  Ces cookies ne collectent aucune donnée personnelle et sont utilisés uniquement pour améliorer votre expérience de navigation.
                </p>
              </div>
            </div>

            {/* Limitation de responsabilité */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Limitation de responsabilité</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-4">
                  Les estimations fournies par ValoFenua sont données à titre indicatif et ne constituent en aucun cas une évaluation officielle ou une expertise immobilière.
                </p>
                <p className="text-slate-600 mb-4">
                  Ces estimations sont basées sur les données du marché immobilier local et peuvent varier en fonction de nombreux facteurs non pris en compte par notre outil (état du bien, vue, étage, etc.).
                </p>
                <p className="text-slate-600 mb-0">
                  ValoFenua décline toute responsabilité quant à l'utilisation qui pourrait être faite de ces estimations.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E0F4FF] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0077B6]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 m-0">Contact</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-600 mb-0">
                  Pour toute question concernant ces mentions légales, vous pouvez nous contacter à l'adresse : <a href="mailto:contact@valofenua.com" className="text-[#0077B6] hover:underline">contact@valofenua.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
