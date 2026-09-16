export type CaseStatus = "Open" | "Under Investigation" | "Closed" | "Escalated";

export type FraudType = "UPI Fraud" | "OTP Fraud" | "Phishing" | "Other";

export interface CyberCase {
  id: string;
  callerId: string;
  complainant: string;
  fraudType: FraudType;
  status: CaseStatus;
  registeredAt: string;
  district: string;
}

export interface DashboardStats {
  totalCases: number;
  todaysCases: number;
  upiFraud: number;
  otpFraud: number;
}

export interface VoiceRecording {
  fileName: string;
  duration: string;
  format: string;
  recordedAt: string;
  analyst: string;
  audioUrl?: string;
}

export interface ConversationSummary {
  summary: string;
  generatedAt: string;
  analyst: string;
  confidence: string;
}

export interface ExtractedEntities {
  phoneNumbers: string[];
  upiIds: string[];
  transactionIds: string[];
  panNumbers: string[];
  aadhaarNumbers: string[];
  bankAccounts: string[];
  ifscCodes: string[];
  emails: string[];
  urls: string[];
  amounts: string[];
}

export interface InvestigationDetails {
  fraudType: string;
  victimAction: string;
  suspectAction: string;
  moneyLost: string;
  bankName: string;
  finalOutcome: string;
}

export interface CaseDetail extends CyberCase {
  voiceRecording: VoiceRecording;
  conversationSummary: ConversationSummary;
  extractedEntities: ExtractedEntities;
  investigationDetails: InvestigationDetails;
  transcript: string;
}
