import { Home, Settings, TrendingUp } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      icon: Home,
      title: 'Decrivez votre bien',
      description: 'Renseignez la commune et la categorie de votre bien.',
    },
    {
      number: '2',
      icon: Settings,
      title: 'Precisez les criteres',
      description: 'Ajoutez le type de bien et la surface habitable.',
    },
    {
      number: '3',
      icon: TrendingUp,
      title: 'Obtenez votre estimation',
      description: 'Recevez une fourchette de prix basee sur le marche local.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">
          Comment ca marche ?
        </h2>
        <p className="text-slate-600 text-center max-w-2xl mx-auto mb-16">
          Obtenez une estimation fiable en trois etapes simples
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-[#0077B6]/20" />
              )}
              <div className="relative">
                <div className="w-20 h-20 bg-[#0077B6] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg">
                  {step.number}
                </div>
              </div>
              <div className="w-12 h-12 bg-[#E0F4FF] rounded-xl flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-[#0077B6]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
