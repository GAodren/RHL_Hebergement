import { FileText, MapPin, Clock } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      icon: FileText,
      value: '1300+',
      label: 'annonces analysees',
    },
    {
      icon: MapPin,
      value: '12',
      label: 'communes couvertes',
    },
    {
      icon: Clock,
      value: '2 min',
      label: 'temps moyen',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-[#E0F4FF] rounded-xl flex items-center justify-center mb-4">
                <stat.icon className="w-7 h-7 text-[#0077B6]" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-[#0077B6] mb-2">
                {stat.value}
              </div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
