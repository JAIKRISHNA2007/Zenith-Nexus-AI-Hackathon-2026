import apiClient from "./client";

export interface ChatRequestPayload {
  conversation_id: number;
  prompt: string;
}

export interface ChatResponse {
  query?: any;
  chart?: any;
  flowchart?: any;
  explanation?: string;
  metadata?: any;
  response?: string;
}

export const sendChatApi = async (payload: ChatRequestPayload): Promise<ChatResponse> => {
  const response = await apiClient.post<ChatResponse>("/api/v1/chat", payload);
  return response.data;
};
