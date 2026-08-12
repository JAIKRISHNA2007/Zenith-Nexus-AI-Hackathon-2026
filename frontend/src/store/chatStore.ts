import { create } from "zustand";
import type { ChatMessage } from "../types/chat";
import {
  type ConversationResponse,
  getConversationsApi,
  createConversationApi,
  deleteConversationApi,
  getMessagesApi,
} from "../services/api/conversationApi";
import { sendChatApi, type ChatResponse } from "../services/api/chatApi";
import {
  type DatasetInfo,
  getDatasetStatusApi,
  connectSampleDatabaseApi,
  uploadDatasetFileApi,
} from "../services/api/datasetApi";

export interface AppNotification {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface ChatState {
  // Original State
  messages: ChatMessage[];
  loading: boolean;
  typing: boolean;
  visualizationLoading: boolean;
  latestVisualization: ChatResponse | null;

  // Dataset State
  datasetInfo: DatasetInfo | null;
  datasetLoading: boolean;

  // Extended State
  conversations: ConversationResponse[];
  activeConversationId: number | null;
  conversationsLoading: boolean;
  toastMessage: string | null;
  searchQuery: string;

  // Notifications State
  notifications: AppNotification[];
  addNotification: (title: string, message: string, type?: "success" | "error" | "info") => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Actions
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setTyping: (typing: boolean) => void;
  setVisualizationLoading: (loading: boolean) => void;
  setToastMessage: (msg: string | null) => void;
  setSearchQuery: (query: string) => void;

  // API Actions
  fetchConversations: () => Promise<void>;
  selectConversation: (id: number) => Promise<void>;
  createNewConversation: (userId?: number) => Promise<number | null>;
  deleteConversation: (id: number) => Promise<boolean>;
  sendChatMessage: (prompt: string) => Promise<void>;

  // Dataset Actions
  fetchDatasetStatus: () => Promise<void>;
  connectSampleDatabase: () => Promise<void>;
  uploadDatasetFile: (file: File) => Promise<void>;
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
  latestVisualization: null,
  datasetInfo: null,
  datasetLoading: false,
  searchQuery: "",

  notifications: [
    {
      id: "1",
      type: "success",
      title: "BI Dataset Active",
      message: "Connected to Sample E-commerce Database (5 tables available)",
      timestamp: "Just now",
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "Read-Only Safety Engine",
      message: "Analytical SQL validation engine active",
      timestamp: "System",
      read: false,
    },
  ],

  addNotification: (title, message, type = "info") =>
    set((state) => ({
      notifications: [
        {
          id: Date.now().toString(),
          type,
          title,
          message,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          read: false,
        },
        ...state.notifications,
      ],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  clearNotifications: () => set({ notifications: [] }),

  // Actions
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearMessages: () =>
    set({
      messages: [],
      latestVisualization: null,
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

  setSearchQuery: (searchQuery) => set({ searchQuery }),

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
          set({ latestVisualization: null });
        sessionStorage.removeItem("activeConversationId");
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      set({ conversationsLoading: false });
    }
  },

  selectConversation: async (id: number) => {
    set({ activeConversationId: id, loading: true });
    set({ latestVisualization: null });
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
        latestVisualization: null,
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
          set({ activeConversationId: null, messages: [], latestVisualization: null });
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
      if (!convId) {
        get().setToastMessage("Failed to initialize conversation. Please check backend.");
        return;
      }
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

      set({ latestVisualization: chatResponse });

      const replyContent =
        chatResponse.response ||
        chatResponse.explanation ||
        (chatResponse.flowchart
          ? `I've generated a ${chatResponse.flowchart.diagram_type === "er" ? "Entity-Relationship" : chatResponse.flowchart.diagram_type === "decision-tree" ? "Decision Tree" : "Process Flow"} diagram. Check the Visualization panel.`
          : null) ||
        (chatResponse.chart
          ? `I've generated a ${chatResponse.chart.chart_type} chart titled "${chatResponse.chart.title}". Check the Visualization panel for the visual.`
          : null) ||
        (chatResponse.query?.sql ? `SQL Generated:\n${chatResponse.query.sql}` : null) ||
        "I've processed your request. Check the Visualization panel for results.";

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
      get().addNotification("Query Completed", "Generated analytical response and updated visualizations", "success");
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
      get().addNotification("Query Failed", "Failed to process natural language query", "error");
    } finally {
      set({ typing: false, visualizationLoading: false });
    }
  },

  // Dataset Actions
  fetchDatasetStatus: async () => {
    set({ datasetLoading: true });
    try {
      const res = await getDatasetStatusApi();
      const datasetObj = (res as any)?.dataset || res;
      set({ datasetInfo: datasetObj, datasetLoading: false });
    } catch (err) {
      console.error("Failed to fetch dataset status:", err);
      set({ datasetLoading: false });
    }
  },

  connectSampleDatabase: async () => {
    set({ datasetLoading: true });
    try {
      const res = await connectSampleDatabaseApi();
      const datasetObj = (res as any)?.dataset || res;
      set({ datasetInfo: datasetObj, datasetLoading: false });
      get().setToastMessage("Connected to Sample E-commerce Database");
      get().addNotification("Dataset Connected", "Connected to Sample E-commerce Database (5 tables active)", "success");
      setTimeout(() => get().setToastMessage(null), 3000);
    } catch (err) {
      console.error("Failed to connect sample DB:", err);
      set({ datasetLoading: false });
      get().addNotification("Connection Error", "Failed to connect to Sample E-commerce Database", "error");
    }
  },


  uploadDatasetFile: async (file: File) => {
    set({ datasetLoading: true });
    try {
      const res = await uploadDatasetFileApi(file);
      const datasetObj = (res as any)?.dataset || res;
      set({ datasetInfo: datasetObj, datasetLoading: false });
      get().setToastMessage(`Dataset '${file.name}' loaded successfully`);
      get().addNotification("File Uploaded", `Dataset '${file.name}' loaded successfully`, "success");
      setTimeout(() => get().setToastMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to upload dataset:", err);
      set({ datasetLoading: false });
      const msg = err.response?.data?.detail || "Failed to upload dataset file";
      get().setToastMessage(msg);
      get().addNotification("Upload Failed", msg, "error");
      setTimeout(() => get().setToastMessage(null), 4000);
    }
  },
}));