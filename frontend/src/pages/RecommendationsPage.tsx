import React, { useState } from 'react';
import type { AnalysisResponse } from '../types';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface RecommendationsPageProps {
  analysisResult: AnalysisResponse | null;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ analysisResult }) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  if (!analysisResult) {
    return (
      <div className="py-20 text-center text-slate-500">
        Please run an analysis first to view personalized recommendations.
      </div>
    );
  }

  const { recommendations, candidate_info } = analysisResult;

  const filteredRecs = recommendations.filter((r) => {
    if (priorityFilter !== 'ALL' && r.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Personalized Action Roadmap</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Role-Specific Profile Recommendations</h1>
          <p className="text-xs text-slate-500">Target Role: <strong className="text-slate-800 font-bold">{candidate_info.target_role}</strong> • Generated {recommendations.length} Action Items</p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 text-xs">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                priorityFilter === p
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-6">
        {filteredRecs.map((rec) => {
          let priorityBadge = 'bg-rose-50 text-rose-700 border-rose-200';
          let icon = <AlertOctagon className="w-4 h-4 text-rose-600" />;

          if (rec.priority === 'MEDIUM') {
            priorityBadge = 'bg-amber-50 text-amber-800 border-amber-200';
            icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
          } else if (rec.priority === 'LOW') {
            priorityBadge = 'bg-blue-50 text-blue-800 border-blue-200';
            icon = <Info className="w-4 h-4 text-blue-600" />;
          }

          return (
            <div key={rec.id} className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  {icon}
                  <h3 className="text-base font-bold text-slate-900">{rec.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-semibold border border-slate-200">
                    {rec.category}
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-extrabold ${priorityBadge}`}>
                    {rec.priority} PRIORITY
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Problem */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identified Gap / Problem</span>
                  <p className="text-slate-800 font-medium">{rec.problem}</p>
                </div>

                {/* Why it Matters */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Why it Matters</span>
                  <p className="text-slate-800 font-medium">{rec.why_it_matters}</p>
                </div>

              </div>

              {/* Actionable Step & Expected Impact */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Recommended Action
                  </span>
                  <p className="text-slate-900 font-semibold">{rec.recommended_action}</p>
                </div>
                <div className="px-3.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold whitespace-nowrap shadow-xs">
                  Impact: {rec.expected_impact}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
