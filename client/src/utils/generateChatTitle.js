const STOP_WORDS = new Set([
  "a", "an", "the", "me", "about", "explain", "tell", "create", "generate",
  "what", "how", "why", "is", "are", "please", "can", "you", "give", "show",
  "describe", "write", "list", "make", "help", "with", "for", "my", "i",
  "want", "need", "some", "any", "of", "to", "in", "on", "and", "or",
]);

const SINGLE_TITLE_TAILS = new Set([
  "questions", "question", "ideas", "idea",
]);

const ADJECTIVES = new Set(["changing", "preparation"]);

function capitalize(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function generateChatTitle(prompt) {
  const words = prompt
    .trim()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "Chat";

  const meaningful = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
  const src = meaningful.length > 0 ? meaningful : words;

  if (src.length === 1) return capitalize(src[0]);

  if (src.length === 2) {
    return `${capitalize(src[0])} ${capitalize(src[1])}`;
  }

  if (src.length === 3) {
    const middle = src[1].toLowerCase();
    const last = src[2].toLowerCase();

    if (last === "explanation") {
      return `${capitalize(src[0])} ${capitalize(src[1])}`;
    }
    if (ADJECTIVES.has(middle) && SINGLE_TITLE_TAILS.has(last)) {
      return capitalize(src[0]);
    }
    if (ADJECTIVES.has(middle)) {
      return `${capitalize(src[0])} ${capitalize(src[2])}`;
    }
    if (last === "structure" || last === "ideas") {
      return `${capitalize(src[0])} ${capitalize(src[1])}`;
    }
  }

  return `${capitalize(src[0])} ${capitalize(src[1])}`;
}
