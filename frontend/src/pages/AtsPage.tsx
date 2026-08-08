import React from 'react';
import type { AnalysisResponse } from '../types';
import { CheckCircle2, AlertTriangle, FileText, Info, ArrowRight } from 'lucide-react';

interface AtsPageProps {
  analysisResult: AnalysisResponse | null;
}

export const AtsPage: React.FC<AtsPageProps> = ({ analysisResult }) => {
  if (!analysisResult) {
    return (
      <div className="py-20 text-center text-slate-500">
        Please run an analysis first to inspect ATS optimizer scores.
      </div>
    );
  }

  const { ats_analysis } = analysisResult;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Banner Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">ATS Resume Optimizer</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">ATS Compatibility Score: {ats_analysis.ats_score}%</h1>
          <p className="text-xs text-slate-500">Evaluates section structure, keyword density, and action-oriented bullet phrasing.</p>
        </div>

        <div className="px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
          <span className="text-2xl font-extrabold text-emerald-700">{ats_analysis.ats_score}%</span>
          <p className="text-[10px] text-emerald-800 uppercase font-bold">ATS Compatibility</p>
        </div>
      </div>

      {/* Ethical Guidance Alert */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center gap-3 font-medium">
        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0" />
        <p>
          <strong>Ethical ATS Optimization Notice:</strong> SMARRTIF AI never encourages keyword stuffing or inserting skills you do not possess. Always back every keyword with concrete project or work experience evidence.
        </p>
      </div>

      {/* Section Checks & Keyword Coverage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Standard Section Compliance */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            Standard Section Heading Compliance
          </h3>

          <div className="space-y-2">
            {Object.entries(ats_analysis.section_checks).map(([sec, found]) => (
              <div key={sec} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 capitalize">{sec} Section</span>
                {found ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Present
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Heading Missing
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Matched Keywords Grid */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-200 bg-white space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Matched ATS Keywords ({ats_analysis.matched_keywords.length})
          </h3>

          <div className="flex flex-wrap gap-2">
            {ats_analysis.matched_keywords.map((kw) => (
              <span key={kw} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Missing Keywords & Suggestions */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-200 bg-white space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Missing ATS Keywords ({ats_analysis.missing_keywords.length})
        </h3>

        <div className="flex flex-wrap gap-2">
          {ats_analysis.missing_keywords.map((kw) => (
            <span key={kw} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
              ⚠ {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Actionable ATS Bullet Recommendations */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">ATS Recommendations</h3>
        <div className="space-y-2">
          {ats_analysis.recommendations.map((rec, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              {rec}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
