import Chat from "../models/Chat.js";

export async function getChats(req, res) {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select("-messages");

    res.json({ chats });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function getChatById(req, res) {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json({ chat });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function createChat(req, res) {
  try {
    const { title, messages = [], pinned = false } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const chat = await Chat.create({
      userId: req.user._id,
      title,
      messages,
      pinned,
    });

    res.status(201).json({ chat });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function updateChat(req, res) {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const { title, messages, pinned } = req.body;

    if (title !== undefined) chat.title = title;
    if (messages !== undefined) chat.messages = messages;
    if (pinned !== undefined) chat.pinned = pinned;

    await chat.save();

    res.json({ chat });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function deleteChat(req, res) {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json({ message: "Chat deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}
