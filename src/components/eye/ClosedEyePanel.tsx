import React from 'react';
import { Hand } from 'lucide-react';
import type { EyeMode } from './eyeTestData';

interface ClosedEyePanelProps {
  /** Which eye is being tested — the opposite side gets the closed-eye animation */
  mode: EyeMode;
}

/**
 * Animated "eye covered" panel shown on the side opposite the eye under test.
 * The eyelid animates shut in a loop to reinforce that this eye stays closed.
 */
export const ClosedEyePanel: React.FC<ClosedEyePanelProps> = ({ mode }) => {
  const isLeftTest = mode === 'left';

  return (
    <div className="w-full min-h-[280px] flex flex-col items-center justify-center gap-4 p-4 sm:p-6 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/70 border-2 border-dashed border-amber-400/40 select-none">
      <div className="relative eye-glow-pulse">
        <svg
          viewBox="0 0 120 80"
          className="w-28 h-20 sm:w-36 sm:h-24"
          role="img"
          aria-label="Closed eye animation"
        >
          {/* Eye outline */}
          <path
            d="M6 40 C 26 8, 94 8, 114 40 C 94 72, 26 72, 6 40 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-zinc-400 dark:text-zinc-600"
          />
          {/* Animated closing eyelid */}
          <g className="eyelid-shut">
            <ellipse cx="60" cy="40" rx="40" ry="20" className="fill-amber-500/25" />
            <line
              x1="20"
              y1="40"
              x2="100"
              y2="40"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              className="text-amber-500"
            />
          </g>
          {/* Eyebrow */}
          <path
            d="M26 12 C 42 2, 78 2, 94 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-zinc-400/70 dark:text-zinc-600/70"
          />
        </svg>

        <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-lg">
          <Hand className="w-4 h-4" />
        </span>
      </div>

      <div className="text-center space-y-1">
        <p className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400">
          {isLeftTest ? 'RIGHT EYE CLOSED' : 'LEFT EYE CLOSED'}
        </p>
        <p className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 max-w-[180px] leading-snug">
          Cover this eye with your palm and keep it closed.
        </p>
      </div>
    </div>
  );
};
