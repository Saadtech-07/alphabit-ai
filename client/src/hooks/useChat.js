import { useCallback } from "react";
import { useChatContext } from "../context/ChatContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { generateChatTitle } from "../utils/generateChatTitle.js";
import {
  normalizeChat,
  messagesToAPI,
  messagesToHistory,
} from "../utils/chatHelpers.js";
import {
  generateAIResponse,
  createChat,
  updateChat,
  deleteChat as deleteChatApi,
  fetchChatById,
} from "../services/chatService.js";

export function useChat() {
  const {
    currentChat,
    currentChatId,
    messages,
    isTyping,
    chats,
    dispatch,
  } = useChatContext();
  const { isAuthenticated } = useAuth();

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const isNewChat = !currentChatId;
      const activeChatId = isNewChat ? crypto.randomUUID() : currentChatId;

      dispatch({
        type: "START_AI_RESPONSE",
        payload: isNewChat
          ? { userText: trimmed, chatId: activeChatId }
          : { userText: trimmed },
      });

      try {
        const history = messagesToHistory(currentChat?.messages ?? []);
        const response = await generateAIResponse(trimmed, history);

        dispatch({
          type: "UPDATE_LAST_MESSAGE",
          payload: { content: response, chatId: activeChatId },
        });

        if (isAuthenticated) {
          const finalMessages = [
            { role: "user", content: trimmed, liked: false },
            { role: "assistant", content: response, liked: false },
          ];

          if (isNewChat) {
            const created = await createChat({
              title: generateChatTitle(trimmed),
              messages: messagesToAPI(finalMessages),
            });
            dispatch({
              type: "REPLACE_CHAT_ID",
              payload: {
                tempId: activeChatId,
                chat: normalizeChat(created),
              },
            });
          } else {
            const allMessages = [
              ...currentChat.messages,
              ...finalMessages,
            ];
            await updateChat(activeChatId, {
              messages: messagesToAPI(allMessages),
            });
          }
        }
      } catch (error) {
        const errorText =
          error.response?.data?.message ||
          error.message ||
          "Sorry — something went wrong. Please try again.";

        dispatch({
          type: "UPDATE_LAST_MESSAGE",
          payload: { content: errorText, chatId: activeChatId },
        });
      } finally {
        dispatch({ type: "SET_TYPING", payload: false });
      }
    },
    [currentChat, currentChatId, isTyping, isAuthenticated, dispatch]
  );

  const regenerateLastResponse = useCallback(async () => {
    if (!currentChat || !currentChatId || isTyping) return;

    const chatMessages = currentChat.messages;
    const lastAssistantIdx = [...chatMessages]
      .map((m, i) => ({ m, i }))
      .reverse()
      .find(({ m }) => m.role === "assistant")?.i;

    if (lastAssistantIdx === undefined) return;

    let userPrompt = "";
    for (let i = lastAssistantIdx - 1; i >= 0; i--) {
      if (chatMessages[i].role === "user") {
        userPrompt = chatMessages[i].content;
        break;
      }
    }
    if (!userPrompt) return;

    dispatch({ type: "REMOVE_LAST_MESSAGE", payload: currentChatId });
    dispatch({ type: "ADD_ASSISTANT_PLACEHOLDER" });

    try {
      const history = messagesToHistory(
        chatMessages.slice(0, lastAssistantIdx - 1)
      );
      const response = await generateAIResponse(userPrompt, history);
      dispatch({
        type: "UPDATE_LAST_MESSAGE",
        payload: { content: response },
      });

      if (isAuthenticated) {
        const updatedMessages = [
          ...chatMessages.slice(0, lastAssistantIdx),
          { role: "assistant", content: response, liked: false },
        ];
        await updateChat(currentChatId, {
          messages: messagesToAPI(updatedMessages),
        });
      }
    } catch (error) {
      dispatch({
        type: "UPDATE_LAST_MESSAGE",
        payload: {
          content:
            error.message ||
            "Sorry — something went wrong. Please try again.",
        },
      });
    } finally {
      dispatch({ type: "SET_TYPING", payload: false });
    }
  }, [currentChat, currentChatId, isTyping, isAuthenticated, dispatch]);

  const toggleLike = useCallback(
    async (messageId) => {
      if (!currentChatId || !currentChat) return;

      dispatch({
        type: "TOGGLE_LIKE",
        payload: { chatId: currentChatId, messageId },
      });

      if (isAuthenticated) {
        const updatedMessages = currentChat.messages.map((m) =>
          m.id === messageId ? { ...m, liked: !m.liked } : m
        );
        try {
          await updateChat(currentChatId, {
            messages: messagesToAPI(updatedMessages),
          });
        } catch {
          dispatch({
            type: "TOGGLE_LIKE",
            payload: { chatId: currentChatId, messageId },
          });
        }
      }
    },
    [currentChat, currentChatId, isAuthenticated, dispatch]
  );

  const newChat = useCallback(() => {
    dispatch({ type: "NEW_CHAT" });
  }, [dispatch]);

  const selectChat = useCallback(
    async (id) => {
      dispatch({ type: "SELECT_CHAT", payload: id });

      if (isAuthenticated) {
        try {
          const chat = await fetchChatById(id);
          dispatch({ type: "UPDATE_CHAT", payload: normalizeChat(chat) });
        } catch {
          dispatch({ type: "DELETE_CHAT", payload: id });
        }
      }
    },
    [isAuthenticated, dispatch]
  );

  const deleteChat = useCallback(
    async (id) => {
      if (isAuthenticated) {
        try {
          await deleteChatApi(id);
        } catch {
          return;
        }
      }
      dispatch({ type: "DELETE_CHAT", payload: id });
    },
    [isAuthenticated, dispatch]
  );

  const togglePin = useCallback(
    async (id) => {
      const target = chats.find((c) => c.id === id);
      if (!target) return;

      const newPinned = !target.pinned;
      dispatch({ type: "TOGGLE_PIN", payload: id });

      if (isAuthenticated) {
        try {
          await updateChat(id, { pinned: newPinned });
        } catch {
          dispatch({ type: "TOGGLE_PIN", payload: id });
        }
      }
    },
    [chats, isAuthenticated, dispatch]
  );

  const setSearchQuery = useCallback(
    (query) => dispatch({ type: "SET_SEARCH_QUERY", payload: query }),
    [dispatch]
  );

  const setSidebarOpen = useCallback(
    (open) => dispatch({ type: "SET_SIDEBAR_OPEN", payload: open }),
    [dispatch]
  );

  const setSidebarCollapsed = useCallback(
    (collapsed) =>
      dispatch({ type: "SET_SIDEBAR_COLLAPSED", payload: collapsed }),
    [dispatch]
  );

  return {
    currentChat,
    messages,
    isTyping,
    sendMessage,
    regenerateLastResponse,
    toggleLike,
    newChat,
    selectChat,
    deleteChat,
    togglePin,
    setSearchQuery,
    setSidebarOpen,
    setSidebarCollapsed,
  };
}
