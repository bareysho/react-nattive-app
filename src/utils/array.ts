export const sliceIntoChunks = <T>(arr: T[], chunkSize: number): T[][] => {
  const res = [];

  for (let i = 0; i < arr.length; i = i + chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }

  return res;
};
