const badWords = ['fuck', 'motherfucker', 'srupid'];

export const containsBadWords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return badWords.some(word => lowerText.includes(word));
};
