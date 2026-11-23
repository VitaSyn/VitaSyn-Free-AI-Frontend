import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Users } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { EyeGlyphRow } from './EyeGlyphRow';
import { READING_STAGE_COUNT, type EyeMode } from './eyeTestData';

interface EyeModeSelectProps {
  scores: Record<EyeMode, number>;
  onStart: () => void;
}

const modeIcon = (mode: EyeMode) => (mode === 'both' ? Users : BookOpen);

/**
 * Reading test intro page. The cards are a non-interactive showcase of the three
 * eye tests that will run automatically in the order left -> right -> both.
 */
export const EyeModeSelect: React.FC<EyeModeSelectProps> = ({ scores, onStart }) => {
  const { t, language } = useThemeLanguage();
  const isTamil = language === 'ta';

  const cards: {
    mode: EyeMode;
    step: number;
    label: string;
    desc: string;
    leftOpen: boolean;
    rightOpen: boolean;
    accent: string;
    iconTint: string;
  }[] = [
    {
      mode: 'left',
      step: 1,
      label: t.leftEyeBtn,
      desc: isTamil ? 'வலது கண் மூடப்படும், இடது கண்ணால் வாசிக்கவும்' : 'Right eye closed, read with the left eye',
      leftOpen: true,
      rightOpen: false,
      accent: 'border-lime-500/40',
      iconTint: 'bg-lime-500/15 text-lime-500',
    },
    {
      mode: 'right',
      step: 2,
      label: t.rightEyeBtn,
      desc: isTamil ? 'இடது கண் மூடப்படும், வலது கண்ணால் வாசிக்கவும்' : 'Left eye closed, read with the right eye',
      leftOpen: false,
      rightOpen: true,
      accent: 'border-amber-500/40',
      iconTint: 'bg-amber-500/15 text-amber-500',
    },
    {
      mode: 'both',
      step: 3,
      label: t.bothEyesBtn,
      desc: isTamil ? 'இரு கண்களும் திறந்து வாசிக்கவும்' : 'Both eyes open, read normally',
      leftOpen: true,
      rightOpen: true,
      accent: 'border-purple-500/40',
      iconTint: 'bg-purple-500/15 text-purple-500',
    },
  ];

  const allDone = cards.every(({ mode }) => scores[mode] > 0);

  return (
    <div className="w-full flex flex-col bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="page-fit-band text-center mb-4">
        <h2 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {isTamil ? 'வாசிப்பு பரிசோதனை அறிமுகம்' : 'Reading Test Intro'}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mt-1.5 max-w-lg mx-auto leading-relaxed">
          {isTamil
            ? 'மூன்று கண் பரிசோதனைகள் இடது, வலது, இரு கண்களும் என்ற வரிசையில் தானாக நடைபெறும். ஒவ்வொன்றிலும் 5 சொல் அளவு நிலைகள் உள்ளன.'
            : 'Three eye tests run automatically in the order left, right, then both eyes. Each has 5 word-size stages.'}
        </p>
      </div>

      {/* Non-interactive showcase cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 content-center">
        {cards.map(({ mode, step, label, desc, leftOpen, rightOpen, accent, iconTint }) => {
          const Icon = modeIcon(mode);
          const done = scores[mode] > 0;

          return (
            <div
              key={mode}
              aria-disabled="true"
              className={`relative p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border-2 ${accent} flex flex-col items-center justify-center text-center gap-2 select-none overflow-hidden`}
            >
              {/* Step number */}
              <span className="absolute top-2.5 left-3 text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {isTamil ? `படி ${step}` : `Step ${step}`}
              </span>

              <EyeGlyphRow leftOpen={leftOpen} rightOpen={rightOpen} size={52} />

              <div className={`w-9 h-9 rounded-xl ${iconTint} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>

              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{label}</h3>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">{desc}</p>

              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <span>
                  {READING_STAGE_COUNT} {isTamil ? 'நிலைகள்' : 'stages'}
                </span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 text-lime-500" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order reminder */}
      <div className="page-fit-band mt-3 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex-wrap">
        <span className="text-lime-600 dark:text-lime-400">{t.leftEyeLabel}</span>
        <ArrowRight className="w-3 h-3" />
        <span className="text-amber-600 dark:text-amber-400">{t.rightEyeLabel}</span>
        <ArrowRight className="w-3 h-3" />
        <span className="text-purple-600 dark:text-purple-400">{t.bothEyesLabel}</span>
      </div>

      {/* Start CTA */}
      <div className="page-fit-band mt-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400">
          {isTamil
            ? 'ஒரு கை தூரத்தில் அமர்ந்து, ஒவ்வொரு கண்ணையும் தனித்தனியாகப் பரிசோதியுங்கள்.'
            : 'Sit at arm’s length and cover each eye in turn as instructed.'}
        </p>

        <button
          type="button"
          onClick={onStart}
          disabled={allDone}
          className="w-full sm:w-auto min-h-[48px] flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-lime-600 to-amber-500 hover:from-lime-500 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-md shadow-lime-500/20 transition-all cursor-pointer touch-manipulation active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BookOpen className="w-4 h-4" />
          <span>{isTamil ? 'வாசிப்பு பரிசோதனையைத் தொடங்கு' : 'Take Reading Test'}</span>
        </button>
      </div>
    </div>
  );
};

export default EyeModeSelect;
