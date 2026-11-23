import React from 'react';
import { Play, Palette, BookOpen, ClipboardList, CheckCircle2, ShieldAlert, Clock } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { COLOR_STAGE_COUNT, READING_STAGE_COUNT } from './eyeTestData';

interface EyePreTestProps {
  onStartTest: () => void;
}

/**
 * Sample / pre-test landing page shown before the eye test starts.
 * "Start Test" opens the Pre-Instructions modal.
 */
export const EyePreTest: React.FC<EyePreTestProps> = ({ onStartTest }) => {
  const { t, language } = useThemeLanguage();
  const isTamil = language === 'ta';

  const steps = [
    {
      icon: Palette,
      color: 'amber',
      title: isTamil ? 'வண்ண வேறுபாடு தேர்வு' : 'Colour Differentiation Test',
      desc: isTamil
        ? `${COLOR_STAGE_COUNT} நிலைகள், ஒவ்வொன்றுக்கும் 10 வினாடி நேரம். வேறுபட்ட நிறக் கட்டத்தை கண்டறியுங்கள்.`
        : `${COLOR_STAGE_COUNT} stages, 10 seconds each. Spot the single tile with a different shade.`,
    },
    {
      icon: BookOpen,
      color: 'lime',
      title: isTamil ? 'வாசிப்பு பரிசோதனை' : 'Reading (Acuity) Test',
      desc: isTamil
        ? `இடது கண், வலது கண், இரு கண்களும் — ஒவ்வொன்றுக்கும் ${READING_STAGE_COUNT} சொல் அளவு நிலைகள்.`
        : `Left eye, right eye and both eyes — ${READING_STAGE_COUNT} word-size stages for each.`,
    },
    {
      icon: ClipboardList,
      color: 'purple',
      title: isTamil ? 'அறிகுறி வினாவிடை' : 'Symptom Questionnaire',
      desc: isTamil
        ? 'திரை நேரம், இரவுப் பயன்படுத்து மற்றும் கண் அறிகுறிகள் பற்றிய 6 கேள்விகள்.'
        : '6 quick questions on screen time, night usage and eye symptoms.',
    },
  ];

  const colorMap: Record<string, { box: string; icon: string }> = {
    amber: { box: 'bg-amber-500/10 border-amber-500/30', icon: 'text-amber-500' },
    lime: { box: 'bg-lime-500/10 border-lime-500/30', icon: 'text-lime-500' },
    purple: { box: 'bg-purple-500/10 border-purple-500/30', icon: 'text-purple-500' },
  };

  return (
    <div className="w-full flex flex-col bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Intro hero */}
      <div className="page-fit-band text-center">
        <h2 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {isTamil ? 'கண் பரிசோதனைக்கு முன்பு' : 'Before You Begin'}
        </h2>
        <p className="text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300 mt-1 max-w-lg mx-auto leading-relaxed">
          {isTamil
            ? 'இந்த சோதனையில் மூன்று பகுதிகள் உள்ளன. முழு விவரங்களைப் படித்து, பின்னர் தொடங்கவும்.'
            : 'This checkup has three parts. Review the overview below, then start when you are ready.'}
        </p>
      </div>

      {/* Steps preview */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 content-center">
        {steps.map(({ icon: Icon, color, title, desc }, idx) => (
          <div
            key={title}
            className={`p-3.5 sm:p-4 rounded-2xl border ${colorMap[color].box} flex flex-col items-start justify-center overflow-hidden`}
          >
            <div className="flex items-center gap-2 w-full mb-1.5">
              <Icon className={`w-4.5 h-4.5 shrink-0 ${colorMap[color].icon}`} />
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {isTamil ? `பகுதி ${idx + 1}` : `Part ${idx + 1}`}
              </span>
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
            <p className="text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">
              {desc}
            </p>
          </div>
        ))}
      </div>

      {/* Key facts */}
      <div className="page-fit-band mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] sm:text-xs">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{isTamil ? 'சுமார் 4–5 நிமிடங்கள்' : 'About 4–5 minutes'}</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
          <CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0" />
          <span>{isTamil ? 'இலவசமாகவும் தனியானதாகவும்' : 'Free and fully private'}</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
          <ShieldAlert className="w-4 h-4 text-purple-500 shrink-0" />
          <span>{isTamil ? 'இது மருத்துவ முன்னறிவிப்பு அல்ல' : 'Screening only, not a diagnosis'}</span>
        </div>
      </div>

      {/* Start CTA */}
      <div className="page-fit-band mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center">
        <button
          type="button"
          onClick={onStartTest}
          className="w-full sm:w-auto min-h-[48px] flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-lime-600 to-amber-500 hover:from-lime-500 hover:to-amber-400 text-zinc-950 font-bold text-sm sm:text-base shadow-md shadow-lime-500/20 transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
        >
          <Play className="w-4.5 h-4.5" />
          <span>{t.preTestStartBtn}</span>
        </button>

        <p className="mt-2 text-center text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-500">
          {isTamil
            ? 'தொடங்கும் முன் கட்டாயமாக வழிமுறைகள் சொல்லப்படும்.'
            : 'Instructions will be shown before the test starts.'}
        </p>
      </div>
    </div>
  );
};
