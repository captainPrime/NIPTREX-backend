"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateServiceFee = exports.calculateVAT = exports.generateReferralCode = exports.calculateAverageRating = exports.generateTripleDESKey = exports.generateAlphaNumeric = exports.generateUUID = exports.calculateMatchPercentage = void 0;
const tslib_1 = require("tslib");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
/*
|--------------------------------------------------------------------------
| The Jaccard similarity coefficient measures the similarity between
| two sets by calculating the size of their intersection divided by
| the size of their union. In the context of comparing two arrays.
|--------------------------------------------------------------------------
*/
const calculateMatchPercentage = (array1, array2) => {
    const set1 = new Set(array1);
    const set2 = new Set(array2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    const similarityCoefficient = intersection.size / union.size;
    const matchPercentage = Math.round(similarityCoefficient * 100);
    return matchPercentage;
};
exports.calculateMatchPercentage = calculateMatchPercentage;
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
exports.generateUUID = generateUUID;
const generateAlphaNumeric = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
};
exports.generateAlphaNumeric = generateAlphaNumeric;
const generateTripleDESKey = () => {
    const keySizeBits = 376;
    const keySizeBytes = keySizeBits / 8;
    const key = crypto_1.default.randomBytes(keySizeBytes);
    return key.toString('hex');
};
exports.generateTripleDESKey = generateTripleDESKey;
const calculateAverageRating = (ratings) => {
    const totalRatings = ratings === null || ratings === void 0 ? void 0 : ratings.length;
    const sumRatings = ratings === null || ratings === void 0 ? void 0 : ratings.reduce((total, r) => total + r.rating_value, 0);
    const averageRating = sumRatings / totalRatings;
    return averageRating;
};
exports.calculateAverageRating = calculateAverageRating;
const generateReferralCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
};
exports.generateReferralCode = generateReferralCode;
const calculateVAT = (country) => {
    const lowerCaseCountry = country.toLowerCase();
    switch (lowerCaseCountry) {
        case 'nigeria':
            return 5;
        case 'usa':
            return 5;
        case 'canada':
            return 5;
        case 'uk':
            return 10;
        case 'germany':
            return 10;
        default:
            return 0; // Return 0 if the country is not found
    }
};
exports.calculateVAT = calculateVAT;
const calculateServiceFee = () => {
    return 10;
};
exports.calculateServiceFee = calculateServiceFee;
//# sourceMappingURL=matchPercentage.js.map