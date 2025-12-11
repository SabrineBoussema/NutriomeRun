import { Logo } from './Logo';
import { useEffect } from 'react';
import confetti from "canvas-confetti";

interface ResultScreenProps {
  score: number;
  onPlayAgain: () => void;
}

export function ResultScreen({ score, onPlayAgain }: ResultScreenProps) {
  let tag: string;
  let text: string;

  if (score >= 18) {
    tag = "Réflexes micronutrition au top 🔥";
    text = "Score Gold ! Excellent sens clinique et très bonne réactivité.";
  } else if (score >= 10) {
    tag = "Très bon score 👏";
    text = "Beaux réflexes micronutritionnels, merci pour votre participation !";
  } else {
    tag = "Merci d'avoir joué 🙌";
    text = "Un petit rappel micronutrition ne fait jamais de mal. Retrouvez l'équipe Nutriome pour en discuter.";
  }

  // 🎉 Animation de succès uniquement si score ≥ 5
  useEffect(() => {
    if (score >= 5) {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.4 }
      });
    }
  }, [score]);

  return (
    <div>
      <div className="mb-1">
        <Logo subtitle="Nutri-Run terminé" />
      </div>

      <h1 className="mt-2.5 mb-1.5 text-[22px] text-[#10343a] tracking-tight">
        Votre score
      </h1>

      <div className="bg-gray-50 rounded-[14px] p-3.5 border border-gray-200">
        <div className="text-2xl font-bold text-[#10343a] mb-1">
          {score} points
        </div>

        <div className="text-xs font-semibold mb-2.5">
          {tag}
        </div>

        <div className="text-[13px] text-gray-600 mb-2.5">
          {text}
        </div>

        {/* 🎁 Cadeau si score ≥ 5 */}
        {score >= 5 && (
          <div className="text-[11px] text-gray-500 bg-gray-50 rounded-[10px] px-2.5 py-2 border border-dashed border-gray-300 mb-2.5">
            🎁 <strong>Montrez cet écran à l'équipe Nutriome</strong> pour récupérer votre cadeau du stand.
          </div>
        )}

        <button
          className="w-full bg-[#1c9c6c] text-white rounded-full px-4 py-2.5 text-sm cursor-pointer inline-flex items-center justify-center gap-1.5 font-semibold shadow-[0_10px_18px_rgba(28,156,108,0.35)] transition-all hover:bg-[#17845a] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-[#1c9c6c] focus-visible:outline-offset-2"
          onClick={onPlayAgain}
        >
          Rejouer
        </button>
      </div>
    </div>
  );
}
