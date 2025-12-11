interface RewardsScreenProps {
  onBack: () => void;
}

export function RewardsScreen({ onBack }: RewardsScreenProps) {
  return (
    <div>
      <div className="bg-gray-50 rounded-[14px] p-3.5 mb-4 border border-gray-200">
        <strong className="text-[13px] text-[#10343a]">
          Barème cadeaux Nutriome
        </strong>
        <ul className="text-xs text-gray-600 pl-4.5 mt-2 space-y-1 list-disc">
          <li><strong>≥ 18 points</strong> → Cadeau Gold (mug, tote bag, coffret…)</li>
          <li><strong>10 – 17 points</strong> → Cadeau Silver (stylos, bloc-notes, échantillons…)</li>
          <li><strong>0 – 9 points</strong> → Merci d'avoir joué ! (stylo + flyer)</li>
        </ul>
        <button
          className="mt-3 bg-white text-[#10343a] border border-gray-300 rounded-full px-2.5 py-1.5 text-xs cursor-pointer inline-flex items-center justify-center gap-1.5 font-semibold transition-all hover:border-[#1c9c6c] hover:bg-blue-50 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-[#1c9c6c] focus-visible:outline-offset-2"
          onClick={onBack}
        >
          ⬅ Retour
        </button>
      </div>
    </div>
  );
}
