import api from "./api.js";

export async function generateAIResponse(prompt, history = []) {
  const { data } = await api.post("/chat/ask", { prompt, history });
  return data.reply;
}

export async function fetchChats() {
  const { data } = await api.get("/chats");
  return data.chats;
}

export async function fetchChatById(id) {
  const { data } = await api.get(`/chats/${id}`);
  return data.chat;
}

export async function createChat(payload) {
  const { data } = await api.post("/chats", payload);
  return data.chat;
}

export async function updateChat(id, payload) {
  const { data } = await api.put(`/chats/${id}`, payload);
  return data.chat;
}

export async function deleteChat(id) {
  const { data } = await api.delete(`/chats/${id}`);
  return data;
}
