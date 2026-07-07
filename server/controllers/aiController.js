import { generateGeminiResponse } from "../services/geminiService.js";

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (item) =>
        item &&
        (item.role === "user" || item.role === "assistant") &&
        String(item.content || "").trim()
    )
    .map((item) => ({
      role: item.role,
      content: String(item.content).trim(),
    }));
}

export async function ask(req, res) {
  try {
    const { prompt, history } = req.body;

    if (!prompt || !String(prompt).trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const reply = await generateGeminiResponse(
      String(prompt).trim(),
      normalizeHistory(history)
    );

    res.json({ reply });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to generate AI response",
    });
  }
}
