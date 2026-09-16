export interface BackendSummaryFields {
  summary: string;
  fraud_type: string;
  victim_action: string;
  suspect_action: string;
  money_lost: string;
  bank_name: string;
  final_outcome: string;
}

export interface BackendEntityFields {
  phone_numbers: string[];
  upi_ids: string[];
  pan_numbers: string[];
  aadhaar_numbers: string[];
  emails: string[];
  urls: string[];
  amounts: string[];
  ifsc_codes: string[];
  bank_account_numbers: string[];
  transaction_ids: string[];
}

export interface BackendCaseSummary {
  case_id: string;
  audio_file: string;
  fraud_type: string;
  processed_at: string;
  output_file: string;
}

export interface BackendCaseListResponse {
  cases: BackendCaseSummary[];
  total: number;
}

export interface BackendCaseDetailResponse {
  case_id: string;
  audio_file: string;
  audio_path: string;
  transcript: string;
  summary: BackendSummaryFields;
  entities: BackendEntityFields;
  output_file: string;
  processed_at: string;
}

export interface BackendShareResponse {
  status: string;
}
