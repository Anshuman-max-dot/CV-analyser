import React from 'react';
import type { AnalysisResponse } from '../types';
import { Star, GitFork, BookOpen, CheckCircle2, AlertTriangle, ExternalLink, Code2 } from 'lucide-react';

interface GithubPageProps {
  analysisResult: AnalysisResponse | null;
}

export const GithubPage: React.FC<GithubPageProps> = ({ analysisResult }) => {
  if (!analysisResult) {
    return (
      <div className="py-20 text-center text-slate-500">
        Please run an analysis first to inspect GitHub audit metrics.
      </div>
    );
  }

  const { github_analysis } = analysisResult;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Banner Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">GitHub Engineering Signal Audit</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
            {github_analysis.username ? `@${github_analysis.username}` : 'GitHub Audit'}
          </h1>
          <p className="text-xs text-slate-500">{github_analysis.status_message}</p>
        </div>

        {github_analysis.connected && (
          <div className="px-6 py-3 rounded-2xl bg-purple-50 border border-purple-200 text-center">
            <span className="text-2xl font-extrabold text-purple-700">{github_analysis.github_score}</span>
            <p className="text-[10px] text-purple-800 uppercase font-bold">GitHub Audit Score</p>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-200/80 bg-white text-center space-y-1 shadow-xs">
          <BookOpen className="w-5 h-5 text-indigo-600 mx-auto" />
          <span className="text-2xl font-extrabold text-slate-900">{github_analysis.public_repos_count}</span>
          <p className="text-[11px] text-slate-500 font-bold uppercase">Public Repos</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-200/80 bg-white text-center space-y-1 shadow-xs">
          <Star className="w-5 h-5 text-amber-500 mx-auto" />
          <span className="text-2xl font-extrabold text-slate-900">{github_analysis.total_stars}</span>
          <p className="text-[11px] text-slate-500 font-bold uppercase">Total Stars</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-200/80 bg-white text-center space-y-1 shadow-xs">
          <Code2 className="w-5 h-5 text-emerald-600 mx-auto" />
          <span className="text-2xl font-extrabold text-slate-900">{github_analysis.followers}</span>
          <p className="text-[11px] text-slate-500 font-bold uppercase">Followers</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-200/80 bg-white text-center space-y-1 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-blue-600 mx-auto" />
          <span className="text-2xl font-extrabold text-slate-900">{github_analysis.documentation_score}%</span>
          <p className="text-[11px] text-slate-500 font-bold uppercase">README Signals</p>
        </div>
      </div>

      {/* Top Languages Breakdown */}
      {github_analysis.top_languages && Object.keys(github_analysis.top_languages).length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Language Distribution</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(github_analysis.top_languages).map(([lang, count]) => (
              <div key={lang} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                {lang}: <strong className="text-slate-900">{count} repo(s)</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Public Repositories List */}
      {github_analysis.recent_repositories && github_analysis.recent_repositories.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Public Repositories Highlight</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {github_analysis.recent_repositories.map((repo) => (
              <div key={repo.name} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    {repo.name}
                  </span>
                  <a
                    href={`https://github.com/${github_analysis.username}/${repo.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-slate-800 text-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{repo.description || 'No description provided.'}</p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono font-medium pt-1">
                  <span className="text-indigo-700 font-bold">{repo.language || 'Code'}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" /> {repo.stars}</span>
                  <span className="flex items-center gap-1"><GitFork className="w-3 h-3 text-blue-600" /> {repo.forks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GitHub Audit Recommendations */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">GitHub Action Items</h3>
        <div className="space-y-2">
          {github_analysis.recommendations.map((rec, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-purple-600 flex-shrink-0" />
              {rec}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
