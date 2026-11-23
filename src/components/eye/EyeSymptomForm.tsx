import React from 'react';
import { CheckCircle2, XCircle, MonitorSmartphone, Moon, Flame, Droplets, Brain, EyeOff, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { YES_NO_QUESTION_KEYS, type ScreenTimeOption, type YesNoAnswers, type YesNoKey } from './eyeTestData';

interface EyeSymptomFormProps {
  screenTime: ScreenTimeOption | null;
  onScreenTimeChange: (value: ScreenTimeOption) => void;
  answers: YesNoAnswers;
  onAnswerChange: (key: YesNoKey, value: boolean) => void;
  colorPassed: number;
  leftScore: number;
  rightScore: number;
  bothScore: number;
  isSubmitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

interface YesNoRow {
  key: YesNoKey;
  icon: React.ComponentType<{ className?: string }>;
  prompt: string;
  tint: string;
  activeTint: string;
}

export const EyeSymptomForm: React.FC<EyeSymptomFormProps> = ({
  screenTime,
  onScreenTimeChange,
  answers,
  onAnswerChange,
  colorPassed,
  leftScore,
  rightScore,
  bothScore,
  isSubmitting,
  onSubmit,
  onBack,
}) => {
  const { t, language } = useThemeLanguage();
  const isTamil = language === 'ta';

  const yesNoRows: YesNoRow[] = [
    { key: 'phoneAtNight', icon: Moon, prompt: t.phoneAtNightPrompt, tint: 'text-purple-500', activeTint: 'bg-purple-500/20 border-purple-500' },
    { key: 'eyeIrritation', icon: Flame, prompt: t.eyeIrritationPrompt, tint: 'text-red-500', activeTint: 'bg-red-500/20 border-red-500' },
    { key: 'wateryEyes', icon: Droplets, prompt: t.wateryEyesPrompt, tint: 'text-sky-500', activeTint: 'bg-sky-500/20 border-sky-500' },
    { key: 'headache', icon: Brain, prompt: t.headachePrompt, tint: 'text-amber-500', activeTint: 'bg-amber-500/20 border-amber-500' },
    { key: 'blurryVision', icon: EyeOff, prompt: t.blurryVisionPrompt, tint: 'text-lime-500', activeTint: 'bg-lime-500/20 border-lime-500' },
  ];

  const screenTimeOptions: { value: ScreenTimeOption; label: string }[] = [
    { value: 'below1', label: t.screenTimeBelow1hr },
    { value: '1to3', label: t.screenTime1to3hr },
    { value: 'above3', label: t.screenTimeAbove3hr },
  ];

  const isComplete =
    screenTime !== null && YES_NO_QUESTION_KEYS.every((key) => answers[key] !== null);

  return (
    <div className="w-full flex flex-col bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="page-fit-band border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">{t.phase3Title}</h2>
        <p className="text-[11px] text-zinc-700 dark:text-zinc-300 mt-0.5">{t.eyePhase3Desc}</p>
      </div>

      {/* Test performance recap */}
      <div className="page-fit-band grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 p-2.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[11px] sm:text-xs">
        <div>
          <span className="text-zinc-600 dark:text-zinc-400">{t.colorDiscriminationLabel}:</span>{' '}
          <span className="font-bold text-amber-600 dark:text-amber-400">{colorPassed}/10</span>
        </div>
        <div>
          <span className="text-zinc-600 dark:text-zinc-400">{t.leftEyeLabel}:</span>{' '}
          <span className="font-bold text-lime-600 dark:text-lime-400">{leftScore}/5</span>
        </div>
        <div>
          <span className="text-zinc-600 dark:text-zinc-400">{t.rightEyeLabel}:</span>{' '}
          <span className="font-bold text-lime-600 dark:text-lime-400">{rightScore}/5</span>
        </div>
        <div>
          <span className="text-zinc-600 dark:text-zinc-400">{t.bothEyesLabel}:</span>{' '}
          <span className="font-bold text-lime-600 dark:text-lime-400">{bothScore}/5</span>
        </div>
      </div>

      {/* Keep questions in normal document flow so they remain reachable on short screens. */}
      <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-3 content-start">
        {/* Question 1: Screen time dropdown */}
        <div className="space-y-1.5">
          <label
            htmlFor="eye-screen-time"
            className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-zinc-800 dark:text-zinc-200"
          >
            <MonitorSmartphone className="w-4 h-4 text-purple-500 shrink-0" />
            <span>
              1. {t.screenTimePrompt}
              <span className="text-red-500 ml-1">*</span>
            </span>
          </label>
          <select
            id="eye-screen-time"
            value={screenTime ?? ''}
            onChange={(e) => onScreenTimeChange(e.target.value as ScreenTimeOption)}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors cursor-pointer"
          >
            <option value="" disabled>
              {isTamil ? '— தேர்ந்தெடுக்கவும் —' : '— Select an option —'}
            </option>
            {screenTimeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Questions 2-6: yes/no rows */}
        {yesNoRows.map((row, idx) => {
          const value = answers[row.key];
          const Icon = row.icon;
          return (
            <div key={row.key} className="space-y-1.5">
              <label className="flex items-start gap-2 text-xs sm:text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${row.tint}`} />
                <span>
                  {idx + 2}. {row.prompt}
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onAnswerChange(row.key, true)}
                  className={`min-h-[40px] py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer touch-manipulation active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                    value === true
                      ? `${row.activeTint} text-zinc-900 dark:text-zinc-100 font-bold`
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.yes}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAnswerChange(row.key, false)}
                  className={`min-h-[40px] py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer touch-manipulation active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                    value === false
                      ? 'bg-zinc-500/20 border-zinc-500 text-zinc-900 dark:text-zinc-100 font-bold'
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{t.no}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="page-fit-band mt-3 pt-3 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto min-h-[40px] text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center gap-1 cursor-pointer touch-manipulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.backToReadingTest}</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {!isComplete && (
            <span className="text-[11px] text-zinc-500 dark:text-zinc-500 order-last sm:order-first">
              {isTamil ? 'அனைத்துக் கேள்விகளுக்கும் பதிலளிக்கவும்.' : 'Please answer all questions to continue.'}
            </span>
          )}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !isComplete}
            className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-lime-600 to-amber-500 hover:from-lime-500 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-md shadow-lime-500/20 active:scale-[0.98] transition-all cursor-pointer touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.aiConsulting}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.submitEyeAnalysis}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
