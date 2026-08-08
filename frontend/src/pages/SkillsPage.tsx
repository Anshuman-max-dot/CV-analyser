import React, { useState } from 'react';
import type { AnalysisResponse } from '../types';
import { CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

interface SkillsPageProps {
  analysisResult: AnalysisResponse | null;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({ analysisResult }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!analysisResult) {
    return (
      <div className="py-20 text-center text-slate-500">
        Please run an analysis first to inspect skills breakdown.
      </div>
    );
  }

  const { skills_analysis, candidate_info } = analysisResult;
  const categories = Object.keys(skills_analysis.categorized_skills);

  const filteredCategories = categories.filter((cat) => {
    if (selectedCategory !== 'ALL' && cat !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Skill Gap Analysis</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Normalized Skill Taxonomy Match</h1>
          <p className="text-xs text-slate-500">Target Role: <strong className="text-slate-800 font-bold">{candidate_info.target_role}</strong> • Match Percentage: <strong className="text-emerald-600 font-extrabold">{skills_analysis.match_percentage}%</strong></p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
            <strong>{skills_analysis.matched_skills.length}</strong> Matched Skills
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
            <strong>{skills_analysis.missing_skills.length}</strong> Missing Gaps
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-200/80 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span className="text-slate-700 font-bold">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none"
          />
        </div>
      </div>

      {/* Target Role Skill Requirements Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Required Skills Comparison for {candidate_info.target_role}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {skills_analysis.required_role_skills.map((reqSkill) => {
            const isMatched = skills_analysis.matched_skills.includes(reqSkill);
            return (
              <div
                key={reqSkill}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <span>{reqSkill}</span>
                {isMatched ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Categorized Taxonomy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.map((cat) => {
          const skillsInCat = skills_analysis.categorized_skills[cat] || [];
          const matchingSkillsInCat = skillsInCat.filter(s =>
            searchTerm ? s.toLowerCase().includes(searchTerm.toLowerCase()) : true
          );

          if (matchingSkillsInCat.length === 0 && searchTerm) return null;

          return (
            <div key={cat} className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">{cat}</h3>
                <span className="text-xs text-slate-500 font-mono">{skillsInCat.length} skills found</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {skillsInCat.length > 0 ? (
                  skillsInCat.map((s) => {
                    const isRoleRequired = skills_analysis.required_role_skills.includes(s);
                    return (
                      <span
                        key={s}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${
                          isRoleRequired
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-800 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        {s}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills detected in this category</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
