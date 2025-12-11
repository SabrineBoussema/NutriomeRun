import { useEffect, useRef } from 'react';
import { Item } from '../types';

interface BubbleProps {
  item: Item;
  isGood: boolean;
  left: number;
  onClick: (isGood: boolean) => void;
  onAnimationEnd: () => void;
}

export function Bubble({ item, isGood, left, onClick, onAnimationEnd }: BubbleProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasClickedRef = useRef(false);

  const handleClick = (e: React.MouseEvent) => {
    if (hasClickedRef.current) return;
    hasClickedRef.current = true;

    const el = elementRef.current;
    if (el) {
      onClick(isGood);
      el.classList.add(isGood ? 'bg-[#bbf7d0]' : 'bg-[#fecaca]');
      el.classList.add(isGood ? 'border-[#22c55e]' : 'border-[#ef4444]');
      el.style.pointerEvents = 'none';

      setTimeout(() => {
        onAnimationEnd();
      }, 300);
    }
  };

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const handleAnimationEnd = () => {
      // si le joueur n’a pas cliqué, on considère que la bulle est "ratée"
      if (!hasClickedRef.current) {
        onAnimationEnd();
      }
    };

    el.addEventListener('animationend', handleAnimationEnd);
    return () => {
      el.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [onAnimationEnd]);

  const baseClasses =
    'absolute top-0 px-3.5 py-2.5 rounded-full bg-white border text-xs text-gray-900 inline-flex items-center gap-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] cursor-pointer select-none will-change-transform';

  const typeClasses = isGood
    ? 'border-[rgba(28,156,108,0.6)] bg-[#f0fdf4]'
    : 'border-[rgba(239,68,68,0.5)] bg-[#fef2f2]';

  return (
    <div
      ref={elementRef}
      className={`${baseClasses} ${typeClasses}`}
      style={{
        left: `${left}px`,
        animation: 'fall 6s linear forwards'
      }}
      onClick={handleClick}
    >
      <span className="whitespace-nowrap">{item.name}</span>
      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-gray-600">
        {item.label}
      </span>
    </div>
  );
}
