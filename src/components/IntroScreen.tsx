import { Logo } from './Logo';

interface IntroScreenProps {
  onStart: () => void;
  onSeeRewards: () => void;
}

export function IntroScreen({ onStart, onSeeRewards }: IntroScreenProps) {
  return (
    <div>
      <Logo />

      <span className="bg-[#e6f6f0] text-[#10343a] rounded-full px-3 py-1.5 text-[11px] inline-flex items-center gap-1.5 mb-3 border border-[rgba(16,52,58,0.08)] backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#f7b733]"></span>
        Mini-jeu exclusif – Congrès ATSM
      </span>

      <h1 className="mt-2.5 mb-1.5 text-[22px] text-[#10343a] tracking-tight">
        Nutri-Run
      </h1>
      <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">
        Cliquez le plus vite possible sur les bons micronutriments<br />
        en fonction de l'objectif affiché. 30 secondes, réflexes ON !
      </p>

      <div className="bg-gray-50 rounded-[14px] p-3.5 mb-4 border border-gray-200">
        <strong className="text-[13px] text-[#10343a]">
          Comment jouer ?
        </strong>
        <ul className="text-xs text-gray-600 pl-4.5 mt-2 space-y-1 list-disc">
          <li>Un objectif apparaît (ex. <em>"Soutenir l'immunité"</em>).</li>
          <li>Des bulles tombent (Vitamine C, Magnésium, Probiotiques, Fast-food…).</li>
          <li>Cliquez uniquement les bulles utiles pour l'objectif.</li>
          <li>Chaque bonne bulle = +1 point, chaque erreur fait perdre un peu de score.</li>
          <li>À la fin, montrez votre score à l'équipe Nutriome pour récupérer votre cadeau.</li>
        </ul>
        <button
          className="mt-3 bg-white text-[#10343a] border border-gray-300 rounded-full px-2.5 py-1.5 text-xs cursor-pointer inline-flex items-center justify-center gap-1.5 font-semibold transition-all hover:border-[#1c9c6c] hover:bg-blue-50 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-[#1c9c6c] focus-visible:outline-offset-2"
          onClick={onSeeRewards}
        >
          🎁 Barème des cadeaux
        </button>
      </div>

      <button
        className="w-full bg-[#1c9c6c] text-white rounded-full px-4 py-2.5 text-sm cursor-pointer inline-flex items-center justify-center gap-1.5 font-semibold shadow-[0_10px_18px_rgba(28,156,108,0.35)] transition-all hover:bg-[#17845a] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-[#1c9c6c] focus-visible:outline-offset-2"
        onClick={onStart}
      >
        🚀 Lancer Nutri-Run
      </button>
    </div>
  );
}
