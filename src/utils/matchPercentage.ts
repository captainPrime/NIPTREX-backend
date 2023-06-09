import crypto from 'crypto';

/*
|--------------------------------------------------------------------------
| The Jaccard similarity coefficient measures the similarity between 
| two sets by calculating the size of their intersection divided by 
| the size of their union. In the context of comparing two arrays.
|--------------------------------------------------------------------------
*/
export const calculateMatchPercentage = (array1: any, array2: any) => {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  const similarityCoefficient = intersection.size / union.size;
  const matchPercentage = Math.round(similarityCoefficient * 100);

  return matchPercentage;
};

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateAlphaNumeric = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

export const generateTripleDESKey = () => {
  const keySizeBits = 376;
  const keySizeBytes = keySizeBits / 8;

  const key = crypto.randomBytes(keySizeBytes);

  return key.toString('hex');
};
