import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { AnalysisResponse } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { ScoreBreakdownCard } from '../components/ScoreBreakdownCard';
import { ExplainableDrawer } from '../components/ExplainableDrawer';
import { BulletRewriterCard } from '../components/BulletRewriterCard';
import { CheckCircle2, AlertTriangle, Layers, ShieldCheck, FileText, Code2 } from 'lucide-react';

interface DashboardPageProps {
  analysisResult: AnalysisResponse | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ analysisResult }) => {
  const navigate = useNavigate();

  if (!analysisResult) {
    return (
      <div className="py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mx-auto shadow-xs">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">No Active Profile Analysis Found</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Run an analysis or load the demo candidate profile to view executive scores and explainable breakdowns.
        </p>
        <button
          onClick={() => navigate('/analyze')}
          className="px-6 py-3 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-md shadow-indigo-500/20"
        >
          Go to Analysis Setup
        </button>
      </div>
    );
  }

  const { overall_score, status_label, candidate_info, breakdown, skills_analysis, ats_analysis, project_analysis } = analysisResult;
  const topStrengths = skills_analysis.matched_skills.slice(0, 6);
  const criticalGaps = skills_analysis.missing_skills.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Banner Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Candidate Executive Report</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">{candidate_info.name || 'Alex Mercer'}</h1>
          <p className="text-xs text-slate-500">Target Role: <strong className="text-slate-800 font-bold">{candidate_info.target_role}</strong> • Evaluated on {new Date(analysisResult.timestamp).toLocaleDateString()}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/recommendations')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <FileText className="w-4 h-4" /> View Action Plan
          </button>
        </div>
      </div>

      {/* Top Grid: Gauge + Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ScoreGauge
          score={overall_score}
          statusLabel={status_label}
          targetRole={candidate_info.target_role}
        />
        <div className="lg:col-span-2">
          <ScoreBreakdownCard breakdown={breakdown} />
        </div>
      </div>

      {/* Strengths & Gaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Strengths Card */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-200 bg-white space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              TOP STRENGTHS ({topStrengths.length})
            </h3>
            <button onClick={() => navigate('/skills')} className="text-xs text-indigo-600 hover:underline font-bold">
              View Skills Matrix
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {topStrengths.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skill Gaps Card */}
        <div className="glass-panel p-6 rounded-2xl border border-amber-200 bg-white space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              CRITICAL SKILL GAPS ({criticalGaps.length})
            </h3>
            <button onClick={() => navigate('/skills')} className="text-xs text-amber-700 hover:underline font-bold">
              View Gap Analysis
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {criticalGaps.length > 0 ? (
              criticalGaps.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No missing core role skills detected!</p>
            )}
          </div>
        </div>

      </div>

      {/* Expandable Explainable Score Drawer */}
      <ExplainableDrawer breakdown={breakdown} overallScore={overall_score} />

      {/* Resume Bullet Point Rewriter */}
      <BulletRewriterCard projectAnalysis={project_analysis} atsWeakPhrases={ats_analysis.weak_phrases} />

      {/* Navigation Quick Links Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/skills')}
          className="glass-panel glass-panel-hover p-4 rounded-xl text-left border border-slate-200 bg-white space-y-2"
        >
          <Layers className="w-5 h-5 text-indigo-600" />
          <h4 className="text-xs font-bold text-slate-900">Skills Gap Analysis</h4>
          <p className="text-[11px] text-slate-500">Match % vs target taxonomy</p>
        </button>

        <button
          onClick={() => navigate('/ats')}
          className="glass-panel glass-panel-hover p-4 rounded-xl text-left border border-slate-200 bg-white space-y-2"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h4 className="text-xs font-bold text-slate-900">ATS Optimizer</h4>
          <p className="text-[11px] text-slate-500">Matched/missing keywords</p>
        </button>

        <button
          onClick={() => navigate('/github')}
          className="glass-panel glass-panel-hover p-4 rounded-xl text-left border border-slate-200 bg-white space-y-2"
        >
          <Code2 className="w-5 h-5 text-purple-600" />
          <h4 className="text-xs font-bold text-slate-900">GitHub Audit</h4>
          <p className="text-[11px] text-slate-500">Live API repo analysis</p>
        </button>

        <button
          onClick={() => navigate('/recommendations')}
          className="glass-panel glass-panel-hover p-4 rounded-xl text-left border border-slate-200 bg-white space-y-2"
        >
          <FileText className="w-5 h-5 text-amber-600" />
          <h4 className="text-xs font-bold text-slate-900">Action Plan</h4>
          <p className="text-[11px] text-slate-500">Prioritized career roadmap</p>
        </button>
      </div>

    </div>
  );
};
