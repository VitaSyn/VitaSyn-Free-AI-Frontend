import React, { useMemo } from 'react';
import { CheckCircle2, XCircle, Volume2, Eye as EyeIcon, BookOpen } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { ClosedEyePanel } from './ClosedEyePanel';
import { EYE_MODE_ORDER, READING_STAGES, READING_STAGE_COUNT, type EyeMode } from './eyeTestData';

interface ReadingTestProps {
  mode: EyeMode;
  stageIndex: number;
  correctCount: number;
  onAnswer: (canRead: boolean) => void;
  onQuit: () => void;
}

const modeLabel = (
  t: { leftEyeLabel: string; rightEyeLabel: string; bothEyesLabel: string },
  mode: EyeMode
): string => {
  if (mode === 'left') return t.leftEyeLabel;
  if (mode === 'right') return t.rightEyeLabel;
  return t.bothEyesLabel;
};

export const ReadingTest: React.FC<ReadingTestProps> = ({ mode, stageIndex, correctCount, onAnswer, onQuit }) => {
  const { t, language } = useThemeLanguage();
  const isTamil = language === 'ta';

  const stage = READING_STAGES[stageIndex] ?? READING_STAGES[READING_STAGES.length - 1];
  const words = t.readingWords;
  const nextModeIndex = EYE_MODE_ORDER.indexOf(mode) + 1;
  const isLastMode = nextModeIndex >= EYE_MODE_ORDER.length;

  // A distinct word for every (mode, stage) pair — 3 modes x 5 stages = 15 unique words,
  // so no word is ever repeated between the left, right and both-eye tests.
  const wordIndex = EYE_MODE_ORDER.indexOf(mode) * READING_STAGE_COUNT + stageIndex;
  const word = useMemo(() => {
    if (!words || words.length === 0) return '';
    return words[wordIndex % words.length];
  }, [words, wordIndex]);

  const testPanel = (
    <div className="w-full min-h-[280px] flex flex-col items-center justify-center gap-3 p-3 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border-2 border-lime-500/30">
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-700 dark:text-lime-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
        <EyeIcon className="w-3 h-3" />
        <span>{modeLabel(t, mode)}</span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {t.readingStage} {stageIndex + 1} {t.of} {READING_STAGE_COUNT}
        </span>
        <span className="text-[10px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400">
          {stage.snellen}
        </span>
      </div>

      {/* Word display — font size shrinks with each stage */}
      <div className="w-full flex-1 min-h-0 px-3 py-4 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/90 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <p
          className={`${stage.sizeClass} font-bold tracking-wide text-zinc-900 dark:text-zinc-50 text-center uppercase break-words leading-tight`}
        >
          {word}
        </p>
      </div>

      <p className="text-[11px] sm:text-xs font-semibold text-zinc-800 dark:text-zinc-200 text-center">
        {t.canYouReadPrompt}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-sm">
        <button
          type="button"
          onClick={() => onAnswer(true)}
          className="min-h-[44px] py-2.5 px-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer touch-manipulation flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{t.readingCanRead}</span>
        </button>
        <button
          type="button"
          onClick={() => onAnswer(false)}
          className="min-h-[44px] py-2.5 px-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer touch-manipulation flex items-center justify-center gap-1.5"
        >
          <XCircle className="w-4 h-4" />
          <span>{t.readingCannotRead}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="page-fit-band flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-4 h-4 text-lime-500 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 truncate">
            {t.phase2Title}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {t.readingProgressLabel}: {correctCount}/{READING_STAGE_COUNT}
          </span>
          <button
            type="button"
            onClick={onQuit}
            className="text-[11px] text-zinc-600 dark:text-zinc-400 hover:underline font-semibold cursor-pointer touch-manipulation"
          >
            {isTamil ? 'தவிர்' : 'Skip'}
          </button>
        </div>
      </div>

      {/* Stage progress */}
      <div className="page-fit-band w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-2.5">
        <div
          className="bg-gradient-to-r from-lime-500 to-amber-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((stageIndex + 1) / READING_STAGE_COUNT) * 100}%` }}
        />
      </div>

      <div className="mt-2 flex flex-col gap-3">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-[11px] sm:text-xs text-amber-700 dark:text-amber-300 font-medium">
            <Volume2 className="w-3.5 h-3.5 shrink-0" />
            <span>{t.distanceTip}</span>
          </div>
        </div>

        {mode === 'both' ? (
          <div className="max-w-xl w-full mx-auto animate-slide-in-right">{testPanel}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {mode === 'left' ? (
              <>
                <div className="animate-slide-in-right">{testPanel}</div>
                <div className="animate-slide-in-left">
                  <ClosedEyePanel mode={mode} />
                </div>
              </>
            ) : (
              <>
                <div className="animate-slide-in-left">
                  <ClosedEyePanel mode={mode} />
                </div>
                <div className="animate-slide-in-right">{testPanel}</div>
              </>
            )}
          </div>
        )}

        {/* Cover-eye guidance */}
        {mode !== 'both' && (
          <p className="page-fit-band text-[11px] sm:text-xs text-center text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t.readingCoverEyeTip}
          </p>
        )}

        {isLastMode && stageIndex === READING_STAGE_COUNT - 1 && (
          <p className="page-fit-band text-center text-[11px] font-bold text-lime-600 dark:text-lime-400">
            {t.readingComplete} {t.next} → {isTamil ? 'கேள்விகள்' : 'Questions'}
          </p>
        )}
      </div>
    </div>
  );
};
