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

  return `${matchPercentage}%`;
};
