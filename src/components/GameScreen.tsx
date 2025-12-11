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
  lane: number;
}

const LANES = 3; // 3 colonnes max

export function GameScreen({
  objective,
  timeLeft,
  score,
  onScoreChange,
  onTimeEnd
}: GameScreenProps) {
  const [bubbles, setBubbles] = useState<BubbleState[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; type: 'good' | 'bad' | '' }>({
    message: '',
    type: ''
  });
  const bubbleIdRef = useRef(0);
  const playAreaRef = useRef<HTMLDivElement>(null);

  const spawnBubble = useCallback(() => {
    setBubbles(prev => {
      const current = prev ?? [];

      // lanes occupées
      const occupiedLanes = new Set(current.map(b => b.lane));

      // lane libre
      let freeLane: number | null = null;
      for (let i = 0; i < LANES; i++) {
        if (!occupiedLanes.has(i)) {
          freeLane = i;
          break;
        }
      }

      // pas de lane dispo → on attend le prochain tick
      if (freeLane === null) {
        return current;
      }

      const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      const isGood = item.tags.some(tag => objective.tags.includes(tag));

      const areaWidth = playAreaRef.current?.clientWidth || 480;
      const bubbleWidth = 140;

      const laneWidth = LANES > 1 ? (areaWidth - bubbleWidth) / (LANES - 1) : 0;
      const left = 10 + freeLane * laneWidth;

      const newBubble: BubbleState = {
        id: bubbleIdRef.current++,
        item,
        isGood,
        left,
        lane: freeLane
      };

      return [...current, newBubble];
    });
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

  const handleBubbleClick = useCallback(
    (isGood: boolean) => {
      if (isGood) {
        onScoreChange(score + 1);
        setFeedback({
          message: '✅ Bien joué ! Micronutriment adapté à l’objectif.',
          type: 'good'
        });
      } else {
        onScoreChange(Math.max(0, score - 1));
        setFeedback({
          message: '❌ Oups, celui-ci ne cible pas vraiment cet objectif.',
          type: 'bad'
        });
      }
    },
    [score, onScoreChange]
  );

  const handleBubbleAnimationEnd = useCallback((id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
  }, []);

  return (
    <div>
      {/* Header : logo + temps */}
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
            <img src={nutriomeLogo} alt="Nutriome" className="h-6 w-6 object-contain" />
          </div>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-[#10343a]">
            🎮 Nutri-Run
          </span>
        </div>

        <div className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#e6f6f0] px-2.5 py-1 text-[11px] font-semibold text-[#10343a]">
          ⏱ Temps : {timeLeft}s
        </div>
      </div>

      {/* Carte objectif + zone de jeu */}
      <div className="mb-4 rounded-[14px] border border-gray-200 bg-gray-50 p-3.5">
        <div className="mb-1 text-sm font-semibold text-[#10343a]">{objective.title}</div>
        <div className="mb-2.5 text-xs text-gray-500">{objective.description}</div>

        <div className="mb-2 flex flex-wrap gap-1.5">
          {objective.targets.map(target => (
            <span
              key={target}
              className="rounded-full border border-[rgba(28,156,108,0.25)] bg-[#e5f6ef] px-2.5 py-1 text-[11px] text-[#10343a]"
            >
              {target}
            </span>
          ))}
        </div>

        <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
          <span>Score :</span>
          <span className="font-bold text-[#10343a]">{score}</span>
        </div>

        <div
          ref={playAreaRef}
          className="relative h-[260px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-[#eef3f6]"
        >
          {bubbles.map(bubble => (
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
          className={`mt-2 min-h-4 text-xs ${
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
