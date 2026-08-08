import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { DashboardPage } from './pages/DashboardPage';
import { SkillsPage } from './pages/SkillsPage';
import { AtsPage } from './pages/AtsPage';
import { GithubPage } from './pages/GithubPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import type { AnalysisResponse } from './types';
import { fetchSampleCandidate, runProfileAnalysis } from './services/api';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Quick Demo Candidate Loader
  const handleLoadDemo = async () => {
    setIsDemoLoading(true);
    try {
      const demo = await fetchSampleCandidate();
      const result = await runProfileAnalysis({
        candidate_info: demo.candidate_info,
        cv_text: demo.raw_cv_text,
        job_description: demo.job_description
      });
      setAnalysisResult(result);
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo load error:', err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar onLoadSampleCandidate={handleLoadDemo} />

      {isDemoLoading && (
        <div className="bg-indigo-600 text-white text-xs text-center py-2 font-semibold shadow-sm animate-pulse">
          Loading realistic demo candidate profile (Alex Mercer — AI/ML Engineer)...
        </div>
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage onLoadDemo={handleLoadDemo} />} />
          <Route path="/analyze" element={<AnalyzePage onAnalysisComplete={(res) => setAnalysisResult(res)} />} />
          <Route path="/dashboard" element={<DashboardPage analysisResult={analysisResult} />} />
          <Route path="/skills" element={<SkillsPage analysisResult={analysisResult} />} />
          <Route path="/ats" element={<AtsPage analysisResult={analysisResult} />} />
          <Route path="/github" element={<GithubPage analysisResult={analysisResult} />} />
          <Route path="/recommendations" element={<RecommendationsPage analysisResult={analysisResult} />} />
          <Route path="/history" element={<HistoryPage onSelectHistoryItem={(item) => setAnalysisResult(item)} />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
