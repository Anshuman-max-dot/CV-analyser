import React, { useState } from 'react';
import type { ScoreBreakdown } from '../types';
import { ChevronDown, ChevronUp, HelpCircle, CheckCircle2 } from 'lucide-react';

interface ExplainableDrawerProps {
  breakdown: ScoreBreakdown;
  overallScore: number;
}

export const ExplainableDrawer: React.FC<ExplainableDrawerProps> = ({ breakdown, overallScore }) => {
  const [isOpen, setIsOpen] = useState(true);

  const sections = [
    { name: 'Skills', data: breakdown.skills, maxContrib: 30 },
    { name: 'Experience', data: breakdown.experience, maxContrib: 20 },
    { name: 'Projects', data: breakdown.projects, maxContrib: 15 },
    { name: 'ATS Compatibility', data: breakdown.ats, maxContrib: 15 },
    { name: 'Education', data: breakdown.education, maxContrib: 10 },
    { name: 'Semantic Role Match', data: breakdown.semantic_match, maxContrib: 10 },
  ];

  return (
    <div className="glass-panel rounded-2xl border border-indigo-200 bg-white overflow-hidden shadow-sm">
      {/* Header button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-indigo-50/70 hover:bg-indigo-50 transition-colors border-b border-indigo-100"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">Why did I receive this score?</h3>
            <p className="text-xs text-indigo-700 font-medium">Click to view full mathematical calculation & empirical evidence</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
          <span>Overall: {overallScore}/100</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-6 space-y-6 bg-slate-50/50">
          
          {/* Formula Callout */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-indigo-800 uppercase tracking-wider text-[11px]">Explicit Scoring Formula:</p>
            <p className="font-mono text-slate-900 font-semibold text-[12px]">{breakdown.formula_expression}</p>
          </div>

          {/* Breakdown Sections */}
          <div className="space-y-4">
            {sections.map((sec) => (
              <div key={sec.name} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    {sec.name} — <span className="text-indigo-700">{sec.data.contribution.toFixed(1)} / {sec.maxContrib} pts</span>
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-medium border border-slate-200">
                    Score: {sec.data.score}% × {Math.round(sec.data.weight * 100)}% weight
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">{sec.data.explanation}</p>

                {/* Evidence List */}
                {sec.data.evidence && sec.data.evidence.length > 0 && (
                  <div className="mt-2 pl-4 border-l-2 border-indigo-500 space-y-1">
                    <p className="text-[11px] text-slate-400 font-bold uppercase">Evidence Found in CV:</p>
                    {sec.data.evidence.map((ev, i) => (
                      <p key={i} className="text-[11px] text-slate-700 font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        {ev}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};
