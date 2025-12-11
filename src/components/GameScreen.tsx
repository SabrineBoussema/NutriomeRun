import { useState, useEffect, useCallback, useRef } from 'react';
import { Bubble } from './Bubble';
import { Objective, Item } from '../types';
import { ITEMS, SPAWN_INTERVAL } from '../constants';
import nutriomeLogo from '/nutriome-logo.png';
interface GameScreenProps {
  objective: Objective;
  timeLeft: number;
  score: number;
  onScoreChange: (newScore: number) => void;
  onTimeEnd: () => void;
}

interface BubbleState {
  id: number;
  item: Item;
  isGood: boolean;
  left: number;
}

export function GameScreen({
  objective,
  timeLeft,
  score,
  onScoreChange,
  onTimeEnd
}: GameScreenProps) {
  const [bubbles, setBubbles] = useState<BubbleState[]>();
  const [feedback, setFeedback] = useState<{ message: string; type: 'good' | 'bad' | '' }>({
    message: '',
    type: ''
  });
  const bubbleIdRef = useRef(0);
  const playAreaRef = useRef<HTMLDivElement>(null);

  const spawnBubble = useCallback(() => {
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const isGood = item.tags.some(tag => objective.tags.includes(tag));

    const areaWidth = playAreaRef.current?.clientWidth || 480;
    const bubbleWidth = 120;
    const maxLeft = Math.max(areaWidth - bubbleWidth, 20);
    const left = 10 + Math.random() * maxLeft;

    const newBubble: BubbleState = {
      id: bubbleIdRef.current++,
      item,
      isGood,
      left
    };

    setBubbles(prev => [...(prev || []), newBubble]);
  }, [objective.tags]);

  useEffect(() => {
    const interval = setInterval(spawnBubble, SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [spawnBubble]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeEnd();
    }
  }, [timeLeft, onTimeEnd]);

  const handleBubbleClick = useCallback((isGood: boolean) => {
    if (isGood) {
      onScoreChange(score + 1);
      setFeedback({
        message: "✅ Bien joué ! Micronutriment adapté à l'objectif.",
        type: 'good'
      });
    } else {
      onScoreChange(Math.max(0, score - 1));
      setFeedback({
        message: "❌ Oups, celui-ci ne cible pas vraiment cet objectif.",
        type: 'bad'
      });
    }
  }, [score, onScoreChange]);

  const handleBubbleAnimationEnd = useCallback((id: number) => {
    setBubbles(prev => prev?.filter(b => b.id !== id) || []);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-2.5 text-xs text-gray-500 gap-2 flex-wrap">
      {/* 👇 Bloc logo + titre jeu */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center">
          <img
            src={nutriomeLogo}
            alt="Nutriome"
            className="w-6 h-6 object-contain"
          />
        </div>
        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[11px] font-semibold text-[#10343a]">
          🎮 Nutri-Run
        </span>
      </div>

      {/* ⏱ Temps */}
      <div className="px-2.5 py-1 rounded-full bg-[#e6f6f0] text-[#10343a] font-semibold text-[11px] inline-flex items-center gap-1 whitespace-nowrap">
        ⏱ Temps : {timeLeft}s
      </div>
    </div>

      <div className="bg-gray-50 rounded-[14px] p-3.5 mb-4 border border-gray-200">
        <div className="text-sm font-semibold text-[#10343a] mb-1">
          {objective.title}
        </div>
        <div className="text-xs text-gray-500 mb-2.5">
          {objective.description}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {objective.targets.map((target) => (
            <span
              key={target}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#e5f6ef] text-[#10343a] border border-[rgba(28,156,108,0.25)]"
            >
              {target}
            </span>
          ))}
        </div>

        <div className="text-xs text-gray-600 flex justify-between items-center mb-1">
          <span>Score :</span>
          <span className="font-bold text-[#10343a]">{score}</span>
        </div>

        <div
          ref={playAreaRef}
          className="relative w-full h-[260px] rounded-2xl bg-gradient-to-b from-white to-[#eef3f6] border border-gray-200 overflow-hidden"
        >
          {bubbles?.map((bubble) => (
            <Bubble
              key={bubble.id}
              item={bubble.item}
              isGood={bubble.isGood}
              left={bubble.left}
              onClick={handleBubbleClick}
              onAnimationEnd={() => handleBubbleAnimationEnd(bubble.id)}
            />
          ))}
        </div>

        <div
          className={`text-xs mt-2 min-h-4 ${
            feedback.type === 'good'
              ? 'text-[#15803d]'
              : feedback.type === 'bad'
              ? 'text-[#b91c1c]'
              : 'text-gray-500'
          }`}
        >
          {feedback.message}
        </div>
      </div>
    </div>
  );
}
