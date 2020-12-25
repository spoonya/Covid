const calc100kRate = (num: number, population: number): number => {
  return Math.ceil((num * 10e5) / population / 10 || 0);
};

export default calc100kRate;
