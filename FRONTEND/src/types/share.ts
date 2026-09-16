export type ShareableItem = "voiceRecording" | "conversationSummary" | "informationCollected";

export type ShareDestination =
  | "South Delhi"
  | "Dwarka"
  | "Rohini"
  | "Crime Branch"
  | "Headquarters";

export type SharePriority = "Normal" | "High" | "Urgent";

export interface ShareCasePackage {
  items: ShareableItem[];
  destination: ShareDestination;
  priority: SharePriority;
  remarks: string;
}

export const SHARE_ITEM_LABELS: Record<ShareableItem, string> = {
  voiceRecording: "Voice Recording",
  conversationSummary: "Conversation Summary",
  informationCollected: "Information Collected",
};

export const SHARE_DESTINATIONS: ShareDestination[] = [
  "South Delhi",
  "Dwarka",
  "Rohini",
  "Crime Branch",
  "Headquarters",
];

export const SHARE_PRIORITIES: SharePriority[] = ["Normal", "High", "Urgent"];
