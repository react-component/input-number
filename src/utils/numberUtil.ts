/**
 * Format string number to readable number
 */
export function trimNumber(numStr: string) {
  const negative = numStr.startsWith('-');

  let str = negative ? numStr.slice(1) : numStr;

  str = str
    // Remove decimal 0. `1.000` => `1.`, `1.100` => `1.1`
    .replace(/(\.\d*[^0])0*$/, '$1')
    // Remove useless decimal. `1.` => `1`
    .replace(/\.0*$/, '')
    // Remove integer 0. `0001` => `1`, 000.1' => `.1`
    .replace(/^0+/, '');

  if (str.startsWith('.')) {
    str = `0${str}`;
  }

  const trimStr = str || '0';

  return {
    negative,
    trimStr,
    fullStr: `${negative ? '-' : ''}${trimStr}`,
  };
}

export function num2str(number: number): string {
  return trimNumber(number.toFixed(100)).fullStr;
}

export function validateNumber(num: string | number) {
  if (typeof num === 'number') {
    return !Number.isNaN(num);
  }

  const { fullStr } = trimNumber(num);
  return /^-?\d+(\.\d+)?$/.test(fullStr);
}
