import { useState, useEffect, useCallback } from 'react';
import { IntroScreen } from './components/IntroScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { GameScreen as GameScreenType, Objective } from './types';
import { OBJECTIVES, TOTAL_TIME } from './constants';

// or .png

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreenType>('intro');
  const [currentObjective, setCurrentObjective] = useState<Objective | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameRunning, setGameRunning] = useState(false);

  const pickRandomObjective = useCallback(() => {
    const idx = Math.floor(Math.random() * OBJECTIVES.length);
    return OBJECTIVES[idx];
  }, []);

  const startGame = useCallback(() => {
    const objective = pickRandomObjective();
    setCurrentObjective(objective);
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setGameRunning(true);
    setCurrentScreen('game');
  }, [pickRandomObjective]);

  const handleTimeEnd = useCallback(() => {
    setGameRunning(false);
    setCurrentScreen('result');
  }, []);

  useEffect(() => {
    if (!gameRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameRunning]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-[#f5f7fb]"
      style={{
        background: `radial-gradient(circle at top left, rgba(28, 156, 108, 0.15), transparent 55%),
                     radial-gradient(circle at bottom right, rgba(247, 183, 51, 0.18), transparent 55%),
                     #f5f7fb`,
      }}
    >
      <div className="bg-white max-w-[520px] w-full rounded-[22px] p-5 pb-6 shadow-[0_18px_40px_rgba(0,0,0,0.10)] relative overflow-hidden">
        {/* 🌈 Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 z-0"
          
        />

        {/* 👇 NEW: Logo badge in the card corner */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
         
        </div>

        <div className="relative z-10">
          {currentScreen === 'intro' && (
            <IntroScreen onStart={startGame} onSeeRewards={() => setCurrentScreen('rewards')} />
          )}

          {currentScreen === 'rewards' && <RewardsScreen onBack={() => setCurrentScreen('intro')} />}

          {currentScreen === 'game' && currentObjective && (
            <GameScreen
              objective={currentObjective}
              timeLeft={timeLeft}
              score={score}
              onScoreChange={setScore}
              onTimeEnd={handleTimeEnd}
            />
          )}

          {currentScreen === 'result' && <ResultScreen score={score} onPlayAgain={startGame} />}
        </div>
      </div>
    </div>
  );
}

export default App;
