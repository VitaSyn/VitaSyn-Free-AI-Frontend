import React, { useMemo, useRef, useState } from 'react';
import {
  Eye,
  AlertTriangle,
  RotateCcw,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useAuth } from '../../context/AuthContext';
import { localizeReport } from '../../utils/reportTranslator';
import { downloadReportPdf } from '../../utils/downloadReportPdf';
import { PreInstructionsModal } from './PreInstructionsModal';
import { EyePreTest } from './EyePreTest';
import { ColorTest } from './ColorTest';
import { ReadingTest } from './ReadingTest';
import { EyeModeSelect } from './EyeModeSelect';
import { EyeSymptomForm } from './EyeSymptomForm';
import { EyeReportContent } from './EyeReportContent';
import {
  COLOR_STAGE_COUNT,
  EYE_MODE_ORDER,
  READING_STAGE_COUNT,
  emptyYesNoAnswers,
  type EyeMode,
  type ScreenTimeOption,
  type YesNoAnswers,
  type YesNoKey,
} from './eyeTestData';

type Phase = 'pretest' | 'color' | 'readingSelect' | 'reading' | 'questions' | 'report';

type EyeScores = Record<EyeMode, number>;

const emptyEyeScores = (): EyeScores => ({ left: 0, right: 0, both: 0 });

