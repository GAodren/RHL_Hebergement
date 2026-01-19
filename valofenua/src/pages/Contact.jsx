import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, MessageSquare, Users } from 'lucide-react';
import Logo from '../components/Logo';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setErrorMessage('Veuillez entrer une adresse email valide.');
      return;
    }

    try {
      // Créer le lien mailto
      const subject = encodeURIComponent(formData.subject || 'Contact depuis ValoFenua');
      const body = encodeURIComponent(
        `Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );

      // Ouvrir le client mail
      window.location.href = `mailto:aodren.gloux@gmail.com?subject=${subject}&body=${body}`;

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <main className="flex-grow">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-[#E0F4FF] to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo className="w-16 h-16" showText={false} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Une question, une suggestion ou une proposition de collaboration ? N'hésitez pas à nous écrire.
          </p>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Informations */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Pourquoi nous contacter ?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E0F4FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-[#0077B6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Questions et suggestions</h3>
                    <p className="text-slate-600 text-sm">
                      Vous avez une question sur notre outil ou une idée d'amélioration ? Nous sommes à l'écoute.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E0F4FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[#0077B6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Collaboration</h3>
                    <p className="text-slate-600 text-sm">
                      Vous êtes professionnel de l'immobilier et souhaitez collaborer avec nous ? Contactez-nous pour en discuter.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E0F4FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#0077B6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Contact direct</h3>
                    <p className="text-slate-600 text-sm">
                      Vous pouvez également nous écrire directement à{' '}
                      <a
                        href="mailto:aodren.gloux@gmail.com"
                        className="text-[#0077B6] hover:underline"
                      >
                        aodren.gloux@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div>
              <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl p-6 md:p-8">
                <div className="space-y-5">
                  {/* Nom */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Sujet */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                      Sujet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Objet de votre message"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Votre message..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Message de succès */}
                  {status === 'success' && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-xl">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <p>Votre client mail s'est ouvert avec le message pré-rempli. Envoyez-le pour nous contacter !</p>
                    </div>
                  )}

                  {/* Message d'erreur */}
                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  {/* Bouton */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 bg-[#0077B6] text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-[#005f8a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
