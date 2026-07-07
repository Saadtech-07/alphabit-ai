import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { generateChatTitle } from "../utils/generateChatTitle.js";
import { normalizeChat } from "../utils/chatHelpers.js";
import { fetchChats } from "../services/chatService.js";
import { useAuth } from "../hooks/useAuth.js";
import { STORAGE_KEYS } from "../utils/constants.js";

export const createMessage = (role, content) => ({
  id: crypto.randomUUID(),
  role,
  content,
  liked: false,
  createdAt: Date.now(),
});

const initialState = {
  chats: [],
  currentChatId: null,
  draftChat: { messages: [] },
  sidebarOpen: false,
  sidebarCollapsed: false,
  searchQuery: "",
  isTyping: false,
  isLoadingChats: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "CLEAR_ALL":
      return { ...initialState };

    case "SET_LOADING_CHATS":
      return { ...state, isLoadingChats: action.payload };

    case "LOAD_CHATS":
      return {
        ...state,
        chats: action.payload,
        currentChatId: null,
        draftChat: { messages: [] },
        isLoadingChats: false,
      };

    case "UPSERT_CHAT":
      return {
        ...state,
        chats: [
          action.payload,
          ...state.chats.filter((c) => c.id !== action.payload.id),
        ],
      };

    case "UPDATE_CHAT":
      return {
        ...state,
        chats: state.chats.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };

    case "SET_SIDEBAR_OPEN":
      return { ...state, sidebarOpen: action.payload };

    case "SET_SIDEBAR_COLLAPSED":
      return { ...state, sidebarCollapsed: action.payload };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    case "SET_TYPING":
      return { ...state, isTyping: action.payload };

    case "SELECT_CHAT":
      return {
        ...state,
        currentChatId: action.payload,
        draftChat: { messages: [] },
        sidebarOpen: false,
      };

    case "NEW_CHAT":
      return {
        ...state,
        currentChatId: null,
        draftChat: { messages: [] },
        sidebarOpen: false,
      };

    case "DELETE_CHAT": {
      const filtered = state.chats.filter((c) => c.id !== action.payload);
      const wasCurrent = state.currentChatId === action.payload;

      return {
        ...state,
        chats: filtered,
        currentChatId: wasCurrent ? null : state.currentChatId,
        draftChat: wasCurrent ? { messages: [] } : state.draftChat,
      };
    }

    case "TOGGLE_PIN": {
      const chats = state.chats.map((c) =>
        c.id === action.payload ? { ...c, pinned: !c.pinned } : c
      );
      return { ...state, chats };
    }

    case "START_AI_RESPONSE": {
      const { userText } = action.payload;
      const userMessage = createMessage("user", userText);
      let chatId = state.currentChatId;
      let chats = state.chats;

      if (chatId === null) {
        chatId = action.payload.chatId || crypto.randomUUID();
        const chat = {
          id: chatId,
          title: generateChatTitle(userText),
          messages: [userMessage],
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        chats = [chat, ...state.chats];
      } else {
        chats = chats.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: [...c.messages, userMessage],
                updatedAt: Date.now(),
              }
            : c
        );
      }

      const assistantMessage = createMessage("assistant", "");
      chats = chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [...c.messages, assistantMessage],
              updatedAt: Date.now(),
            }
          : c
      );

      return {
        ...state,
        chats,
        currentChatId: chatId,
        draftChat: { messages: [] },
        isTyping: true,
      };
    }

    case "REPLACE_CHAT_ID": {
      const { tempId, chat } = action.payload;
      const chats = state.chats.map((c) => (c.id === tempId ? chat : c));
      return {
        ...state,
        chats,
        currentChatId: chat.id,
      };
    }

    case "UPDATE_LAST_MESSAGE": {
      const chatId = action.payload.chatId ?? state.currentChatId;
      if (!chatId) return state;
      const { content } = action.payload;
      const chats = state.chats.map((c) => {
        if (c.id !== chatId) return c;
        const messages = [...c.messages];
        const last = messages[messages.length - 1];
        if (last) messages[messages.length - 1] = { ...last, content };
        return { ...c, messages, updatedAt: Date.now() };
      });
      return { ...state, chats };
    }

    case "REMOVE_LAST_MESSAGE": {
      const chatId = action.payload ?? state.currentChatId;
      if (!chatId) return state;
      const chats = state.chats.map((c) => {
        if (c.id !== chatId) return c;
        return { ...c, messages: c.messages.slice(0, -1) };
      });
      return { ...state, chats };
    }

    case "ADD_ASSISTANT_PLACEHOLDER": {
      const chatId = state.currentChatId;
      if (!chatId) return state;
      const assistantMessage = createMessage("assistant", "");
      const chats = state.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [...c.messages, assistantMessage],
              updatedAt: Date.now(),
            }
          : c
      );
      return { ...state, chats, isTyping: true };
    }

    case "TOGGLE_LIKE": {
      const { chatId, messageId } = action.payload;
      const chats = state.chats.map((c) => {
        if (c.id !== chatId) return c;
        const messages = c.messages.map((m) =>
          m.id === messageId ? { ...m, liked: !m.liked } : m
        );
        return { ...c, messages };
      });
      return { ...state, chats };
    }

    default:
      return state;
  }
}

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadUserChats = useCallback(async () => {
    dispatch({ type: "SET_LOADING_CHATS", payload: true });
    try {
      const chats = await fetchChats();
      dispatch({
        type: "LOAD_CHATS",
        payload: chats.map((c) => normalizeChat({ ...c, messages: [] })),
      });
    } catch {
      dispatch({ type: "LOAD_CHATS", payload: [] });
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem(STORAGE_KEYS.CHATS);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserChats();
    } else {
      dispatch({ type: "CLEAR_ALL" });
    }
  }, [isAuthenticated, user?.id, loadUserChats]);

  const currentChat = useMemo(() => {
    if (!state.currentChatId) return null;
    return state.chats.find((c) => c.id === state.currentChatId) ?? null;
  }, [state.chats, state.currentChatId]);

  const messages = useMemo(() => {
    if (state.currentChatId) {
      return currentChat?.messages ?? [];
    }
    return state.draftChat.messages;
  }, [state.currentChatId, currentChat, state.draftChat.messages]);

  const visibleChats = useMemo(() => {
    return state.chats.filter(
      (c) => c.messages.length > 0 || (isAuthenticated && c.title)
    );
  }, [state.chats, isAuthenticated]);

  const filteredChats = useMemo(() => {
    const q = state.searchQuery.toLowerCase().trim();
    if (!q) return visibleChats;
    return visibleChats.filter((c) => c.title.toLowerCase().includes(q));
  }, [visibleChats, state.searchQuery]);

  const pinnedChats = filteredChats.filter((c) => c.pinned);
  const recentChats = filteredChats
    .filter((c) => !c.pinned)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const value = {
    ...state,
    currentChat,
    messages,
    pinnedChats,
    recentChats,
    dispatch,
    createMessage,
    loadUserChats,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}
