import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, GEMINI_MODEL } from "../config/aiPrompt.js";

let client = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to server/.env from Google AI Studio."
    );
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }

  return client;
}

function toGeminiRole(role) {
  return role === "assistant" ? "model" : "user";
}

function buildContents(prompt, history = []) {
  const contents = [];

  for (const message of history) {
    if (!message?.content?.trim()) continue;
    contents.push({
      role: toGeminiRole(message.role),
      parts: [{ text: message.content.trim() }],
    });
  }

  contents.push({
    role: "user",
    parts: [{ text: prompt.trim() }],
  });

  return contents;
}

export async function generateGeminiResponse(prompt, history = []) {
  const ai = getClient();

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildContents(prompt, history),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const text = response.text;

    if (!text?.trim()) {
      throw new Error("No response received from AI");
    }

    return text;
  } catch (error) {
    const message = error.message || "Failed to generate AI response";

    if (message.toLowerCase().includes("api key")) {
      throw new Error(
        "Invalid Gemini API key. Copy your key from Google AI Studio (https://aistudio.google.com/apikey) into GEMINI_API_KEY in server/.env, then restart the server."
      );
    }

    if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED")) {
      throw new Error(
        "Gemini API quota exceeded. Wait a minute and try again, or enable billing in Google AI Studio."
      );
    }

    throw new Error(message);
  }
}
