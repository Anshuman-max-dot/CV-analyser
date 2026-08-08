export interface CandidateInfo {
  name: string;
  email: string;
  target_role: string;
  linkedin_url?: string;
  github_url?: string;
  tableau_url?: string;
  powerbi_url?: string;
}

export interface ScoreDimension {
  name: string;
  score: number;
  weight: number;
  contribution: number;
  explanation: string;
  evidence: string[];
}

export interface ScoreBreakdown {
  skills: ScoreDimension;
  experience: ScoreDimension;
  projects: ScoreDimension;
  ats: ScoreDimension;
  education: ScoreDimension;
  semantic_match: ScoreDimension;
  formula_expression: string;
}

export interface SkillAnalysisResult {
  candidate_skills: string[];
  required_role_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  categorized_skills: Record<string, string[]>;
  match_percentage: number;
}

export interface ATSWeakPhrase {
  original: string;
  phrase_detected: string;
  reason: string;
  suggestion: string;
}

export interface ATSResult {
  ats_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  section_checks: Record<string, boolean>;
  weak_phrases: ATSWeakPhrase[];
  formatting_issues: string[];
  recommendations: string[];
}

export interface GitHubRepoHighlight {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
  description: string | null;
  updated_at: string;
  has_readme: boolean;
}

export interface GitHubAnalysis {
  username: string;
  connected: boolean;
  status_message: string;
  public_repos_count: number;
  followers: number;
  total_stars: number;
  top_languages: Record<string, number>;
  documentation_score: number;
  github_score: number;
  recent_repositories: GitHubRepoHighlight[];
  recommendations: string[];
}

export interface PlatformStatus {
  platform: string;
  url: string;
  status: string;
  detail: string;
}

export interface RecommendationItem {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  title: string;
  problem: string;
  why_it_matters: string;
  recommended_action: string;
  expected_impact: string;
}

export interface ProjectAnalysisItem {
  title: string;
  tech_stack_detected: string[];
  complexity_score: number;
  quantified_metrics_found: boolean;
  weak_phrases_detected: string[];
  feedback: string;
  improved_bullet_suggestion: string;
}

export interface ExperienceAnalysis {
  years_detected: number;
  seniority_level: string;
  action_verb_count: number;
  role_history_count: number;
  feedback: string[];
}

export interface AnalysisResponse {
  id: string;
  timestamp: string;
  candidate_info: CandidateInfo;
  overall_score: number;
  status_label: string;
  breakdown: ScoreBreakdown;
  skills_analysis: SkillAnalysisResult;
  ats_analysis: ATSResult;
  github_analysis: GitHubAnalysis;
  platform_statuses: PlatformStatus[];
  recommendations: RecommendationItem[];
  project_analysis: ProjectAnalysisItem[];
  experience_analysis: ExperienceAnalysis;
  raw_cv_excerpt: string;
}

export interface RoleConfig {
  title: string;
  required_skills: string[];
  preferred_skills: string[];
  min_experience_years: number;
  project_min_count: number;
}
