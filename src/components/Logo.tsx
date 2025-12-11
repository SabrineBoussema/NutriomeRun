interface LogoProps {
  subtitle?: string;
}

export function Logo({ subtitle = "Science & Nutrition" }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5 mb-2">
      <div className="w-10 h-10 rounded-full bg-[#1c9c6c] flex items-center justify-center text-white font-bold text-[19px] shadow-[0_6px_14px_rgba(28,156,108,0.35)]">
        N
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
