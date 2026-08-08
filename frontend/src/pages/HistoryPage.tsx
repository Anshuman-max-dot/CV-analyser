import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPastAnalyses } from '../services/api';
import type { AnalysisResponse } from '../types';
import { History, Calendar, User, ArrowRight } from 'lucide-react';

interface HistoryPageProps {
  onSelectHistoryItem: (item: AnalysisResponse) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectHistoryItem }) => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState<AnalysisResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPastAnalyses()
      .then((data) => setHistoryList(data))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelect = (item: AnalysisResponse) => {
    onSelectHistoryItem(item);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white flex items-center justify-between shadow-xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Evaluation Audit Trail</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Analysis History</h1>
          <p className="text-xs text-slate-500">Review past candidate profile evaluations stored in database</p>
        </div>
        <button
          onClick={() => navigate('/analyze')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
        >
          New Analysis
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-500 text-xs font-medium">Loading history from database...</div>
      ) : historyList.length === 0 ? (
        <div className="py-20 text-center space-y-3 glass-panel rounded-2xl border border-slate-200 bg-white shadow-xs">
          <History className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Past Analysis History Found</h3>
          <p className="text-xs text-slate-500 font-medium">Run an analysis to record past scores and evaluations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-200/80 bg-white flex items-center justify-between cursor-pointer shadow-xs"
            >
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-900 text-sm">{item.candidate_info.name || 'Alex Mercer'}</span>
                  <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold">
                    {item.candidate_info.target_role}
                  </span>
                </div>
                <p className="text-slate-500 flex items-center gap-2 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900">{item.overall_score}/100</span>
                  <p className="text-[10px] text-emerald-700 font-extrabold">{item.status_label}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
