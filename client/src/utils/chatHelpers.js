export function normalizeMessage(message) {
  return {
    id: message._id?.toString() || message.id || crypto.randomUUID(),
    role: message.role,
    content: message.content,
    liked: message.liked || false,
    createdAt: message.createdAt
      ? new Date(message.createdAt).getTime()
      : Date.now(),
  };
}

export function normalizeChat(chat) {
  return {
    id: chat._id?.toString() || chat.id,
    userId: chat.userId?.toString() || chat.user?.toString(),
    title: chat.title,
    messages: (chat.messages || []).map(normalizeMessage),
    pinned: chat.pinned || false,
    createdAt: chat.createdAt
      ? new Date(chat.createdAt).getTime()
      : Date.now(),
    updatedAt: chat.updatedAt
      ? new Date(chat.updatedAt).getTime()
      : Date.now(),
  };
}

export function messagesToAPI(messages) {
  return messages.map(({ role, content, liked }) => ({
    role,
    content,
    liked: liked || false,
  }));
}

export function messagesToHistory(messages) {
  return messages
    .filter((m) => m.content?.trim())
    .map(({ role, content }) => ({ role, content: content.trim() }));
}
