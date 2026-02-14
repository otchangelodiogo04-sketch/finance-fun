export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export interface WebhookPayload {
  message: string;
  timestamp: string;
  userId: string;
}

export interface WebhookResponse {
  reply: string;
}
