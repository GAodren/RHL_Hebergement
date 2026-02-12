// Import des logos
import logoFull from '/logo-full.png';
import logoIcon from '/logo-icon.png';

export default function Logo({ className = "h-12", showText = true }) {
  // Si showText est true, on affiche le logo complet avec texte
  // Sinon, on affiche seulement l'icône
  const logoSrc = showText ? logoFull : logoIcon;
  const altText = showText ? "ValoFenua - Estimation Immobilière" : "ValoFenua";

  return (
    <img
      src={logoSrc}
      alt={altText}
      className={className}
    />
  );
}
