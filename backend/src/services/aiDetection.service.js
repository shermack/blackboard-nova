import mammoth from "mammoth";
import pdfParse from "pdf-parse";

const aiPhrases = [
  "in conclusion",
  "delve into",
  "moreover",
  "furthermore",
  "it is important to note",
  "in today's world"
];

export const extractTextFromBuffer = async (file) => {
  if (file.mimetype === "application/pdf") {
    const result = await pdfParse(file.buffer);
    return result.text;
  }

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  return "";
};

export const estimateAiScore = (text) => {
  const safeText = (text || "").toLowerCase();
  if (!safeText.trim()) {
    return 0;
  }

  const phraseHits = aiPhrases.reduce(
    (count, phrase) => count + (safeText.includes(phrase) ? 1 : 0),
    0
  );
  const sentenceCount = safeText.split(/[.!?]/).filter(Boolean).length || 1;
  const averageSentenceLength = safeText.split(/\s+/).length / sentenceCount;
  const score = phraseHits * 12 + Math.max(0, averageSentenceLength - 20) * 1.8;

  return Math.min(100, Number(score.toFixed(2)));
};
