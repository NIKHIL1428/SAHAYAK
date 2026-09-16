import type {
  CaseDetail,
  ExtractedEntities,
  InvestigationDetails,
} from "../types/case";
import { recentCases } from "./mockCases";

const defaultEntities: ExtractedEntities = {
  phoneNumbers: ["+91 98765 43210", "+91 11234 56789"],
  upiIds: ["fraudster@paytm", "scam.wallet@ybl"],
  transactionIds: ["TXN/UPI/202607110842/8834", "REF/NPCI/772910384"],
  panNumbers: ["ABCPK1234L"],
  aadhaarNumbers: ["XXXX-XXXX-4821"],
  bankAccounts: ["XXXX-XXXX-7823 (SBI)", "50100234567890 (HDFC)"],
  ifscCodes: ["SBIN0001234", "HDFC0000456"],
  emails: ["support-fake@sbi-verify.in", "kyc-update@traispoof.com"],
  urls: ["https://sbi-kyc-verify.net/login", "https://bit.ly/3xFraudLink"],
  amounts: ["₹45,000", "₹12,500"],
};

const defaultInvestigationDetails: InvestigationDetails = {
  fraudType: "UPI Fraud — spoofed bank customer care",
  victimAction:
    "Shared OTP aloud after caller claimed suspicious account activity and threatened RBI-mandated account freeze",
  suspectAction:
    "Impersonated SBI customer care, created urgency, and initiated UPI debit to mule account fraudster@paytm",
  moneyLost: "₹45,000",
  bankName: "State Bank of India",
  finalOutcome:
    "Account freeze recommended; NPCI reversal request initiated; FIR under IT Act Section 66D and IPC Section 420",
};

const defaultTranscript = `[00:00] Analyst: Delhi Cyber Cell, case recording DL-CY-2026-08421. Please state your name for the record.
[00:08] Complainant: Rajesh Kumar.
[00:12] Analyst: You reported a UPI fraud today. Can you walk us through the call?
[00:20] Complainant: Someone called from a number that looked like SBI. They said my account had suspicious activity and I must verify immediately.
[00:35] Analyst: Did they ask for an OTP?
[00:38] Complainant: Yes. They said it was for UPI verification only and my account would be frozen by RBI if I refused.
[00:52] Complainant: I read the OTP. Within ten minutes ₹45,000 was debited to fraudster@paytm.
[01:05] Analyst: Did you share any other details — PAN, Aadhaar, or bank account number?
[01:12] Complainant: Only the OTP. They already knew my name.
[01:18] Analyst: We will note the caller ID, UPI ID, and transaction references for investigation.`;

const defaultDetail: Omit<CaseDetail, keyof import("../types/case").CyberCase> = {
  voiceRecording: {
    fileName: "recording_08421.wav",
    duration: "04:32",
    format: "WAV · 16 kHz",
    recordedAt: "2026-07-11T08:45:00",
    analyst: "Insp. Meera Joshi",
  },
  conversationSummary: {
    summary:
      "The complainant received a spoofed call impersonating SBI customer care. The suspect claimed suspicious account activity and coerced the victim into sharing an OTP for UPI verification. Within 10 minutes, ₹45,000 was debited via UPI to mule account fraudster@paytm. Caller used urgency tactics citing RBI compliance and threatened account freeze. Victim statements confirm OTP was read aloud under duress. Recommended immediate account freeze, NPCI reversal request, and FIR registration under IT Act Section 66D and IPC Section 420.",
    generatedAt: "2026-07-11T09:12:00",
    analyst: "Insp. Meera Joshi",
    confidence: "94%",
  },
  extractedEntities: defaultEntities,
  investigationDetails: defaultInvestigationDetails,
  transcript: defaultTranscript,
};

