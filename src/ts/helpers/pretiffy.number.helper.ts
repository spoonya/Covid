const prettifyNumber = (num: number): string => {
  const numStr = num.toString();
  const separator = ' ';

  return numStr.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, `$1${separator}`);
};

export default prettifyNumber;
