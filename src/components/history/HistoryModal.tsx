import React, { useEffect, useRef, useState } from 'react';
import {
  History,
  Sparkles,
  Eye,
  Calendar,
  ArrowRight,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Download,
  FileText,
} from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useAuth } from '../../context/AuthContext';
import { localizeReport } from '../../utils/reportTranslator';
import { downloadReportPdf } from '../../utils/downloadReportPdf';

interface AssessmentRecord {
  _id: string;
  type: 'hair' | 'eye';
  scores: {
    overallScore: number;
    status: string;
    uniqueResultCode?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generatedReport: any;
  language: string;
  createdAt: string;
}

interface HistoryModalProps {
  onSelectAssessment?: (assessment: AssessmentRecord) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = () => {
  const { t, apiUrl, language } = useThemeLanguage();
  const { token } = useAuth();
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);
  const [filter, setFilter] = useState<'all' | 'hair' | 'eye'>('all');
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const reportPdfRef = useRef<HTMLDivElement>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      // First try to fetch from /api/history
      const res = await fetch(`${apiUrl}/api/history`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRecords(data.data);
      }
    } catch (err) {
      console.warn('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [apiUrl, token]);

  const filteredRecords = records.filter((r) => {
    if (filter === 'all') return true;
    return r.type === filter;
  });

  const selectedModalReport = selectedRecord
    ? localizeReport(selectedRecord.generatedReport, language)
    : null;

  const saveSelectedReportPdf = async () => {
    if (!selectedRecord || !reportPdfRef.current) return;

    setIsSavingPdf(true);
    setPdfError('');
    try {
      await downloadReportPdf(
        reportPdfRef.current,
        selectedRecord.scores.uniqueResultCode || `${selectedRecord.type}-assessment-report`
      );
    } catch (error) {
      console.error('Could not download saved report PDF:', error);
      setPdfError(t.pdfDownloadFailed);
    } finally {
      setIsSavingPdf(false);
    }
  };

  return (
    <div className="page-fit mx-auto w-full max-w-4xl">
      {/* Header */}
      <div className="page-fit-band flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{t.historyTitle}</span>
          </h1>
          <p className="text-[11px] text-zinc-700 dark:text-zinc-300 mt-0.5">
            {t.historyDbSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Filter Pills */}
          <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
            {(['all', 'hair', 'eye'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`min-h-[34px] px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer touch-manipulation ${
                  filter === f
                    ? 'bg-amber-400/20 text-amber-700 dark:text-amber-300 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {f === 'all' ? t.allFilter : f === 'hair' ? t.navHair : t.navEye}
              </button>
            ))}
          </div>

          <button
            onClick={fetchRecords}
            className="min-h-[34px] min-w-[34px] flex items-center justify-center p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer touch-manipulation"
            title="Refresh"
            aria-label="Refresh records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Records list — the only scrollable region on this page */}
      <div className="page-fit-scroll">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-amber-500" />
            <p className="text-xs">
              {language === 'ta' ? 'பதிவுகள் ஏற்றப்படுகின்றன...' : 'Loading assessment records...'}
            </p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="h-full flex items-center justify-center p-6 text-center bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl">
            <div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <History className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{t.noHistory}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          {filteredRecords.map((item) => {
            const itemReport = localizeReport(item.generatedReport, language);
            const displayTitle = itemReport?.title || item.scores.status;
            const displayOverview =
              itemReport?.overview ||
              (language === 'ta' ? 'AI மருத்துவ ஆலோசனை நிறைவடைந்தது' : 'Completed AI clinical consultation');

            return (
              <div
                key={item._id}
                onClick={() => {
                  setSelectedRecord(item);
                  setPdfError('');
                }}
                className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#121812] border border-zinc-200 dark:border-zinc-800 hover:border-amber-400/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between touch-manipulation active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        item.type === 'hair'
                          ? 'bg-amber-400/20 text-amber-700 dark:text-amber-300'
                          : 'bg-lime-500/20 text-lime-700 dark:text-lime-300'
                      }`}
                    >
                      {item.type === 'hair' ? (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>{t.navHair}</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>{t.navEye}</span>
                        </>
                      )}
                    </span>

                    <span className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {displayTitle}
                  </h3>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1 line-clamp-2">
                    {displayOverview}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t.scoreLabel}:{' '}
                    <span
                      className={
                        item.type === 'hair'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-lime-600 dark:text-lime-400'
                      }
                    >
                      {item.scores.overallScore}/100
                    </span>
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                    <span>{t.viewLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4">
          <div ref={reportPdfRef} data-pdf-report className="bg-white dark:bg-[#121812] border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[92dvh] sm:max-h-[88vh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div>
                <span className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400">
                  {selectedRecord.scores.uniqueResultCode || selectedRecord.type.toUpperCase()}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedModalReport?.title || selectedRecord.generatedReport?.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                data-pdf-ignore
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 text-sm font-bold p-2 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 touch-manipulation"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Score & Status banner */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-xs text-zinc-500 uppercase font-semibold">{t.overallScore}:</span>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {selectedRecord.scores.overallScore}/100
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-500 uppercase font-semibold">
                  {selectedRecord.type === 'hair' ? t.conditionBadge : t.eyeColorRating}:
                </span>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedModalReport?.condition || selectedModalReport?.colorStatus || selectedRecord.scores.status}
                </div>
              </div>
            </div>

            {/* Clinical Overview */}
            {selectedModalReport?.overview && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800">
                <div className="font-bold text-xs uppercase text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{selectedRecord.type === 'hair' ? t.hairClinicalConsult : t.eyeClinicalConsult}</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {selectedModalReport.overview}
                </p>
              </div>
            )}

            {/* Clinical Findings */}
            {selectedModalReport?.clinicalFindings && selectedModalReport.clinicalFindings.length > 0 && (
              <div>
                <div className="font-bold text-xs uppercase text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-lime-500" />
                  <span>{t.keyFindings}:</span>
                </div>
                <ul className="space-y-1.5">
                  {selectedModalReport.clinicalFindings.map((f: string, i: number) => (
                    <li
                      key={i}
                      className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2 bg-zinc-50 dark:bg-zinc-900/40 p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dos and Donts */}
            {((selectedModalReport?.dos && selectedModalReport.dos.length > 0) ||
              (selectedModalReport?.donts && selectedModalReport.donts.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {selectedModalReport.dos && selectedModalReport.dos.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-lime-500/5 border border-lime-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-lime-700 dark:text-lime-400 mb-2 uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.recommendedDos}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {selectedModalReport.dos.map((item: string, idx: number) => (
                        <li key={idx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                          <span className="text-lime-500 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedModalReport?.donts && selectedModalReport.donts.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 uppercase">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t.thingsToAvoid}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {selectedModalReport.donts.map((item: string, idx: number) => (
                        <li key={idx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                          <span className="text-amber-500 font-bold">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {selectedModalReport?.recommendations && selectedModalReport.recommendations.length > 0 && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.expertRecommendations}</span>
                </div>
                <ul className="space-y-1.5">
                  {selectedModalReport.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                      <span className="text-amber-500 font-bold">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lifestyle */}
            {selectedModalReport?.lifestyleGuidance && (
              <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{t.lifestyleTip}: </span>
                  <span>{selectedModalReport.lifestyleGuidance}</span>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            {selectedModalReport?.disclaimer && (
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 italic pt-2 border-t border-zinc-200 dark:border-zinc-800 text-center">
                {selectedModalReport.disclaimer}
              </p>
            )}

            {/* Modal Actions */}
            {pdfError && <p role="alert" className="text-sm text-red-700">{pdfError}</p>}
            <div data-pdf-ignore className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                onClick={saveSelectedReportPdf}
                disabled={isSavingPdf}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 font-semibold text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-[0.98] disabled:opacity-60"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isSavingPdf ? t.savingPdf : t.savePdf}</span>
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                data-pdf-ignore
                className="w-full sm:w-auto min-h-[44px] px-5 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 font-bold text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer touch-manipulation active:scale-[0.98] flex items-center justify-center"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
