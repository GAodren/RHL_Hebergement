export default function Logo({ className = "w-10 h-10", showText = true, textClassName = "" }) {
  return (
    <div className="flex items-center gap-2">
      {/* Logo SVG - Maison stylisée avec vague polynésienne */}
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fond avec dégradé océan */}
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0077B6" />
            <stop offset="100%" stopColor="#00A8E8" />
          </linearGradient>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E0F4FF" />
            <stop offset="100%" stopColor="#90E0EF" />
          </linearGradient>
        </defs>

        {/* Cercle de fond */}
        <circle cx="24" cy="24" r="22" fill="url(#oceanGradient)" />

        {/* Maison stylisée */}
        <path
          d="M24 10L12 20V36H20V28H28V36H36V20L24 10Z"
          fill="white"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Toit avec accent */}
        <path
          d="M10 21L24 9L38 21"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Vague polynésienne en bas */}
        <path
          d="M8 38C12 35 16 38 20 35C24 32 28 35 32 32C36 29 40 32 42 30"
          stroke="url(#waveGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
      </svg>

      {showText && (
        <span className={`font-bold text-xl ${textClassName || 'text-[#0077B6]'}`}>
          Valo<span className="text-[#00A8E8]">Fenua</span>
        </span>
      )}
    </div>
  );
}
