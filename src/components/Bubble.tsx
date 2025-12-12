import { useEffect, useRef } from "react";
import { Item } from "../types";

interface BubbleProps {
  item: Item;
  isGood: boolean;
  left: number;
  onClick: (isGood: boolean) => void;
  onAnimationEnd: () => void;
}

export function Bubble({
  item,
  isGood,
  left,
  onClick,
  onAnimationEnd
}: BubbleProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasClickedRef = useRef(false);

  const handleClick = () => {
    if (hasClickedRef.current) return;
    hasClickedRef.current = true;

    const el = elementRef.current;
    if (!el) return;

    // 🎯 logique jeu
    onClick(isGood);

    // 🎨 feedback visuel AU CLIC uniquement
    el.classList.add(
      isGood ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"
    );

    el.style.pointerEvents = "none";

    // laisser le temps à l’animation de feedback
    setTimeout(onAnimationEnd, 300);
  };

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const handleAnimationEnd = () => {
      if (!hasClickedRef.current) {
        onAnimationEnd();
      }
    };

    el.addEventListener("animationend", handleAnimationEnd);
    return () => el.removeEventListener("animationend", handleAnimationEnd);
  }, [onAnimationEnd]);

  return (
    <div
      ref={elementRef}
      onClick={handleClick}
      className="
        absolute top-0
        px-3.5 py-2.5
        rounded-full
        bg-gray-100
        border border-gray-300
        text-xs text-gray-900
        inline-flex items-center gap-1.5
        shadow-[0_4px_10px_rgba(0,0,0,0.08)]
        cursor-pointer select-none
        transition-colors duration-200
        will-change-transform
      "
      style={{
        left: `${left}px`,
        animation: "fall 6s linear forwards"
      }}
    >
      <span className="whitespace-nowrap">{item.name}</span>

      <span className="
        text-[9px] uppercase tracking-wider
        px-1.5 py-0.5 rounded-full
        bg-gray-200 text-gray-600
      ">
        {item.label}
      </span>
    </div>
  );
}
