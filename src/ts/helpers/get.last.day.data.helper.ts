const getLastData = (data: number[]): number => {
  const lastTwoDataItems: number[] = data.slice(Math.max(data.length - 2, 0));

  return lastTwoDataItems.reduce((prev, next) => next - prev, 0);
};

export default getLastData;
