import type { AnalysisResponse, CandidateInfo, RoleConfig } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchRoles(): Promise<Record<string, RoleConfig>> {
  try {
    const res = await fetch(`${API_BASE_URL}/roles`);
    if (!res.ok) throw new Error('Failed to fetch roles');
    const data = await res.json();
    return data.roles;
  } catch (err) {
    console.warn('API error, returning fallback roles:', err);
    return {
      'AI/ML Engineer': {
        title: 'AI/ML Engineer',
        required_skills: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'SQL', 'Git', 'REST APIs', 'Docker'],
        preferred_skills: ['MLOps', 'LLM', 'RAG', 'Vector DB', 'AWS', 'Kubernetes'],
        min_experience_years: 2,
        project_min_count: 3
      }
    };
  }
}

export async function fetchSampleCandidate(): Promise<{
  candidate_info: CandidateInfo;
  raw_cv_text: string;
  job_description: string;
}> {
  const res = await fetch(`${API_BASE_URL}/sample-candidate`);
  if (!res.ok) throw new Error('Failed to fetch sample candidate');
  return res.json();
}

export async function uploadCVFile(file: File): Promise<{
  filename: string;
  text: string;
  sections: Record<string, string>;
}> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE_URL}/upload-cv`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || 'CV text extraction failed');
  }
  return res.json();
}

export async function runProfileAnalysis(payload: {
  candidate_info: CandidateInfo;
  cv_text: string;
  job_description?: string;
}): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || 'Analysis request failed');
  }
  return res.json();
}

export async function fetchAnalysisById(id: string): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE_URL}/analysis/${id}`);
  if (!res.ok) throw new Error('Analysis record not found');
  return res.json();
}

export async function fetchPastAnalyses(): Promise<AnalysisResponse[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/analysis`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.history || [];
  } catch {
    return [];
  }
}
