export interface Change {
  type: "add" | "delete" | "modify";
  file: string;
  lineNumber: number;
  content: string;
  context?: string;
}

export interface ReviewResult {
  summary: string;
  suggestions: Suggestion[];
  securityIssues: SecurityIssue[];
  bestPractices: string[];
  complexity: string;
  impact: string;
}

export interface Suggestion {
  file: string;
  line: number;
  description: string;
  recommendation: string;
  impact: string;
}

export interface SecurityIssue {
  severity: "low" | "medium" | "high";
  description: string;
  location: string;
  recommendation: string;
}

export interface Hunk {
  oldStart: number;
  oldLength: number;
  newStart: number;
  newLength: number;
}
