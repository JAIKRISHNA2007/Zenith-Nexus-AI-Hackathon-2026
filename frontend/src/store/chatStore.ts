import { create } from "zustand";
import type { ChatMessage } from "../types/chat";
import {
  type ConversationResponse,
  getConversationsApi,
  createConversationApi,
  deleteConversationApi,
  getMessagesApi,
} from "../services/api/conversationApi";
import { sendChatApi } from "../services/api/chatApi";

interface ChatState {
  // Original State
  messages: ChatMessage[];
  loading: boolean;
  typing: boolean;
  visualizationLoading: boolean;

  // Extended State
  conversations: ConversationResponse[];
  activeConversationId: number | null;
  conversationsLoading: boolean;
  toastMessage: string | null;

  // Actions
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setTyping: (typing: boolean) => void;
  setVisualizationLoading: (loading: boolean) => void;
  setToastMessage: (msg: string | null) => void;

  // API Actions
  fetchConversations: () => Promise<void>;
  selectConversation: (id: number) => Promise<void>;
  createNewConversation: (userId?: number) => Promise<number | null>;
  deleteConversation: (id: number) => Promise<boolean>;
  sendChatMessage: (prompt: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial State
  messages: [],
  loading: false,
  typing: false,
  visualizationLoading: false,

  conversations: [],
  activeConversationId: null,
  conversationsLoading: false,
  toastMessage: null,

  // Actions
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearMessages: () =>
    set({
      messages: [],
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setTyping: (typing) =>
    set({
      typing,
    }),

  setVisualizationLoading: (loading) =>
    set({
      visualizationLoading: loading,
    }),

  setToastMessage: (toastMessage) => set({ toastMessage }),

  // Extended API Actions
  fetchConversations: async () => {
    set({ conversationsLoading: true });
    try {
      const conversations = await getConversationsApi();
      set({ conversations, conversationsLoading: false });

      if (conversations.length > 0) {
        const savedId = sessionStorage.getItem("activeConversationId");
        const parsedId = savedId ? parseInt(savedId, 10) : null;
        const exists = parsedId && conversations.some((c) => c.id === parsedId);

        const targetId = exists ? parsedId! : conversations[0].id;
        await get().selectConversation(targetId);
      } else {
        set({ activeConversationId: null, messages: [] });
        sessionStorage.removeItem("activeConversationId");
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      set({ conversationsLoading: false });
    }
  },

  selectConversation: async (id: number) => {
    set({ activeConversationId: id, loading: true });
    sessionStorage.setItem("activeConversationId", id.toString());
    try {
      const apiMessages = await getMessagesApi(id);
      const formattedMessages: ChatMessage[] = apiMessages.map((msg) => ({
        id: msg.id.toString(),
        sender: msg.role.toLowerCase() === "user" ? "user" : "ai",
        message: msg.content,
        timestamp: msg.created_at
          ? new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date().toLocaleTimeString(),
      }));
      set({ messages: formattedMessages, loading: false });
    } catch (err) {
      console.error("Failed to load conversation messages:", err);
      set({ loading: false });
    }
  },

  createNewConversation: async (userId: number = 1) => {
    try {
      const newConv = await createConversationApi(userId);
      set((state) => ({
        conversations: [newConv, ...state.conversations],
        activeConversationId: newConv.id,
        messages: [],
      }));
      sessionStorage.setItem("activeConversationId", newConv.id.toString());
      get().setToastMessage("New conversation created");
      setTimeout(() => get().setToastMessage(null), 3000);
      return newConv.id;
    } catch (err) {
      console.error("Failed to create conversation:", err);
      return null;
    }
  },

  deleteConversation: async (id: number) => {
    try {
      await deleteConversationApi(id);
      const remainingConvs = get().conversations.filter((c) => c.id !== id);

      set({ conversations: remainingConvs });

      if (get().activeConversationId === id) {
        if (remainingConvs.length > 0) {
          const nextConv = remainingConvs[0];
          await get().selectConversation(nextConv.id);
        } else {
          set({ activeConversationId: null, messages: [] });
          sessionStorage.removeItem("activeConversationId");
        }
      }

      get().setToastMessage("Conversation deleted successfully");
      setTimeout(() => get().setToastMessage(null), 3000);
      return true;
    } catch (err) {
      console.error("Failed to delete conversation:", err);
      get().setToastMessage("Failed to delete conversation");
      setTimeout(() => get().setToastMessage(null), 3000);
      return false;
    }
  },

  sendChatMessage: async (prompt: string) => {
    if (!prompt.trim()) return;

    let convId = get().activeConversationId;

    if (!convId) {
      convId = await get().createNewConversation();
      if (!convId) return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      message: prompt,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    get().addMessage(userMessage);
    set({ typing: true, visualizationLoading: true });

    try {
      const chatResponse = await sendChatApi({
        conversation_id: convId,
        prompt,
      });

      const replyContent =
        chatResponse.response ||
        chatResponse.explanation ||
        (chatResponse.query?.sql ? `SQL Generated: ${chatResponse.query.sql}` : null) ||
        (chatResponse.query?.result ? JSON.stringify(chatResponse.query.result, null, 2) : null) ||
        (typeof chatResponse === "string" ? chatResponse : JSON.stringify(chatResponse));

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        message: replyContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      get().addMessage(aiMessage);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        message: "Sorry, there was an error processing your query.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      get().addMessage(errorMessage);
    } finally {
      set({ typing: false, visualizationLoading: false });
    }
  },
}));