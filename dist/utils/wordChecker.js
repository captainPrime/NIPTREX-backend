"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsBadWords = void 0;
const badWords = ['fuck', 'motherfucker', 'srupid'];
const containsBadWords = (text) => {
    const lowerText = text.toLowerCase();
    return badWords.some(word => lowerText.includes(word));
};
exports.containsBadWords = containsBadWords;
//# sourceMappingURL=wordChecker.js.map