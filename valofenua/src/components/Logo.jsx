import logoIcon from '/logo-icon.png';

export default function Logo({ className = "h-10", showText = true }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={logoIcon}
        alt="ValoFenua"
        className={className}
      />
      {showText && <span className="text-xl font-bold text-[#0077B6]">ValoFenua</span>}
    </div>
  );
}
