import React from 'react';
import type { ScoreBreakdown } from '../types';
import { Layers, Briefcase, FolderGit2, ShieldCheck, GraduationCap, Target } from 'lucide-react';

interface ScoreBreakdownCardProps {
  breakdown: ScoreBreakdown;
}

export const ScoreBreakdownCard: React.FC<ScoreBreakdownCardProps> = ({ breakdown }) => {
  const dimensions = [
    { key: 'skills', label: 'Skills Match', weight: '30%', icon: Layers, data: breakdown.skills, color: 'bg-indigo-600' },
    { key: 'experience', label: 'Experience Depth', weight: '20%', icon: Briefcase, data: breakdown.experience, color: 'bg-blue-600' },
    { key: 'projects', label: 'Project Quality', weight: '15%', icon: FolderGit2, data: breakdown.projects, color: 'bg-purple-600' },
    { key: 'ats', label: 'ATS Compatibility', weight: '15%', icon: ShieldCheck, data: breakdown.ats, color: 'bg-emerald-600' },
    { key: 'education', label: 'Education Signal', weight: '10%', icon: GraduationCap, data: breakdown.education, color: 'bg-amber-600' },
    { key: 'semantic_match', label: 'Semantic Role Match', weight: '10%', icon: Target, data: breakdown.semantic_match, color: 'bg-rose-600' },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900">Transparent Score Breakdown</h3>
        <span className="text-xs text-slate-500 font-mono">Weighted Formula (100%)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dimensions.map((dim) => {
          const Icon = dim.icon;
          const score = dim.data.score;
          const contrib = dim.data.contribution;

          return (
            <div key={dim.key} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-slate-800">
                  <Icon className="w-4 h-4 text-indigo-600" />
                  {dim.label}
                </span>
                <span className="text-slate-500 font-mono">
                  <strong className="text-slate-900 font-bold">{score}%</strong> (Weight: {dim.weight} ➔ +{contrib.toFixed(1)} pts)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${dim.color} transition-all duration-700`}
                  style={{ width: `${score}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-1 italic">{dim.data.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
