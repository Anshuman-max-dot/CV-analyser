import React from 'react';

interface ScoreGaugeProps {
  score: number;
  statusLabel: string;
  targetRole: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, statusLabel, targetRole }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'text-emerald-500';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (score < 68) {
    colorClass = 'text-amber-500';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (score < 78) {
    colorClass = 'text-blue-500';
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl border border-slate-200/80 bg-white relative overflow-hidden shadow-xs">
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="text-slate-100"
            strokeWidth="12"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Animated score circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{Math.round(score)}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">/ 100 SCORE</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className={`inline-block px-3.5 py-1 text-xs font-bold rounded-full border ${badgeColor}`}>
          {statusLabel}
        </span>
        <p className="text-xs text-slate-500 mt-2 font-medium">Target Role: <span className="text-slate-800 font-semibold">{targetRole}</span></p>
      </div>
    </div>
  );
};
