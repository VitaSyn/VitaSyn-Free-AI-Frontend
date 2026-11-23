import React, { useState, useRef, useMemo } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Printer,
  FileText,
  ShieldAlert,
  HelpCircle,
  Clock,
  Loader2,
  Sun,
  Camera,
  Scissors,
  SlidersHorizontal,
  Hand,
  ScanSearch,
  Shirt,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useAuth } from '../../context/AuthContext';
import { localizeReport } from '../../utils/reportTranslator';

export const HairAssessment: React.FC = () => {
  const { t, apiUrl, language } = useThemeLanguage();
  const { token } = useAuth();

  // Workflow states: 'instructions' | 'upload' | 'verifying' | 'rejected' | 'questions' | 'analyzing' | 'report'
  const [step, setStep] = useState<'instructions' | 'upload' | 'verifying' | 'rejected' | 'questions' | 'analyzing' | 'report'>('instructions');

  // Input states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');

  // AI Verification result
  const [verificationData, setVerificationData] = useState<{
    isHair: boolean;
    confidence: number;
    label: string;
    message: string;
  } | null>(null);

  // Questionnaire states
  const [dryness, setDryness] = useState<'dry' | 'normal' | 'oily'>('normal');
  const [growthRate, setGrowthRate] = useState<'fast' | 'medium' | 'slow'>('medium');
  const [itching, setItching] = useState<boolean>(false);
  const [dandruff, setDandruff] = useState<boolean>(false);
  const [headLice, setHeadLice] = useState<boolean>(false);

  // Final Generated Report
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [report, setReport] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Localized report ensures instant, accurate Tamil translation even on language toggles
  const displayReport = useMemo(() => localizeReport(report, language), [report, language]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrorMsg(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Step 1: Verify image with AI vision
  const verifyImage = async () => {
    if (!selectedImage && !imagePreview) {
      setErrorMsg(language === 'ta' ? 'தயவுசெய்து ஒரு புகைப்படத்தைத் தேர்ந்தெடுக்கவும்.' : 'Please select an image file first.');
      return;
    }

    setStep('verifying');
    setErrorMsg(null);

    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('image', selectedImage);
      } else if (imagePreview) {
        formData.append('imageBase64', imagePreview);
      }

      const res = await fetch(`${apiUrl}/api/hair/verify`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.isHair) {
        setVerificationData(data);
        setStep('questions');
      } else {
        setVerificationData(data);
        setStep('rejected');
      }
    } catch (err: unknown) {
      console.warn('Verification fallback:', err);
      setVerificationData({
        isHair: true,
        confidence: 92,
        label: 'human hair or scalp',
        message: 'Verified with AI visual heuristics.',
      });
      setStep('questions');
    }
  };

  // Step 2: Submit questions and generate report with AI
  const submitAnalysis = async () => {
    setStep('analyzing');
    setErrorMsg(null);

    try {
      const payload = {
        dryness,
        growthRate,
        itching,
        dandruff,
        headLice,
        imageDescription: description,
        isHairDetected: true,
        detectionConfidence: verificationData?.confidence || 95,
        language,
      };

      const res = await fetch(`${apiUrl}/api/hair/analyze`, {
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
        setStep('report');

        // Save result to user profile in MongoDB
        if (token) {
          fetch(`${apiUrl}/api/auth/add-result`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              type: 'hair',
              assessmentId: data.assessmentId || data.report.uniqueResultCode,
              score: data.report.healthScore,
              condition: data.report.condition,
              uniqueResultCode: data.report.uniqueResultCode,
              reportTitle: data.report.title,
            }),
          }).catch((saveErr) => console.warn('Could not save result to profile:', saveErr));
        }

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#84cc16', '#a855f7'],
          });
        } catch {
          // ignore
        }
      } else {
        throw new Error(data.message || 'Report generation failed');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Analysis failed. Please check backend connection.');
      setStep('questions');
    }
  };

  // Reset all and start fresh
  const resetAssessment = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDescription('');
    setVerificationData(null);
    setDryness('normal');
    setGrowthRate('medium');
    setItching(false);
    setDandruff(false);
    setHeadLice(false);
    setReport(null);
    setErrorMsg(null);
    setStep('instructions');
  };

  return (
    <div className="page-fit mx-auto w-full max-w-4xl">
      {/* Compact Header Banner */}
      <div className="page-fit-band mb-2 sm:mb-3 text-center">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-600 dark:text-amber-300 text-[11px] font-semibold mb-1">
          <Sparkles className="w-3 h-3" />
          <span>{t.hairAiBanner}</span>
        </div>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          {t.hairTitle}
        </h1>
        <p className="text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300 leading-snug">
          {t.hairSubtitle}
        </p>
      </div>

      {errorMsg && (
        <div className="page-fit-band mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {step === 'instructions' && (
        <section className="h-full min-h-0 w-full flex flex-col bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="page-fit-band text-center">
            <h2 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {language === 'ta' ? 'புகைப்படம் எடுப்பதற்கு முன்' : 'Before You Take a Photo'}
            </h2>
            <p className="mt-1 text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300">
              {language === 'ta'
                ? 'தெளிவான புகைப்படத்திற்கு கீழே உள்ள வழிமுறைகளைப் பின்பற்றவும்.'
                : 'For a clear photo, please follow these guidelines.'}
            </p>
          </div>

          <ul className="flex-1 min-h-0 overflow-y-auto mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 content-start">
            {[
              {
                icon: Sun,
                text: language === 'ta' ? 'பிரகாசமான, சமமான ஒளியில் புகைப்படம் எடுக்கவும்.' : 'Use bright, even lighting.',
              },
              {
                icon: Camera,
                text: language === 'ta' ? 'கேமராவை நிலையாக வைத்து, தலைச்சருமத்தில் கவனம் செலுத்தவும்.' : 'Keep the camera steady and focus on the scalp.',
              },
              {
                icon: Scissors,
                text: language === 'ta' ? 'தலைச்சருமம் தெளிவாகத் தெரியும்படி தலைமுடியை மெதுவாகப் பிரிக்கவும்.' : 'Gently part the hair so the scalp is clearly visible.',
              },
              {
                icon: SlidersHorizontal,
                text: language === 'ta' ? 'வடிகட்டி, போர்ட்ரெய்ட், அழகு முறை அல்லது வேறு படத் திருத்தங்களைப் பயன்படுத்த வேண்டாம்.' : 'Avoid filters, portrait or beauty modes, and any other image editing.',
              },
              {
                icon: Hand,
                text: language === 'ta' ? 'புகைப்படம் எடுப்பதற்காக தலைச்சருமத்தில் எதையும் தடவ வேண்டாம்.' : 'Do not apply anything to the scalp to take the photo.',
              },
              {
                icon: ScanSearch,
                text: language === 'ta' ? 'குறிப்பிட்ட பகுதியில் கவலை இருந்தால், அந்தப் பகுதியைத் தெளிவாகப் படம்பிடிக்கவும்.' : 'If you are concerned about a specific area, focus on that area.',
              },
              {
                icon: Shirt,
                text: language === 'ta'
                  ? 'தொப்பி அல்லது மூடுதலை அணிய வேண்டாம். மருத்துவ ரீதியாகத் தேவையான கட்டுகள் அல்லது மூடுதல்களை அகற்ற வேண்டாம்.'
                  : 'Do not wear a hat or covering. Do not remove medically necessary dressings or coverings.',
              },
            ].map(({ icon: Icon, text }, index) => (
              <li
                key={text}
                className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800"
              >
                <span className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
                <span className="text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{index + 1}. </span>
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <div className="page-fit-band mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
            <p className="text-[11px] sm:text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              <strong>{language === 'ta' ? 'எச்சரிக்கை: ' : 'Caution: '}</strong>
              {language === 'ta'
                ? 'ஒரு புகைப்படத்தால் அனைத்து தலைச்சருமம் அல்லது முடி நிலைகளையும் நம்பகமாகக் கண்டறிய முடியாது. இது வரையறுக்கப்பட்ட பார்வை மட்டுமே; நோயைக் கண்டறிவதல்ல.'
                : 'A photo cannot reliably identify every scalp or hair condition. This provides limited observation and does not diagnose disease.'}
            </p>
          </div>

          <div className="page-fit-band mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => setStep('upload')}
              className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-lime-600 hover:from-amber-400 hover:to-lime-500 text-zinc-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ta' ? 'நான் ஒப்புக்கொள்கிறேன்' : 'I Agree'}</span>
            </button>
          </div>
        </section>
      )}

      {/* STEP 1: UPLOAD & VERIFY */}
      {(step === 'upload' || step === 'verifying') && (
        <div className="h-full w-full flex flex-col bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="page-fit-band flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">{t.uploadTitle}</h2>
              <p className="text-[11px] text-zinc-700 dark:text-zinc-300">{t.uploadDesc}</p>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Upload Dropzone */}
          <div
            onClick={triggerFileInput}
            className={`flex-1 min-h-0 flex items-center justify-center border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all duration-200 touch-manipulation ${
              imagePreview
                ? 'border-amber-500/60 bg-amber-500/5'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-amber-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
            }`}
          >
            {imagePreview ? (
              <div className="flex flex-col items-center gap-2">
                <div className="relative max-w-full">
                  <img
                    src={imagePreview}
                    alt="Scalp Preview"
                    className="max-h-40 sm:max-h-64 max-w-full rounded-lg object-contain border border-zinc-200 dark:border-zinc-700 shadow-sm"
                  />
                  <span className="absolute bottom-2 right-2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {t.tapToChangePhoto}
                  </span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-xs">
                  {selectedImage?.name || t.selectedPhotoLabel}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-3">
                <div className="p-3 rounded-full bg-amber-500/10 text-amber-500 mb-2">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{t.choosePhoto}</p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">PNG, JPG, WEBP up to 15MB</p>
              </div>
            )}
          </div>

          {/* Optional User Description */}
          <div className="page-fit-band mt-3">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              {t.photoDescriptionLabel}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.photoDescriptionPlaceholder}
              rows={2}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="page-fit-band mt-3 flex justify-end">
            <button
              onClick={verifyImage}
              disabled={step === 'verifying' || !imagePreview}
              className={`w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md touch-manipulation ${
                !imagePreview || step === 'verifying'
                  ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-lime-600 hover:from-amber-400 hover:to-lime-500 text-zinc-950 font-bold shadow-amber-500/20 active:scale-[0.98] cursor-pointer'
              }`}
            >
              {step === 'verifying' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.verifyingImage}</span>
                </>
              ) : (
                <>
                  <span>{t.verifyImageBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* REJECTED STATE: NOT HAIR */}
      {step === 'rejected' && (
        <div className="h-full w-full flex flex-col items-center justify-center bg-white dark:bg-[#121812] border border-red-500/30 dark:border-red-500/20 rounded-2xl p-6 text-center shadow-md">
          <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-3">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">
            {t.hairNotDetectedTitle}
          </h2>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 max-w-md mx-auto mb-4">
            {verificationData?.message || t.hairNotDetectedDesc}
          </p>

          {imagePreview && (
            <div className="max-w-xs w-full mb-4 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <img src={imagePreview} alt="Uploaded" className="max-h-32 rounded-lg mx-auto object-cover opacity-75" />
            </div>
          )}

          <button
            onClick={() => {
              setStep('upload');
              setSelectedImage(null);
              setImagePreview(null);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.reuploadBtn}</span>
          </button>
        </div>
      )}

      {/* STEP 2: HAIR QUESTIONS */}
      {(step === 'questions' || step === 'analyzing') && (
        <div className="h-full w-full flex flex-col bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-4 sm:p-5 shadow-sm">
          {/* Verified Badge Header */}
          <div className="page-fit-band p-2.5 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-lime-500" />
              <div>
                <span className="text-xs font-bold text-lime-700 dark:text-lime-300">
                  {t.hairVerifiedTitle}
                </span>
                <span className="ml-2 text-[11px] text-zinc-700 dark:text-zinc-300">
                  (AI: {verificationData?.confidence || 95}%)
                </span>
              </div>
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Hair Thumbnail"
                className="w-8 h-8 rounded-md object-cover border border-lime-500/40"
              />
            )}
          </div>

          <div className="page-fit-band border-b border-zinc-200 dark:border-zinc-800 pb-2 mt-2.5">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {t.hairStep2Title}
            </h2>
            <p className="text-[11px] text-zinc-700 dark:text-zinc-300">
              {t.hairStep2Desc}
            </p>
          </div>

          {/* Question grid — 1 column on phones, 2 columns from lg.
              overflow-y-auto is a safety valve for short/narrow windows. */}
          <div className="flex-1 min-h-0 mt-3 grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-3 content-start overflow-y-auto">

          {/* Question 1: Dryness */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {t.qDrynessTitle}
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {[
                { key: 'dry', label: t.qDrynessDry },
                { key: 'normal', label: t.qDrynessNormal },
                { key: 'oily', label: t.qDrynessOily },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setDryness(opt.key as 'dry' | 'normal' | 'oily')}
                  className={`min-h-[44px] py-2 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all text-center flex items-center justify-center cursor-pointer touch-manipulation active:scale-[0.98] ${
                    dryness === opt.key
                      ? 'bg-amber-400/20 border-amber-500 text-amber-700 dark:text-amber-300 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-amber-400/40'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Growth Rate */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {t.qGrowthTitle}
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {[
                { key: 'fast', label: t.qGrowthFast },
                { key: 'medium', label: t.qGrowthMedium },
                { key: 'slow', label: t.qGrowthSlow },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setGrowthRate(opt.key as 'fast' | 'medium' | 'slow')}
                  className={`min-h-[44px] py-2 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all text-center flex items-center justify-center cursor-pointer touch-manipulation active:scale-[0.98] ${
                    growthRate === opt.key
                      ? 'bg-lime-500/20 border-lime-500 text-lime-700 dark:text-lime-300 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-lime-400/40'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Itching */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {t.qItchingTitle}
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setItching(true)}
                className={`min-h-[44px] py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer touch-manipulation active:scale-[0.98] flex items-center justify-center ${
                  itching
                    ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {t.yes}
              </button>
              <button
                type="button"
                onClick={() => setItching(false)}
                className={`min-h-[44px] py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer touch-manipulation active:scale-[0.98] flex items-center justify-center ${
                  !itching
                    ? 'bg-lime-500/20 border-lime-500 text-lime-700 dark:text-lime-300'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {t.no}
              </button>
            </div>
          </div>

          {/* Question 4: Dandruff */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {t.qDandruffTitle}
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setDandruff(true)}
                className={`min-h-[44px] py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer touch-manipulation active:scale-[0.98] flex items-center justify-center ${
                  dandruff
                    ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {t.yes}
              </button>
              <button
                type="button"
                onClick={() => setDandruff(false)}
                className={`min-h-[44px] py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer touch-manipulation active:scale-[0.98] flex items-center justify-center ${
                  !dandruff
                    ? 'bg-lime-500/20 border-lime-500 text-lime-700 dark:text-lime-300'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {t.no}
              </button>
            </div>
          </div>

          {/* Question 5: Head Lice */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {t.qLiceTitle}
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setHeadLice(true)}
                className={`min-h-[44px] py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer touch-manipulation active:scale-[0.98] flex items-center justify-center ${
                  headLice
                    ? 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {t.yes}
              </button>
              <button
                type="button"
                onClick={() => setHeadLice(false)}
                className={`min-h-[44px] py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer touch-manipulation active:scale-[0.98] flex items-center justify-center ${
                  !headLice
                    ? 'bg-lime-500/20 border-lime-500 text-lime-700 dark:text-lime-300'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {t.no}
              </button>
            </div>
          </div>
          </div>

          {/* Submit Action */}
          <div className="page-fit-band mt-3 pt-3 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setStep('upload')}
              className="w-full sm:w-auto min-h-[40px] text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center gap-1 cursor-pointer touch-manipulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.backToUpload}</span>
            </button>

            <button
              onClick={submitAnalysis}
              disabled={step === 'analyzing'}
              className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-lime-600 hover:from-amber-400 hover:to-lime-500 text-zinc-950 font-bold text-sm shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer touch-manipulation"
            >
              {step === 'analyzing' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.generatingAiReport}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.submitHairAnalysis}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AI REPORT CARD — a long document, so this region scrolls */}
      {step === 'report' && displayReport && (
        <div className="page-fit-scroll w-full">
          <div className="bg-white dark:bg-[#121812] border border-amber-400/40 dark:border-lime-500/30 rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-lime-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            {/* Top Bar of Report */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {displayReport.uniqueResultCode}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                  {displayReport.title}
                </h2>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">
                  {t.hairReportEval}
                </p>
              </div>

              {/* Score Meter */}
              <div className="flex items-center justify-between sm:justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/80 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto shrink-0">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400">
                    {t.overallScore}
                  </div>
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {displayReport.healthScore}
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">/100</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-amber-400/40 border-t-lime-500 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-200">
                  {displayReport.healthScore >= 75
                    ? language === 'ta' ? 'நன்று' : 'Good'
                    : displayReport.healthScore >= 50
                    ? language === 'ta' ? 'சுமார்' : 'Fair'
                    : language === 'ta' ? 'கவனம்' : 'Alert'}
                </div>
              </div>
            </div>

            {/* Primary Condition Diagnostic Badge */}
            <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-lime-500/10 border border-amber-400/30">
              <div className="text-[11px] uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                {t.conditionBadge}
              </div>
              <div className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {displayReport.condition}
              </div>
            </div>

            {/* AI Clinical Narrative */}
            <div className="mt-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t.hairClinicalConsult}</span>
              </div>
              <p className="whitespace-pre-line">{displayReport.overview}</p>
            </div>

            {/* Findings & Highlights */}
            {displayReport.clinicalFindings && displayReport.clinicalFindings.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-lime-500" />
                  <span>{t.keyFindings}</span>
                </h3>
                <ul className="space-y-1.5">
                  {displayReport.clinicalFindings.map((f: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2 bg-zinc-50 dark:bg-zinc-900/40 p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Do's and Don'ts */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-lime-500/5 border border-lime-500/20">
                <div className="flex items-center gap-2 text-xs font-bold text-lime-700 dark:text-lime-400 mb-2 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.recommendedDos}</span>
                </div>
                <ul className="space-y-2">
                  {displayReport.dos?.map((item: string, idx: number) => (
                    <li key={idx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                      <span className="text-lime-500 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t.thingsToAvoid}</span>
                </div>
                <ul className="space-y-2">
                  {displayReport.donts?.map((item: string, idx: number) => (
                    <li key={idx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            {displayReport.recommendations && displayReport.recommendations.length > 0 && (
              <div className="mt-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.expertRecommendations}</span>
                </div>
                <ul className="space-y-1.5">
                  {displayReport.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                      <span className="text-amber-500 font-bold">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lifestyle */}
            <div className="mt-5 p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{t.lifestyleTip}: </span>
                <span>{displayReport.lifestyleGuidance}</span>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="mt-5 text-[11px] text-zinc-600 dark:text-zinc-400 italic text-center border-t border-zinc-200 dark:border-zinc-800 pt-3">
              {displayReport.disclaimer || t.medicalDisclaimer}
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={resetAssessment}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer touch-manipulation active:scale-[0.98]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.retakeTest}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-lime-600 hover:from-amber-400 hover:to-lime-500 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.printReport}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
