import { useLocation } from 'react-router-dom';
import EstimationForm from '../components/EstimationForm';

export default function Estimation() {
  const location = useLocation();
  const initialState = location.state || null;

  return (
    <main className="flex-1 py-12 md:py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Estimez votre bien
          </h1>
          <p className="text-lg text-slate-600">
            Remplissez le formulaire ci-dessous pour obtenir une estimation précise
          </p>
        </div>
        <EstimationForm initialState={initialState} />
      </div>
    </main>
  );
}
