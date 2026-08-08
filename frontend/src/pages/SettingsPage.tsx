import React, { useState } from 'react';
import { Key, Database, Cpu, Save, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [githubToken, setGithubToken] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Application Configuration</span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Settings & Integration Keys</h1>
        <p className="text-xs text-slate-500 font-medium">Configure scoring parameters, API rate limit tokens, and database status</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Scoring Matrix Weights Display */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            Transparent Formula Dimension Weights
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Skills Weight</span>
              <p className="text-slate-900 font-extrabold text-base">30%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Experience Weight</span>
              <p className="text-slate-900 font-extrabold text-base">20%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Projects Weight</span>
              <p className="text-slate-900 font-extrabold text-base">15%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">ATS Weight</span>
              <p className="text-slate-900 font-extrabold text-base">15%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Education Weight</span>
              <p className="text-slate-900 font-extrabold text-base">10%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Semantic Role Weight</span>
              <p className="text-slate-900 font-extrabold text-base">10%</p>
            </div>
          </div>
        </div>

        {/* API Tokens Configuration */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-600" />
            External API Keys & Credentials
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">GitHub Personal Access Token (Optional)</label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Increases public API rate limit from 60 to 5,000 requests/hr.</p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">OpenAI API Key (Optional)</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Enables optional deep LLM bullet rewriter. Baseline spaCy + NLTK works 100% locally without keys.</p>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-3 text-xs shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            Backend Storage Status
          </h3>
          <p className="text-slate-700 font-medium">
            Database Engine: <strong className="text-emerald-700">MongoDB / Persistent Local Store</strong>
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          {saveSuccess && (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settings updated successfully
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>

      </form>

    </div>
  );
};
