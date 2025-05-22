interface BrilliantLogoProps {
  className?: string;
}

export function BrilliantLogo({ className }: BrilliantLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-['Railway'] text-lg leading-none text-[#F5F2E7]">Brilliant</span>
      <span className="font-['Railway'] text-lg leading-none text-[#F4C6D7]">*</span>
    </div>
  );
}