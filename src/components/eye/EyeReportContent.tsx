import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, HelpCircle, Sparkles } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import type { DiagnosticReport } from '../../utils/reportTranslator';
import { EYE_MODE_ORDER, READING_STAGE_COUNT } from './eyeTestData';

type EyeReportLabels = ReturnType<typeof useThemeLanguage>['t'];

interface EyeReportContentProps {
  report: DiagnosticReport;
  t: EyeReportLabels;
  isTamil: boolean;
}

export const EyeReportContent: React.FC<EyeReportContentProps> = ({ report, t, isTamil }) => {
  const metrics = report.eyeMetrics;
  const consultLevel = report.consultation?.level ?? 'none';
  const consultMessage = report.consultation?.message ?? '';
  const screenTimeLabel: Record<string, string> = {
    below1: t.screenTimeBelow1hr,
    '1to3': t.screenTime1to3hr,
    above3: t.screenTimeAbove3hr,
  };
  const overallScore = report.overallScore ?? 0;
  const colorStagesPassed = report.colorStagesPassed ?? metrics?.colorStagesPassed ?? 0;
  const grade = report.grade ?? '';

  return (
    <>
      <div data-pdf-ignore className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-lime-500/10 to-amber-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400">
            {report.uniqueResultCode}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
            {report.title}
          </h2>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">{t.eyeReportEval}</p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/80 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto shrink-0">
          <div className="text-left sm:text-right">
            <div className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400">
              {t.overallScore}
            </div>
            <div className="text-2xl font-black text-lime-600 dark:text-lime-400">
              {overallScore}
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">/100</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-lime-500/40 border-t-amber-400 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-200">
            {overallScore >= 80
              ? isTamil
                ? 'சிறந்தது'
                : 'Optimal'
              : overallScore >= 60
                ? isTamil
                  ? 'சீரானது'
                  : 'Standard'
                : isTamil
                  ? 'கண் சோர்வு'
                  : 'Mild Strain'}
          </div>
        </div>
      </div>

      {consultLevel !== 'none' && (
        <div
          role="alert"
          className={`mt-4 p-4 rounded-2xl border-2 flex items-start gap-3 ${
            consultLevel === 'mandatory'
              ? 'bg-red-500/10 border-red-500/60'
              : 'bg-amber-500/10 border-amber-500/50'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              consultLevel === 'mandatory'
                ? 'bg-red-500 text-white'
                : 'bg-amber-500 text-zinc-950'
            }`}
          >
            {consultLevel === 'mandatory' ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <HelpCircle className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <div
              className={`text-xs font-black uppercase tracking-wider mb-1 ${
                consultLevel === 'mandatory'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-amber-700 dark:text-amber-300'
              }`}
            >
              {consultLevel === 'mandatory'
                ? isTamil
                  ? 'கட்டாயமாக மருத்துவர் ஆலோசனை அவசியம்'
                  : 'Mandatory Doctor Consultation'
                : isTamil
                  ? 'மருத்துவர் ஆலோசனை பரிந்துரைக்கப்படுகிறது'
                  : 'Doctor Consultation Advised'}
            </div>
            <p
              className={`text-xs sm:text-[13px] leading-relaxed ${
                consultLevel === 'mandatory'
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-amber-800 dark:text-amber-200'
              }`}
            >
              {consultMessage}
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/25">
          <div className="text-[11px] uppercase font-bold text-amber-700 dark:text-amber-300">
            {t.eyeColorRating}
          </div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
            {report.colorStatus} ({colorStagesPassed}/10 {t.stage})
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-lime-500/10 border border-lime-500/25">
          <div className="text-[11px] uppercase font-bold text-lime-700 dark:text-lime-300">
            {t.eyeAcuityTier}
          </div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
            {grade} ({report.acuityScore ?? 0}/{READING_STAGE_COUNT * EYE_MODE_ORDER.length}{' '}
            {isTamil ? 'சொற்கள்' : 'words'})
          </div>
        </div>
      </div>

      {metrics && (
        <div className="mt-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
          <div className="text-[11px] uppercase font-bold text-zinc-600 dark:text-zinc-400 mb-2.5">
            {isTamil ? 'உங்கள் கண் பரிசோதனை முடிவுகள்' : 'Your Eye Test Results'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-zinc-600 dark:text-zinc-400">{t.colorDiscriminationLabel}</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {metrics.colorStagesPassed}/{metrics.colorStagesTotal} · {metrics.colorPoints}/
                {metrics.colorPointsTotal} {isTamil ? 'புள்ளிகள்' : 'pts'}
              </span>
            </div>
            <Score label={t.leftEyeLabel} score={metrics.leftEyeScore} total={metrics.readingStagesPerEye} />
            <Score label={t.rightEyeLabel} score={metrics.rightEyeScore} total={metrics.readingStagesPerEye} />
            <Score label={t.bothEyesLabel} score={metrics.bothEyesScore} total={metrics.readingStagesPerEye} />
          </div>
        </div>
      )}

      {metrics && (
        <div
          data-pdf-answers
          className="mt-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-[11px] uppercase font-bold text-zinc-600 dark:text-zinc-400">
              {isTamil ? 'உங்கள் பதில்கள்' : 'Your Answers'}
            </div>
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
              {metrics.symptomCount}/5 {isTamil ? 'அறிகுறிகள்' : 'symptoms'}
            </span>
          </div>
          <div
            data-pdf-answers-grid
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 text-xs"
          >
            <Answer label={t.screenTimePrompt} value={metrics.screenTime ? screenTimeLabel[metrics.screenTime] : '—'} />
            <Answer label={t.phoneAtNightPrompt} value={metrics.usingPhoneAtNight ? t.yes : t.no} positive={metrics.usingPhoneAtNight} />
            <Answer label={t.eyeIrritationPrompt} value={metrics.eyeIrritationDuringTest ? t.yes : t.no} positive={metrics.eyeIrritationDuringTest} />
            <Answer label={t.wateryEyesPrompt} value={metrics.wateryEyesDuringTest ? t.yes : t.no} positive={metrics.wateryEyesDuringTest} />
            <Answer label={t.headachePrompt} value={metrics.headacheAfterScreenUse ? t.yes : t.no} positive={metrics.headacheAfterScreenUse} />
            <Answer label={t.blurryVisionPrompt} value={metrics.blurryVisionAfterProlongedUse ? t.yes : t.no} positive={metrics.blurryVisionAfterProlongedUse} />
          </div>
        </div>
      )}

      <div className="mt-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          <Sparkles className="w-4 h-4 text-lime-500" />
          <span>{t.eyeClinicalConsult}</span>
        </div>
        <p className="whitespace-pre-line">{report.overview}</p>
      </div>

      {report.clinicalFindings && report.clinicalFindings.length > 0 && (
        <div className="mt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
            {t.keyFindings}
          </h3>
          <ul className="space-y-1.5">
            {report.clinicalFindings.map((finding, index) => (
              <li
                key={index}
                className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2 bg-zinc-50 dark:bg-zinc-900/40 p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ListCard title={t.recommendedDos} items={report.dos ?? []} kind="do" />
        <ListCard title={t.thingsToAvoid} items={report.donts ?? []} kind="dont" />
      </div>

      {report.recommendations && report.recommendations.length > 0 && (
        <div className="mt-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-lime-500" />
            <span>{t.expertRecommendations}</span>
          </div>
          <ul className="space-y-1.5">
            {report.recommendations.map((recommendation, index) => (
              <li key={index} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                <span className="text-lime-500 font-bold">→</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-xl bg-lime-500/10 border border-lime-500/20 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2.5">
        <Clock className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">{t.lifestyleTip}: </span>
          <span>{report.lifestyleGuidance}</span>
        </div>
      </div>

      <p className="mt-5 text-[11px] text-zinc-600 dark:text-zinc-400 italic text-center border-t border-zinc-200 dark:border-zinc-800 pt-3">
        {report.disclaimer || t.medicalDisclaimer}
      </p>
    </>
  );
};

const Score: React.FC<{ label: string; score?: number | null; total?: number }> = ({
  label,
  score,
  total,
}) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
    <span className="font-bold text-zinc-900 dark:text-zinc-100">
      {score ?? 0}/{total ?? READING_STAGE_COUNT}
    </span>
  </div>
);

const Answer: React.FC<{ label: string; value: string; positive?: boolean }> = ({
  label,
  value,
  positive,
}) => (
  <div className="flex items-start justify-between gap-2">
    <span data-pdf-answer-label className="min-w-0 text-zinc-600 dark:text-zinc-400">
      {label}
    </span>
    <span
      className={`shrink-0 font-bold ${
        positive === undefined
          ? 'text-zinc-900 dark:text-zinc-100'
          : positive
            ? 'text-red-600 dark:text-red-400'
            : 'text-lime-600 dark:text-lime-400'
      }`}
    >
      {value}
    </span>
  </div>
);

const ListCard: React.FC<{ title: string; items: string[]; kind: 'do' | 'dont' }> = ({
  title,
  items,
  kind,
}) => {
  const isDo = kind === 'do';
  return (
    <div
      className={`p-4 rounded-xl ${
        isDo
          ? 'bg-lime-500/5 border border-lime-500/20'
          : 'bg-amber-500/5 border border-amber-500/20'
      }`}
    >
      <div
        className={`flex items-center gap-2 text-xs font-bold mb-2 uppercase tracking-wider ${
          isDo ? 'text-lime-700 dark:text-lime-400' : 'text-amber-700 dark:text-amber-400'
        }`}
      >
        {isDo ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
        <span>{title}</span>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
            <span className={`font-bold ${isDo ? 'text-lime-500' : 'text-amber-500'}`}>
              {isDo ? '✓' : '✕'}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
