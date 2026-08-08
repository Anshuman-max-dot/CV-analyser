import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Layers, ShieldCheck, BarChart3, ArrowRight, CheckCircle, Cpu, FileText, Code2 } from 'lucide-react';

interface LandingPageProps {
  onLoadDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoadDemo }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* HERO SECTION */}
      <section className="text-center space-y-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Explainable AI Profile Intelligence v1.0
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Know Your Career Score. <br />
          <span className="text-gradient">Build a Stronger Profile.</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          AI-powered analysis of your CV, skills, projects, and professional profiles — with transparent, explainable scoring and actionable recommendations for your target role.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/analyze')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-primary hover:opacity-95 text-white font-bold text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
          >
            Analyze My Profile <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onLoadDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel hover:bg-slate-100/80 text-slate-700 font-bold text-base border border-slate-200 flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Sparkles className="w-5 h-5 text-indigo-600" /> Load Demo Candidate
          </button>
        </div>

        {/* Feature Badges */}
        <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-600" /> Transparent Math Formula</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-600" /> spaCy NLP Skill Taxonomy</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-600" /> Real Public GitHub API Integration</span>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How SMARRTIF AI Works</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            A 5-stage NLP & semantic matching pipeline designed for technical hiring evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold">1</div>
            <h3 className="text-base font-bold text-slate-900">CV & Profile Ingestion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload PDF/DOCX resumes and provide public GitHub, LinkedIn, Tableau, or Power BI URLs.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-bold">2</div>
            <h3 className="text-base font-bold text-slate-900">NLP & Skill Extraction</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              spaCy NLP entity recognition extracts skills across an 8-category normalized taxonomy with alias matching.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">3</div>
            <h3 className="text-base font-bold text-slate-900">Explainable Scoring</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Computes explicit 6-dimension weighted scores with empirical evidence and actionable bullet optimization.
            </p>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Production-Ready AI Capabilities</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Built strictly without dummy fallbacks or fake data scraping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <Layers className="w-8 h-8 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Normalized Skill Taxonomy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Normalizes skill variations (`node.js` ➔ `Node.js`, `scikit learn` ➔ `Scikit-learn`) across 8 technical domains.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Transparent Scoring Formula</h3>
            <p className="text-xs text-slate-600 font-mono leading-relaxed">
              Skills (30%) + Experience (20%) + Projects (15%) + ATS (15%) + Education (10%) + Role Match (10%)
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">ATS Optimizer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detects section headings, missing target keywords, and weak phrasing without encouraging keyword stuffing.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <Code2 className="w-8 h-8 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">Live GitHub REST Integration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Queries GitHub API for repo counts, stars, languages, and documentation signals.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <Cpu className="w-8 h-8 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">TF-IDF Semantic Matcher</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluates cosine similarity between candidate CV text and job descriptions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <FileText className="w-8 h-8 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Resume Bullet Point Rewriter</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Flags passive phrases ("worked on", "helped") and suggests quantified action bullet points.
            </p>
          </div>

        </div>
      </section>

      {/* CTA BANNER */}
      <section className="glass-panel p-10 rounded-3xl border border-indigo-200 text-center space-y-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 shadow-md">
        <h2 className="text-3xl font-extrabold text-slate-900">Ready to Evaluate Your Profile?</h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Experience instant AI profile scoring, ATS keyword analysis, and actionable project recommendations.
        </p>
        <button
          onClick={() => navigate('/analyze')}
          className="px-8 py-3.5 rounded-xl bg-gradient-primary hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all inline-flex items-center gap-2"
        >
          Start Profile Analysis <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
