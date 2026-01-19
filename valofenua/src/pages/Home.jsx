import Hero from '../components/Hero';
import Stats from '../components/Stats';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <CTA />
    </main>
  );
}
