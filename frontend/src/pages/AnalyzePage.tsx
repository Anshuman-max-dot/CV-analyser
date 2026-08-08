import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadCVFile, runProfileAnalysis, fetchSampleCandidate } from '../services/api';
import type { CandidateInfo, AnalysisResponse } from '../types';
import { Upload, FileText, Loader2, Sparkles, User, Link as LinkIcon, Briefcase, Trash2, ArrowRight } from 'lucide-react';

interface AnalyzePageProps {
  onAnalysisComplete: (result: AnalysisResponse) => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onAnalysisComplete }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>({
    name: '',
    email: '',
    target_role: 'AI/ML Engineer',
    linkedin_url: '',
    github_url: '',
    tableau_url: '',
    powerbi_url: ''
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepLabel, setAnalysisStepLabel] = useState('Extracting CV...');
  const [errorMessage, setErrorMessage] = useState('');

  const targetRoles = [
    'AI/ML Engineer',
    'Data Scientist',
    'Data Analyst',
    'Backend Developer',
    'Full Stack Developer',
    'Software Engineer',
    'NLP Engineer'
  ];

  // Handle Demo Data Loader
  const handleLoadDemo = async () => {
    try {
      const demoData = await fetchSampleCandidate();
      setCandidateInfo(demoData.candidate_info);
      setCvText(demoData.raw_cv_text);
      setJobDescription(demoData.job_description);
      setCvFile(null);
    } catch (err) {
      setErrorMessage('Could not load demo data.');
    }
  };

  // Handle File Select & Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setCvFile(file);
    setIsUploading(true);
    setErrorMessage('');

    try {
      const result = await uploadCVFile(file);
      setCvText(result.text);
    } catch (err: any) {
      setErrorMessage(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Final Analysis Submit
  const handleRunAnalysis = async () => {
    if (!candidateInfo.name || !candidateInfo.email) {
      setErrorMessage('Please enter candidate name and email.');
      setStep(1);
      return;
    }
    if (!cvText || cvText.trim().length < 30) {
      setErrorMessage('Please upload a CV or paste CV text.');
      setStep(2);
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');

    const steps = [
      'Extracting CV structure & text...',
      'Running spaCy NLP skill taxonomy entity extraction...',
      'Evaluating project technical complexity & quantified metrics...',
      'Performing ATS keyword & formatting compliance check...',
      'Connecting to public GitHub REST API...',
      'Running TF-IDF semantic role compatibility matching...',
      'Calculating explainable 6-dimension weighted score...',
      'Generating prioritized career recommendations...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStepLabel(steps[i]);
      await new Promise(r => setTimeout(r, 350));
    }

    try {
      const result = await runProfileAnalysis({
        candidate_info: candidateInfo,
        cv_text: cvText,
        job_description: jobDescription
      });

      onAnalysisComplete(result);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Profile analysis failed');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Career Profile Analysis Setup</h1>
        <p className="text-sm text-slate-500">Complete candidate evaluation details to generate explainable scores</p>
      </div>

      {/* Demo Loader Bar */}
      <div className="flex justify-end">
        <button
          onClick={handleLoadDemo}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Pre-fill with Demo Candidate (Alex Mercer)
        </button>
      </div>

      {/* Progress Steps Indicator */}
      <div className="flex items-center justify-between glass-panel p-4 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold shadow-xs">
        {[
          { num: 1, label: 'Info' },
          { num: 2, label: 'CV Upload' },
          { num: 3, label: 'Profiles' },
          { num: 4, label: 'Job Description' },
          { num: 5, label: 'Review' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              step === s.num
                ? 'bg-indigo-600 text-white shadow-sm'
                : step > s.num
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px]">
              {s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Error Callout */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
          <Trash2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* STEP 1: CANDIDATE INFO */}
      {step === 1 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Step 1 — Candidate Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Candidate Name *</label>
              <input
                type="text"
                value={candidateInfo.name}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, name: e.target.value })}
                placeholder="e.g. Alex Mercer"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Candidate Email *</label>
              <input
                type="email"
                value={candidateInfo.email}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, email: e.target.value })}
                placeholder="e.g. alex@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">Target Role *</label>
              <select
                value={candidateInfo.target_role}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, target_role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
              >
                {targetRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              Next: Upload CV <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: UPLOAD CV */}
      {step === 2 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Step 2 — Upload CV / Resume
          </h2>

          <div className="space-y-4 text-xs">
            {/* File Dropzone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-8 text-center space-y-3 transition-colors bg-slate-50/50">
              <Upload className="w-8 h-8 text-indigo-600 mx-auto" />
              <div>
                <p className="text-sm font-bold text-slate-900">Upload PDF or DOCX resume</p>
                <p className="text-slate-500 text-xs font-medium">Supports files up to 10MB</p>
              </div>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload-input"
              />
              <label
                htmlFor="cv-upload-input"
                className="inline-block px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                Browse Files
              </label>
            </div>

            {isUploading && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" /> Extracting CV text...
              </div>
            )}

            {cvFile && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-900 font-bold">{cvFile.name}</span>
                  <span className="text-slate-500">({(cvFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  onClick={() => { setCvFile(null); setCvText(''); }}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Direct Text Area Input */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Raw Extracted CV Text</label>
              <textarea
                rows={6}
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Or paste your raw resume text here..."
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              Next: Professional Profiles <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PROFESSIONAL PROFILES */}
      {step === 3 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-indigo-600" />
            Step 3 — Professional Profile Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">GitHub Profile URL (Live API Analysis)</label>
              <input
                type="url"
                value={candidateInfo.github_url}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, github_url: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                value={candidateInfo.linkedin_url}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Tableau Public URL (Optional)</label>
              <input
                type="url"
                value={candidateInfo.tableau_url}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, tableau_url: e.target.value })}
                placeholder="https://public.tableau.com/profile/username"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Power BI Report URL (Optional)</label>
              <input
                type="url"
                value={candidateInfo.powerbi_url}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, powerbi_url: e.target.value })}
                placeholder="https://app.powerbi.com/view?r=sample"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              Next: Job Description <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: JOB DESCRIPTION */}
      {step === 4 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Step 4 — Target Job Description (Optional)
          </h2>

          <div className="space-y-2 text-xs">
            <label className="block text-slate-700 font-bold">Paste Target Job Description</label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description you are targeting to run deep TF-IDF semantic match and keyword gap analysis..."
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              Next: Review & Run <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & RUN ANALYSIS */}
      {step === 5 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 bg-white space-y-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Step 5 — Ready to Analyze Profile
          </h2>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700 font-medium">
            <p><strong className="text-slate-900">Candidate Name:</strong> {candidateInfo.name || 'Alex Mercer'}</p>
            <p><strong className="text-slate-900">Target Role:</strong> {candidateInfo.target_role}</p>
            <p><strong className="text-slate-900">CV Character Count:</strong> {cvText.length} chars</p>
            <p><strong className="text-slate-900">GitHub URL:</strong> {candidateInfo.github_url || 'Not provided'}</p>
            <p><strong className="text-slate-900">Job Description:</strong> {jobDescription ? `${jobDescription.length} chars` : 'Default Role Benchmarks'}</p>
          </div>

          {isAnalyzing ? (
            <div className="p-8 text-center space-y-4 glass-panel rounded-xl border border-indigo-200 bg-white">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-900">{analysisStepLabel}</p>
              <p className="text-xs text-slate-500 font-medium">Applying 6-dimension transparent scoring matrix...</p>
            </div>
          ) : (
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleRunAnalysis}
                className="px-8 py-3 rounded-xl bg-gradient-primary hover:opacity-95 text-white font-bold text-sm shadow-md shadow-indigo-500/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Analyze My Profile
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