export const caseDetails: Record<string, CaseDetail> = {
  "DL-CY-2026-08421": {
    id: "DL-CY-2026-08421",
    callerId: "+91 98765 43210",
    complainant: "Rajesh Kumar",
    fraudType: "UPI Fraud",
    status: "Under Investigation",
    registeredAt: "2026-07-11T08:42:00",
    district: "South Delhi",
    ...defaultDetail,
  },
  "DL-CY-2026-08420": {
    id: "DL-CY-2026-08420",
    callerId: "+91 87654 32109",
    complainant: "Priya Sharma",
    fraudType: "OTP Fraud",
    status: "Open",
    registeredAt: "2026-07-11T07:15:00",
    district: "North Delhi",
    voiceRecording: {
      fileName: "recording_08420.wav",
      duration: "03:18",
      format: "WAV · 16 kHz",
      recordedAt: "2026-07-11T07:18:00",
      analyst: "SI Arjun Malhotra",
    },
    conversationSummary: {
      summary:
        "Victim received an automated message followed by a live agent claiming TRAI affiliation. The suspect threatened SIM deactivation within 24 hours unless OTP was shared for KYC compliance. Victim became suspicious and disconnected before sharing credentials. Caller ID +91 87654 32109 is linked to 3 prior complaints in the national fraud database. Preventive intervention recommended — block caller at telecom level and counsel victim on OTP safety.",
      generatedAt: "2026-07-11T07:45:00",
      analyst: "SI Arjun Malhotra",
      confidence: "89%",
    },
    extractedEntities: {
      phoneNumbers: ["+91 87654 32109", "+91 1800-XXX-XXXX"],
      upiIds: [],
      transactionIds: [],
      panNumbers: [],
      aadhaarNumbers: [],
      bankAccounts: [],
      ifscCodes: [],
      emails: ["kyc-update@traispoof.com"],
      urls: ["https://trai-kyc-update.in/verify"],
      amounts: [],
    },
    investigationDetails: {
      fraudType: "OTP Fraud — TRAI KYC impersonation",
      victimAction:
        "Received automated message and live call threatening SIM deactivation; disconnected before sharing OTP",
      suspectAction:
        "Claimed TRAI affiliation and demanded OTP for KYC compliance within 24 hours",
      moneyLost: "None — prevented",
      bankName: "Not applicable",
      finalOutcome:
        "Preventive intervention; block caller at telecom level; counsel victim on OTP safety",
    },
    transcript: `[00:00] Analyst: Recording for case DL-CY-2026-08420, complainant Priya Sharma.
[00:06] Complainant: I got a message saying my SIM would be deactivated, then a person called claiming to be from TRAI.
[00:18] Analyst: What did they ask you to do?
[00:22] Complainant: Share an OTP for KYC. They said I had less than 24 hours or the SIM would stop working.
[00:35] Complainant: It felt wrong. I hung up and did not share anything.
[00:42] Analyst: Good decision. We will flag caller ID +91 87654 32109 — it appears in prior fraud complaints.`,
  },
};

export function getCaseDetail(caseId: string): CaseDetail | undefined {
  if (caseDetails[caseId]) {
    return caseDetails[caseId];
  }

  const baseCase = recentCases.find((item) => item.id === caseId);
  if (!baseCase) return undefined;

  return {
    ...baseCase,
    voiceRecording: {
      ...defaultDetail.voiceRecording,
      fileName: `recording_${caseId.slice(-5)}.wav`,
      recordedAt: baseCase.registeredAt,
    },
    conversationSummary: {
      summary: `${baseCase.complainant} reported a ${baseCase.fraudType.toLowerCase()} incident originating from caller ID ${baseCase.callerId}. Case registered in ${baseCase.district} and currently marked as ${baseCase.status}. Investigation pending detailed analysis of call recording and entity extraction.`,
      generatedAt: baseCase.registeredAt,
      analyst: "Cyber Analysis Unit",
      confidence: "—",
    },
    extractedEntities: {
      phoneNumbers: [baseCase.callerId],
      upiIds: [],
      transactionIds: [],
      panNumbers: [],
      aadhaarNumbers: [],
      bankAccounts: [],
      ifscCodes: [],
      emails: [],
      urls: [],
      amounts: [],
    },
    investigationDetails: {
      fraudType: baseCase.fraudType,
      victimAction: "Reported incident; details pending full call analysis",
      suspectAction: `Contacted complainant from caller ID ${baseCase.callerId}`,
      moneyLost: "Under verification",
      bankName: "Under verification",
      finalOutcome: `Case registered in ${baseCase.district}; status ${baseCase.status}`,
    },
    transcript: `Transcript pending for case ${caseId}. Audio processing and entity extraction will populate this section once analysis completes.`,
  };
}
