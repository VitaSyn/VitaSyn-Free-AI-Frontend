import React from 'react';
import { Sparkles, Eye, ArrowRight, ShieldCheck, Globe, HeartPulse } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';

interface WelcomeViewProps {
  onStartHair: () => void;
  onStartEye: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStartHair, onStartEye }) => {
  const { t, language } = useThemeLanguage();
  const { user } = useAuth();

  return (
    <div className="mx-auto w-full max-w-5xl pb-4">
      {/* Hero Brand Section */}
      <div className="page-fit-band text-center py-1 sm:py-2">
        <div className="flex justify-center mb-2">
          <BrandLogo size="lg" />
        </div>

        {user && (
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-600 dark:text-lime-300 text-[11px] font-semibold mb-1.5">
            <span>👋</span>
            <span>{t.loggedInAs}: <strong>{user.name}</strong></span>
          </div>
        )}

        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          {t.welcomeTitle}
        </h1>
        <p className="text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300 mt-1 max-w-xl mx-auto leading-relaxed px-1">
          {t.welcomeSubtitle}
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-600 dark:text-amber-300 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'ta' ? 'AI முடி சரிபார்ப்பு' : 'AI Hair Verification'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-600 dark:text-lime-300 text-[11px] font-semibold">
            <HeartPulse className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'ta' ? 'AI ஆலோசனை அறிக்கை' : 'AI Consultation Report'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-[11px] font-semibold">
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span>English & தமிழ்</span>
          </span>
        </div>
      </div>

      {/* Interactive Card Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
        {/* Hair Test Card */}
        <div
          onClick={onStartHair}
          className="group relative min-h-[220px] sm:min-h-[240px] p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#121812] border border-amber-400/30 hover:border-amber-400 dark:hover:border-amber-400/80 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden touch-manipulation active:scale-[0.98]"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

          <div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>

            <div className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              {language === 'ta' ? 'AI முடி ஆய்வு & ஆலோசனை' : 'AI Vision Analysis & Care Consultation'}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors">
              {t.hairCardTitle}
            </h2>

            <p className="text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300 mt-1.5 leading-relaxed">
              {t.hairCardDesc}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>{t.startBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-600 dark:text-zinc-400">
              {language === 'ta' ? 'புகைப்படம் + 5 கேள்விகள்' : 'Photo + 5 Questions'}
            </span>
          </div>
        </div>

        {/* Eye Test Card */}
        <div
          onClick={onStartEye}
          className="group relative min-h-[220px] sm:min-h-[240px] p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#121812] border border-lime-500/30 hover:border-lime-500 dark:hover:border-lime-400/80 shadow-sm hover:shadow-xl hover:shadow-lime-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden touch-manipulation active:scale-[0.98]"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-lime-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

          <div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-lime-500/15 text-lime-500 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Eye className="w-5 h-5" />
            </div>

            <div className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 mb-1">
              {language === 'ta' ? '10 நிலைகள் + பார்வை அளவீடு + AI வழிகாட்டல்' : '10 Stages + Visual Acuity + AI Guidance'}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-lime-500 transition-colors">
              {t.eyeCardTitle}
            </h2>

            <p className="text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300 mt-1.5 leading-relaxed">
              {t.eyeCardDesc}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1 text-xs font-bold text-lime-600 dark:text-lime-400 group-hover:translate-x-1 transition-transform">
              <span>{t.startBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-600 dark:text-zinc-400">
              {language === 'ta'
                ? '10 வண்ண நிலைகள் + 3 கண் வாசிப்பு'
                : '10 colour stages + 3 eye tests'}
            </span>
          </div>
        </div>
      </div>

      {/* Company Trust Bar */}
      <div className="page-fit-band mt-3 p-3 sm:p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-[#1e2a1e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-zinc-800 dark:text-zinc-200">
              {language === 'ta' ? 'VitaSyn Pvt Ltd சுகாதார முயற்சி' : 'VitaSyn Pvt Ltd Healthcare Initiative'}
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-[11px] mt-0.5">
              {language === 'ta'
                ? 'அனைவருக்கும் எளிய மற்றும் இலவசமான AI நல்வாழ்வு தொழில்நுட்பம்.'
                : 'Providing accessible preventative AI wellness diagnostics to the public.'}
            </p>
          </div>
        </div>

        <a
          href="https://vitasyn.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto text-center shrink-0 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold hover:border-amber-400 transition-colors touch-manipulation"
        >
          vitasyn.in
        </a>
      </div>
    </div>
  );
};
