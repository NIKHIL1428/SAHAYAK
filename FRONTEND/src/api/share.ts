import { apiPost } from "./client";
import type { BackendShareResponse } from "./backendTypes";
import type { ShareableItem, ShareDestination, SharePriority } from "../types/share";

interface ShareCasePayload {
  case_id: string;
  recording: boolean;
  summary: boolean;
  data: boolean;
  destination: ShareDestination;
  priority: SharePriority;
  remarks?: string;
}

export async function shareCasePackage(payload: ShareCasePayload): Promise<BackendShareResponse> {
  return apiPost<BackendShareResponse>("/api/share", payload);
}

export function mapShareItems(items: ShareableItem[]): Pick<ShareCasePayload, "recording" | "summary" | "data"> {
  return {
    recording: items.includes("voiceRecording"),
    summary: items.includes("conversationSummary"),
    data: items.includes("informationCollected"),
  };
}
