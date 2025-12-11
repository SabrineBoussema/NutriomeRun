interface LogoProps {
  subtitle?: string;
}
import nutriomeLogo from '/nutriome-logo.png'; 
export function Logo({ subtitle = "Science & Nutrition" }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5 mb-2">
      <div className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center">
            <img
              src={nutriomeLogo}
              alt="Nutriome"
              className="w-8 h-8 object-contain"
            />
          </div>
      <div>
        <div className="font-bold tracking-wider uppercase text-sm text-[#10343a]">
          Nutriome
        </div>
        <div className="text-[11px] text-gray-500 uppercase tracking-widest">
          {subtitle}
        </div>
      </div>
    </div>
  );
}