export const EyeAssessment: React.FC = () => {
  const { t, apiUrl, language } = useThemeLanguage();
  const { token } = useAuth();
  const isTamil = language === 'ta';

  const [phase, setPhase] = useState<Phase>('pretest');
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);

  // Phase 1: Colour test (10 stages, 10s each)
  const [colorStage, setColorStage] = useState<number>(1);
  const [colorScore, setColorScore] = useState<number>(0);
  const [colorStagesPassed, setColorStagesPassed] = useState<number>(0);

  // Phase 2: Reading test — left, right and both, 5 stages each
  const [activeMode, setActiveMode] = useState<EyeMode>('left');
  const [readingStage, setReadingStage] = useState<number>(0);
  const [eyeScores, setEyeScores] = useState<EyeScores>(emptyEyeScores);

  // Phase 3: Questionnaire
  const [screenTime, setScreenTime] = useState<ScreenTimeOption | null>(null);
  const [answers, setAnswers] = useState<YesNoAnswers>(emptyYesNoAnswers);

  // Report & API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [report, setReport] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const reportPdfRef = useRef<HTMLDivElement>(null);

  const displayReport = useMemo(() => localizeReport(report, language), [report, language]);

  const handleColorStageComplete = (correct: boolean) => {
    if (correct) {
      setColorScore((prev) => prev + 10);
      setColorStagesPassed((prev) => prev + 1);
    }

    if (colorStage < COLOR_STAGE_COUNT) {
      setColorStage((prev) => prev + 1);
    } else {
      setPhase('readingSelect');
    }
  };

  const handleReadingAnswer = (canRead: boolean) => {
    const mode = activeMode;
    if (canRead) {
      setEyeScores((prev) => ({ ...prev, [mode]: prev[mode] + 1 }));
    }

    if (readingStage < READING_STAGE_COUNT - 1) {
      setReadingStage((prev) => prev + 1);
      return;
    }

    // Finished the current eye test — advance to the next one, or the questionnaire
    const nextModeIndex = EYE_MODE_ORDER.indexOf(mode) + 1;
    if (nextModeIndex < EYE_MODE_ORDER.length) {
      setActiveMode(EYE_MODE_ORDER[nextModeIndex]);
      setReadingStage(0);
    } else {
      setPhase('questions');
    }
  };

  const startReadingSequence = () => {
    setActiveMode(EYE_MODE_ORDER[0]);
    setReadingStage(0);
    setPhase('reading');
  };

  const handleAnswerChange = (key: YesNoKey, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const totalAcuityScore = eyeScores.left + eyeScores.right + eyeScores.both;

  const submitEyeAssessment = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const symptomCount = [
        answers.phoneAtNight,
        answers.eyeIrritation,
        answers.wateryEyes,
        answers.headache,
        answers.blurryVision,
      ].filter((v) => v === true).length;

      const payload = {
        colorStagesPassed,
        colorPoints: colorScore,
        acuityScore: totalAcuityScore,
        dryEyes: answers.eyeIrritation === true || answers.wateryEyes === true,
        havePower: false,
        powerType: 'none',
        screenTime,
        usingPhoneAtNight: answers.phoneAtNight === true,
        eyeIrritationDuringTest: answers.eyeIrritation === true,
        wateryEyesDuringTest: answers.wateryEyes === true,
        headacheAfterScreenUse: answers.headache === true,
        blurryVisionAfterProlongedUse: answers.blurryVision === true,
        symptomCount,
        leftEyeScore: eyeScores.left,
        rightEyeScore: eyeScores.right,
        bothEyesScore: eyeScores.both,
        language,
      };

      const res = await fetch(`${apiUrl}/api/eye/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.report) {
        setReport(data.report);
        setPhase('report');

        if (token) {
          fetch(`${apiUrl}/api/auth/add-result`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              type: 'eye',
              assessmentId: data.assessmentId || data.report.uniqueResultCode,
              score: data.report.overallScore,
              condition: data.report.colorStatus,
              uniqueResultCode: data.report.uniqueResultCode,
              reportTitle: data.report.title,
            }),
          }).catch((saveErr) => console.warn('Could not save eye result to profile:', saveErr));
        }

        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#65a30d', '#f59e0b', '#3b82f6'],
          });
        } catch {
          // ignore
        }
      } else {
        throw new Error(data.message || 'Eye analysis failed');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to generate eye report. Please check server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetEyeTest = () => {
    setPhase('pretest');
    setIsInstructionsOpen(false);
    setColorStage(1);
    setColorScore(0);
    setColorStagesPassed(0);
    setActiveMode('left');
    setReadingStage(0);
    setEyeScores(emptyEyeScores());
    setScreenTime(null);
    setAnswers(emptyYesNoAnswers());
    setReport(null);
    setErrorMsg(null);
  };

  const saveEyeReportPdf = async () => {
    if (!reportPdfRef.current || !displayReport) return;

    setIsSavingPdf(true);
    setErrorMsg(null);
    try {
      await downloadReportPdf(
        reportPdfRef.current,
        displayReport.uniqueResultCode || 'eye-assessment-report'
      );
    } catch (error) {
      console.error('Could not download eye report PDF:', error);
      setErrorMsg(t.pdfDownloadFailed);
    } finally {
      setIsSavingPdf(false);
    }
  };

  return (
    <div className="page-fit mx-auto w-full max-w-4xl">
      {/* Compact Header Banner */}
      <div className="page-fit-band mb-2 sm:mb-3 text-center">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-600 dark:text-lime-300 text-[11px] font-semibold mb-1">
          <Eye className="w-3 h-3" />
          <span>{t.eyeBanner}</span>
        </div>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          {t.eyeTitle}
        </h1>
        <p className="text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300 leading-snug">
          {t.eyeSubtitle}
        </p>
      </div>

      {errorMsg && (
        <div className="page-fit-band mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Active phase fills the remaining height */}
      <div className="page-fit-grow min-h-0 flex">
        {/* STEP 0: SAMPLE / PRE-TEST PAGE */}
        {phase === 'pretest' && <EyePreTest onStartTest={() => setIsInstructionsOpen(true)} />}

        {/* STEP 1: COLOUR TEST (10 stages x 10s) */}
        {phase === 'color' && (
          <ColorTest
            stage={colorStage}
            onStageComplete={handleColorStageComplete}
            onSkipAll={() => setPhase('readingSelect')}
          />
        )}

        {/* STEP 2A: READING TEST INTRO (showcase, runs left -> right -> both) */}
        {phase === 'readingSelect' && <EyeModeSelect scores={eyeScores} onStart={startReadingSequence} />}

        {/* STEP 2B: READING TEST FOR THE ACTIVE EYE MODE */}
        {phase === 'reading' && (
          <ReadingTest
            mode={activeMode}
            stageIndex={readingStage}
            correctCount={eyeScores[activeMode]}
            onAnswer={handleReadingAnswer}
            onQuit={() => {
              const nextModeIndex = EYE_MODE_ORDER.indexOf(activeMode) + 1;
              if (nextModeIndex < EYE_MODE_ORDER.length) {
                setActiveMode(EYE_MODE_ORDER[nextModeIndex]);
                setReadingStage(0);
              } else {
                setPhase('questions');
              }
            }}
          />
        )}

        {/* STEP 3: SYMPTOM QUESTIONNAIRE */}
        {phase === 'questions' && (
          <EyeSymptomForm
            screenTime={screenTime}
            onScreenTimeChange={setScreenTime}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            colorPassed={colorStagesPassed}
            leftScore={eyeScores.left}
            rightScore={eyeScores.right}
            bothScore={eyeScores.both}
            isSubmitting={isAnalyzing}
            onSubmit={submitEyeAssessment}
            onBack={() => {
              setActiveMode('both');
              setReadingStage(0);
              setPhase('reading');
            }}
          />
        )}

        {/* STEP 4: AI REPORT — a long document, so this region scrolls */}
        {phase === 'report' && displayReport && (
          <div className="page-fit-scroll w-full">
            <div
              ref={reportPdfRef}
              data-pdf-report
              className="bg-white dark:bg-[#121812] border border-lime-500/40 dark:border-amber-400/30 rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden"
            >
              <EyeReportContent report={displayReport} t={t} isTamil={isTamil} />

            {/* Actions */}
              <div
                data-pdf-ignore
                className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800"
              >
                <button
                  type="button"
                  onClick={resetEyeTest}
                  className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer touch-manipulation active:scale-[0.98]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.retakeTest}</span>
                </button>

                <button
                  type="button"
                  onClick={saveEyeReportPdf}
                  disabled={isSavingPdf}
                  className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-lime-600 to-amber-500 hover:from-lime-500 hover:to-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-lime-500/20 transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isSavingPdf ? t.savingPdf : t.savePdf}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* PRE-INSTRUCTIONS MODAL — opened from the pre-test page, OK opens colour test */}
      <PreInstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        onStart={() => {
          setIsInstructionsOpen(false);
          setColorStage(1);
          setPhase('color');
        }}
      />
    </div>
  );
};
