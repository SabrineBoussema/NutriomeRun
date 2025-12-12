import { useState, useEffect, useCallback, useRef } from "react";
import { IntroScreen } from "./components/IntroScreen";
import { RewardsScreen } from "./components/RewardsScreen";
import { GameScreen } from "./components/GameScreen";
import { ResultScreen } from "./components/ResultScreen";
import { GameScreen as GameScreenType, Objective } from "./types";
import { OBJECTIVES, TOTAL_TIME } from "./constants";
import nutriomeLogo from "/nutriome-logo.png";

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreenType>("intro");
  const [currentObjective, setCurrentObjective] = useState<Objective | null>(null);
  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameRunning, setGameRunning] = useState(false);

  // 👤 Infos joueur
  const [playerName, setPlayerName] = useState("");
  const [playerPhone, setPlayerPhone] = useState("");

  // ✅ refs pour timer fiable
  const intervalRef = useRef<number | null>(null);
  const timeLeftRef = useRef<number>(TOTAL_TIME);
  const isEndingRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pickRandomObjective = useCallback(() => {
    const idx = Math.floor(Math.random() * OBJECTIVES.length);
    return OBJECTIVES[idx];
  }, []);

  const handleRegisterPlayer = useCallback((name: string, phone: string) => {
    setPlayerName(name.trim());
    setPlayerPhone(phone.trim());
  }, []);

  // ✅ Fin de jeu centralisée + anti double appel
  const endGame = useCallback(() => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;

    clearTimer();
    setGameRunning(false);
    setCurrentScreen("result");
  }, [clearTimer]);

  // ✅ Start game (avec override depuis IntroScreen)
  const startGame = useCallback(
    (override?: { name: string; phone: string }) => {
      const finalName = (override?.name ?? playerName).trim();
      const finalPhone = (override?.phone ?? playerPhone).trim();
      if (!finalName || !finalPhone) return;

      isEndingRef.current = false;
      clearTimer();

      setScore(0);
      setCurrentObjective(pickRandomObjective());

      setTimeLeft(TOTAL_TIME);
      timeLeftRef.current = TOTAL_TIME;

      setGameRunning(true);
      setCurrentScreen("game");
    },
    [playerName, playerPhone, pickRandomObjective, clearTimer]
  );

  // ✅ garder la ref synchronisée avec le state
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // ⏱ Timer stable
  useEffect(() => {
    if (!gameRunning) return;

    clearTimer();

    intervalRef.current = window.setInterval(() => {
      const current = timeLeftRef.current;

      if (current <= 1) {
        setTimeLeft(0);
        timeLeftRef.current = 0;
        endGame();
        return;
      }

      const next = current - 1;
      setTimeLeft(next);
      timeLeftRef.current = next;
    }, 1000);

    return () => clearTimer();
  }, [gameRunning, clearTimer, endGame]);

  // 👌 si GameScreen déclenche fin (fallback)
  const handleTimeEnd = useCallback(() => {
    endGame();
  }, [endGame]);

  // 🔎 Petit badge état
  const screenLabel =
    currentScreen === "intro"
      ? "Inscription"
      : currentScreen === "rewards"
      ? "Cadeaux"
      : currentScreen === "game"
      ? "Jeu"
      : "Résultat";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(28, 156, 108, 0.18), transparent 55%),
          radial-gradient(circle at bottom right, rgba(247, 183, 51, 0.18), transparent 55%),
          linear-gradient(180deg, #f7fafc 0%, #f3f6fb 100%)
        `,
      }}
    >
      <div className="w-full max-w-[560px]">
        {/* CARD */}
        <div className="bg-white w-full rounded-[26px] p-5 pb-6 shadow-[0_20px_45px_rgba(0,0,0,0.12)] relative overflow-hidden">
          {/* ✨ Premium gradient overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-35 z-0 bg-gradient-to-br from-[#1c9c6c]/18 via-[#f7b733]/12 to-transparent" />

          {/* 🌿 HEADER BRANDING NUTRIOME */}
          <div className="relative z-10 mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow border border-gray-200">
                <img
                  src={nutriomeLogo}
                  alt="Nutriome"
                  className="h-7 w-7 object-contain"
                />
              </div>

              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-sm font-semibold text-[#10343a] truncate">
                    Nutriome
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-[#10343a]">
                    🎮 Nutri-Run
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 truncate">
                  Micronutrition 
                </div>
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-[#e6f6f0] px-3 py-1 text-[11px] font-semibold text-[#1c9c6c]">
              {screenLabel}
            </span>
          </div>

          {/* CONTENT */}
          <div className="relative z-10">
            {currentScreen === "intro" && (
              <IntroScreen
                onStart={(p) => startGame(p)} // ✅ start direct après formulaire
                onSeeRewards={() => setCurrentScreen("rewards")}
                onRegisterPlayer={handleRegisterPlayer}
                initialName={playerName}
                initialPhone={playerPhone}
              />
            )}

            {currentScreen === "rewards" && (
              <RewardsScreen onBack={() => setCurrentScreen("intro")} />
            )}

            {currentScreen === "game" && currentObjective && (
              <GameScreen
                objective={currentObjective}
                timeLeft={timeLeft}
                score={score}
                onScoreChange={setScore}
                onTimeEnd={handleTimeEnd}
              />
            )}

            {currentScreen === "result" && (
              <ResultScreen score={score} onPlayAgain={() => startGame()} />
            )}

            {/* Footer discret */}
            <div className="mt-4 text-center text-[11px] text-gray-400">
              © Nutriome — Jeu pédagogique en micronutrition
            </div>
          </div>
        </div>

        {/* mini infos joueur (optionnel) */}
        {(playerName || playerPhone) && (
          <div className="mt-3 text-center text-[11px] text-gray-400">
            Joueur : <span className="font-semibold text-gray-500">{playerName || "—"}</span>{" "}
            • <span className="font-semibold text-gray-500">{playerPhone || "—"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
