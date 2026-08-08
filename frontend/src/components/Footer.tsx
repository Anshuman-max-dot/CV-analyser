import React from 'react';
import { Brain, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-slate-200/80 bg-white mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Brain className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">SMARRTIF AI — AI Career Profile Analyzer</p>
              <p className="text-xs text-slate-500">Explainable AI Career Intelligence for Engineers & Recruiter Evaluation</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> 100% Privacy Preserved (No Private Scraping)
            </span>
            <span>Formula: Skills (30%) + Exp (20%) + Projects (15%) + ATS (15%) + Edu (10%) + Role (10%)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
