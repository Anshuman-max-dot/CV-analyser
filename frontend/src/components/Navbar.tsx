import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Brain, BarChart2, ShieldCheck, FileText, Settings, History, Layers, Code2 } from 'lucide-react';

interface NavbarProps {
  onLoadSampleCandidate?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoadSampleCandidate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: Sparkles },
    { path: '/analyze', label: 'Analyze', icon: Brain },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart2 },
    { path: '/skills', label: 'Skills', icon: Layers },
    { path: '/ats', label: 'ATS Optimizer', icon: ShieldCheck },
    { path: '/github', label: 'GitHub Audit', icon: Code2 },
    { path: '/recommendations', label: 'Action Plan', icon: FileText },
    { path: '/history', label: 'History', icon: History },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-wide flex items-center gap-1.5">
                SMARRTIF <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">AI</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Career Profile Intelligence</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {onLoadSampleCandidate && (
              <button
                onClick={onLoadSampleCandidate}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-all shadow-xs"
                title="Load realistic candidate demo data"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Demo Candidate
              </button>
            )}
            <button
              onClick={() => navigate('/analyze')}
              className="px-4 py-2 rounded-lg bg-gradient-primary hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
            >
              Analyze Profile
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
