/**
 * Format string number to readable number
 */
export function trimNumber(numStr: string) {
  let str = numStr.trim();

  const negative = str.startsWith('-');
  const negativeStr = negative ? '-' : '';

  if (negative) {
    str = str.slice(1);
  }

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
  const splitNumber = trimStr.split('.');

  return {
    negative,
    negativeStr,
    trimStr,
    integerStr: splitNumber[0] || '0',
    decimalStr: splitNumber[1] || '0',
    fullStr: `${negativeStr}${trimStr}`,
  };
}

export function isE(number: string | number) {
  const str = String(number);

  return !Number.isNaN(Number(str)) && str.includes('e');
}

export function num2str(number: number): string {
  const numStr = isE(number) ? number.toFixed(100) : String(number);
  return trimNumber(numStr).fullStr;
}

export function validateNumber(num: string | number) {
  if (typeof num === 'number') {
    return !Number.isNaN(num);
  }

  // Empty
  if (!num) {
    return false;
  }

  return /^\s*-?\d+(\.\d+)?\s*$/.test(num);
}
