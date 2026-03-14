import natural from "natural";

const tokenizer = new natural.WordTokenizer();

const toVector = (text) => {
  const tokens = tokenizer.tokenize((text || "").toLowerCase());
  const frequencies = new Map();

  tokens.forEach((token) => {
    frequencies.set(token, (frequencies.get(token) || 0) + 1);
  });

  return frequencies;
};

export const cosineSimilarity = (textA, textB) => {
  const vectorA = toVector(textA);
  const vectorB = toVector(textB);
  const terms = new Set([...vectorA.keys(), ...vectorB.keys()]);

  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  terms.forEach((term) => {
    const a = vectorA.get(term) || 0;
    const b = vectorB.get(term) || 0;
    dot += a * b;
    magnitudeA += a ** 2;
    magnitudeB += b ** 2;
  });

  if (!magnitudeA || !magnitudeB) {
    return 0;
  }

  return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};
