import React from 'react';
import type { ProjectAnalysisItem, ATSWeakPhrase } from '../types';
import { AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface BulletRewriterCardProps {
  projectAnalysis?: ProjectAnalysisItem[];
  atsWeakPhrases?: ATSWeakPhrase[];
}

export const BulletRewriterCard: React.FC<BulletRewriterCardProps> = ({ projectAnalysis = [] }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Resume Bullet Optimizer
          </h3>
          <p className="text-xs text-slate-500">Replaces passive phrasing with high-impact quantified achievements</p>
        </div>
      </div>

      <div className="space-y-4">
        {projectAnalysis.map((proj, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{proj.title}</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                Complexity: {proj.complexity_score}%
              </span>
            </div>

            {/* Before / Weak */}
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" /> Current Phrasing / Weak Signal
              </span>
              <p className="text-xs text-rose-900 font-medium">{proj.feedback}</p>
            </div>

            {/* After / Improved */}
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Recommended Quantified Bullet
              </span>
              <p className="text-xs text-emerald-950 font-mono font-semibold">{proj.improved_bullet_suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
