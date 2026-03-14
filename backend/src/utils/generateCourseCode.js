const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const generateCourseCode = (name) => {
  const prefix = name
    .split(" ")
    .map((word) => word[0] || "")
    .join("")
    .slice(0, 4)
    .toUpperCase();

  let suffix = "";
  for (let index = 0; index < 5; index += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return `${prefix || "CRS"}-${suffix}`;
};
