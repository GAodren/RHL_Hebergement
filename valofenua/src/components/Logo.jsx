import logoIcon from '/logo-icon.png';

export default function Logo({ className = "h-10" }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={logoIcon}
        alt="ValoFenua"
        className={className}
      />
      <span className="text-xl font-bold text-[#0077B6]">ValoFenua</span>
    </div>
  );
}
