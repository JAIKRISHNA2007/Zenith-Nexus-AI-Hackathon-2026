import apiClient from "./client";

export interface ConversationResponse {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface MessageResponse {
  id: number;
  conversation_id: number;
  role: string;
  content: string;
  created_at: string;
}

export interface MessageCreatePayload {
  role: string;
  content: string;
}

export const createConversationApi = async (userId: number): Promise<ConversationResponse> => {
  const response = await apiClient.post<ConversationResponse>(`/api/v1/conversations/${userId}`);
  return response.data;
};

export const getConversationsApi = async (): Promise<ConversationResponse[]> => {
  const response = await apiClient.get<ConversationResponse[]>("/api/v1/conversations");
  return response.data;
};

export const getConversationByIdApi = async (id: number): Promise<ConversationResponse> => {
  const response = await apiClient.get<ConversationResponse>(`/api/v1/conversations/${id}`);
  return response.data;
};

export const deleteConversationApi = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/api/v1/conversations/${id}`);
  return response.data;
};

export const getMessagesApi = async (conversationId: number): Promise<MessageResponse[]> => {
  const response = await apiClient.get<MessageResponse[]>(`/api/v1/messages/${conversationId}`);
  return response.data;
};

export const createMessageApi = async (
  conversationId: number,
  payload: MessageCreatePayload
): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(
    `/api/v1/messages/${conversationId}`,
    payload
  );
  return response.data;
};
