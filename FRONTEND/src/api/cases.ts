import { apiGet } from "./client";
import type { BackendCaseDetailResponse, BackendCaseListResponse } from "./backendTypes";
import { computeDashboardStats, mapCaseDetail, mapCaseSummary } from "./mappers";
import type { CaseDetail, CyberCase, DashboardStats } from "../types/case";

export async function fetchCases(): Promise<CyberCase[]> {
  const response = await apiGet<BackendCaseListResponse>("/api/cases");
  return response.cases.map(mapCaseSummary);
}

export async function fetchCaseById(caseId: string): Promise<CaseDetail> {
  const response = await apiGet<BackendCaseDetailResponse>(
    `/api/cases/${encodeURIComponent(caseId)}`
  );
  return mapCaseDetail(response);
}

export async function fetchDashboardData(): Promise<{
  cases: CyberCase[];
  stats: DashboardStats;
}> {
  const cases = await fetchCases();
  return {
    cases,
    stats: computeDashboardStats(cases),
  };
}

export async function uploadCaseAudio(file: File): Promise<any> {
  const { apiPostForm } = await import("./client");
  const formData = new FormData();
  formData.append("file", file);
  return apiPostForm<any>("/api/process", formData);
}
