import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

const LANES = 3;
const BUBBLE_WIDTH = 140;

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export function GameScreen({ objective, timeLeft, score, onScoreChange, onTimeEnd }: GameScreenProps) {
  const [bubbles, setBubbles] = useState<BubbleState[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; type: 'good' | 'bad' | '' }>({
    message: '',
    type: ''
  });

  const bubbleIdRef = useRef(0);
  const playAreaRef = useRef<HTMLDivElement>(null);
  const spawnRef = useRef<number | null>(null);
  const endedRef = useRef(false);
  const feedbackTimeoutRef = useRef<number | null>(null);

  // ✅ Set des bonnes réponses (robuste)
  const goodSet = useMemo(() => {
    return new Set((objective.targets ?? []).map(norm));
  }, [objective.id, objective.targets]);

  const clearSpawn = useCallback(() => {
    if (spawnRef.current !== null) {
      window.clearInterval(spawnRef.current);
      spawnRef.current = null;
    }
  }, []);

  const clearFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, []);

  const showFeedback = useCallback((message: string, type: 'good' | 'bad') => {
    setFeedback({ message, type });
    clearFeedbackTimeout();
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedback({ message: '', type: '' });
    }, 900);
  }, [clearFeedbackTimeout]);

  const computeLeftForLane = useCallback((lane: number) => {
    const areaWidth = playAreaRef.current?.clientWidth || 480;
    if (LANES <= 1) return 10;

    const laneWidth = (areaWidth - BUBBLE_WIDTH) / (LANES - 1);
    return 10 + lane * laneWidth;
  }, []);

  // ✅ Spawn robuste : si toutes les lanes sont occupées, on remplace la plus ancienne lane
  const spawnBubble = useCallback(() => {
    if (endedRef.current) return;

    setBubbles((prev) => {
      const current = prev ?? [];

      // lanes occupées
      const occupiedLanes = new Set(current.map((b) => b.lane));

      // lane libre ?
      let laneToUse: number | null = null;
      for (let i = 0; i < LANES; i++) {
        if (!occupiedLanes.has(i)) {
          laneToUse = i;
          break;
        }
      }

      // si aucune libre : on recycle la lane de la plus ancienne bulle
      let next = current;
      if (laneToUse === null && current.length > 0) {
        const oldest = current[0];
        laneToUse = oldest.lane;
        next = current.slice(1); // retire la plus ancienne pour libérer la lane
      }

      // sécurité si vide total et aucune lane (cas extrême)
      if (laneToUse === null) laneToUse = 0;

      // Choix item : mix bon/mauvais pour éviter trop de "bons" ou trop de "mauvais"
      const goodItems = ITEMS.filter((it) => goodSet.has(norm(it.name)));
      const badItems = ITEMS.filter((it) => !goodSet.has(norm(it.name)));

      const takeGood = goodItems.length > 0 && Math.random() < 0.6;
      const pool = takeGood ? goodItems : badItems.length > 0 ? badItems : ITEMS;
      const item = pool[Math.floor(Math.random() * pool.length)];

      const isGood = goodSet.has(norm(item.name));

      const newBubble: BubbleState = {
        id: bubbleIdRef.current++,
        item,
        isGood,
        left: computeLeftForLane(laneToUse),
        lane: laneToUse
      };

      // max 10 bulles (propreté)
      return [...next, newBubble].slice(-10);
    });
  }, [goodSet, computeLeftForLane]);

  // ✅ reset quand objectif change : clear + spawn immédiat + interval stable
  useEffect(() => {
    endedRef.current = false;
    clearSpawn();
    clearFeedbackTimeout();
    setFeedback({ message: '', type: '' });
    setBubbles([]);

    // spawn direct pour éviter écran vide
    spawnBubble();
    window.setTimeout(() => spawnBubble(), 250);

    spawnRef.current = window.setInterval(spawnBubble, SPAWN_INTERVAL);

    return () => {
      clearSpawn();
      clearFeedbackTimeout();
    };
  }, [objective.id, SPAWN_INTERVAL, spawnBubble, clearSpawn, clearFeedbackTimeout]);

  // ✅ fin de partie
  useEffect(() => {
    if (timeLeft > 0) return;
    if (endedRef.current) return;

    endedRef.current = true;
    clearSpawn();
    onTimeEnd();
  }, [timeLeft, clearSpawn, onTimeEnd]);

  const handleBubbleClick = useCallback(
    (isGood: boolean) => {
      if (endedRef.current) return;

      if (isGood) {
        onScoreChange(score + 1);
        showFeedback('✅ Bien joué ! Micronutriment adapté à l’objectif.', 'good');
      } else {
        onScoreChange(Math.max(0, score - 1));
        showFeedback('❌ Oups, celui-ci ne cible pas vraiment cet objectif.', 'bad');
      }
    },
    [score, onScoreChange, showFeedback]
  );

  const handleBubbleAnimationEnd = useCallback((id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
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

        {/* Chips : seulement informatives (non cliquables) */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {objective.targets.map((target) => (
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
          {bubbles.map((bubble) => (
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
