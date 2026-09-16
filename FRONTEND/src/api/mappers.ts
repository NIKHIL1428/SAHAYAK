import type {
  BackendCaseDetailResponse,
  BackendCaseSummary,
  BackendEntityFields,
  BackendSummaryFields,
} from "./backendTypes";
import type {
  CaseDetail,
  CyberCase,
  DashboardStats,
  ExtractedEntities,
  FraudType,
  InvestigationDetails,
} from "../types/case";

function mapFraudType(value: string): FraudType {
  const normalized = value.toLowerCase();

  if (normalized.includes("upi")) return "UPI Fraud";
  if (normalized.includes("otp")) return "OTP Fraud";
  if (normalized.includes("phish")) return "Phishing";
  return "Other";
}

function getAudioFormat(fileName: string): string {
  const extension = fileName.split(".").pop()?.toUpperCase() ?? "AUDIO";
  return `${extension} · Processed recording`;
}

function mapEntities(entities: BackendEntityFields): ExtractedEntities {
  return {
    phoneNumbers: entities.phone_numbers,
    upiIds: entities.upi_ids,
    transactionIds: entities.transaction_ids,
    panNumbers: entities.pan_numbers,
    aadhaarNumbers: entities.aadhaar_numbers,
    bankAccounts: entities.bank_account_numbers,
    ifscCodes: entities.ifsc_codes,
    emails: entities.emails,
    urls: entities.urls,
    amounts: entities.amounts,
  };
}

function mapInvestigationDetails(summary: BackendSummaryFields): InvestigationDetails {
  const resolve = (val: string) =>
    val && val.trim().length > 0 ? val.trim() : "Not Available";
  return {
    fraudType: resolve(summary.fraud_type),
    victimAction: resolve(summary.victim_action),
    suspectAction: resolve(summary.suspect_action),
    moneyLost: resolve(summary.money_lost),
    bankName: resolve(summary.bank_name),
    finalOutcome: resolve(summary.final_outcome),
  };
}

export function mapCaseSummary(summary: BackendCaseSummary): CyberCase {
  return {
    id: summary.case_id,
    callerId: "—",
    complainant: "—",
    fraudType: mapFraudType(summary.fraud_type),
    status: "Open",
    registeredAt: summary.processed_at,
    district: "Delhi NCR",
  };
}

export function mapCaseDetail(detail: BackendCaseDetailResponse): CaseDetail {
  const baseCase = mapCaseSummary({
    case_id: detail.case_id,
    audio_file: detail.audio_file,
    fraud_type: detail.summary.fraud_type,
    processed_at: detail.processed_at,
    output_file: detail.output_file,
  });

  const callerId = detail.entities.phone_numbers[0] ?? "—";

  return {
    ...baseCase,
    callerId,
    complainant: "—",
    fraudType: mapFraudType(detail.summary.fraud_type),
    voiceRecording: {
      fileName: detail.audio_file,
      duration: "—",
      format: getAudioFormat(detail.audio_file),
      recordedAt: detail.processed_at,
      analyst: "Cybercrime Pipeline",
      audioUrl: `/api/cases/${encodeURIComponent(detail.case_id)}/recording`,
    },
    conversationSummary: {
      summary: detail.summary.summary,
      generatedAt: detail.processed_at,
      analyst: "Qwen AI",
      confidence: "—",
    },
    extractedEntities: mapEntities(detail.entities),
    investigationDetails: mapInvestigationDetails(detail.summary),
    transcript: detail.transcript ?? "",
  };
}

export function computeDashboardStats(cases: CyberCase[]): DashboardStats {
  const today = new Date();
  const isSameDay = (isoString: string) => {
    const date = new Date(isoString);
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  return {
    totalCases: cases.length,
    todaysCases: cases.filter((caseItem) => isSameDay(caseItem.registeredAt)).length,
    upiFraud: cases.filter((caseItem) => caseItem.fraudType === "UPI Fraud").length,
    otpFraud: cases.filter((caseItem) => caseItem.fraudType === "OTP Fraud").length,
  };
}
