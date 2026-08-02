import { create } from "zustand";
import type { ChatMessage } from "../types/chat";

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;

  addMessage: (message: ChatMessage) => void;

  clearMessages: () => void;

  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: "1",
      sender: "ai",
      message: "Hello! I'm your AI Database Assistant.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ],

  loading: false,

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
}));