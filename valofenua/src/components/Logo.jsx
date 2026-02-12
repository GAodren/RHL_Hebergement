export default function Logo({ className = "h-12", showText = true, textClassName = "", compact = false }) {
  return (
    <div className="flex items-center gap-3">
      {/* Logo SVG - Design géométrique maison avec vagues */}
      <svg
        className={className}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blueGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0077B6" />
            <stop offset="100%" stopColor="#00A8E8" />
          </linearGradient>
          <linearGradient id="blueGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#48CAE4" />
            <stop offset="100%" stopColor="#90E0EF" />
          </linearGradient>
          <linearGradient id="darkBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#023E8A" />
            <stop offset="100%" stopColor="#0077B6" />
          </linearGradient>
        </defs>

        {/* Toit en losange - partie supérieure */}
        <path
          d="M30 2L50 22L30 42L10 22L30 2Z"
          fill="url(#darkBlue)"
        />

        {/* Petite maison au centre du toit */}
        <path
          d="M30 10L38 18V28H22V18L30 10Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M20 19L30 9L40 19"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Vagues géométriques en bas */}
        <path
          d="M5 35L20 50H40L55 35L40 35L30 45L20 35H5Z"
          fill="url(#blueGradient1)"
        />
        <path
          d="M10 40L22 52H38L50 40L38 40L30 48L22 40H10Z"
          fill="url(#blueGradient2)"
          opacity="0.8"
        />

        {/* Accent de vague */}
        <path
          d="M15 45L25 55H35L45 45"
          stroke="#CAF0F8"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {showText && !compact && (
        <div className="flex flex-col">
          <span className={`font-bold text-xl tracking-wide ${textClassName || 'text-[#023E8A]'}`}>
            VALOFENUA
          </span>
          <span className="text-xs text-[#0077B6] tracking-wider -mt-0.5">
            Estimation Immobilière
          </span>
        </div>
      )}

      {showText && compact && (
        <span className={`font-bold text-xl tracking-wide ${textClassName || 'text-[#023E8A]'}`}>
          VALOFENUA
        </span>
      )}
    </div>
  );
}
