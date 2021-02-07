/* eslint-disable max-classes-per-file */

// We use BigInt here.
// Will fallback to Number if not support.
const supportBigInt = typeof BigInt !== 'undefined';

/**
 * Format string number to readable number
 */
function trimNumber(numStr: string) {
  const negative = numStr.startsWith('-');

  let str = negative ? numStr.slice(1) : numStr;

  str = str
    // Remove decimal 0. `1.1000` => `1.1`, `1.0` => `1`
    .replace(/\.?0+$/, '')
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

function num2str(number: number): string {
  return trimNumber(number.toFixed(100)).fullStr;
}

/**
 * Return inverse index. `123456` + `5` = 1
 */
function reverseIndexOf(str: string, char: string) {
  for (let i = 0; i < str.length; i += 1) {
    if (str[str.length - 1 - i] === char) {
      return i;
    }
  }
  return -1;
}

function hydrateDecimal(num: bigint, decimalPos: number): string {
  const valueStr = num.toString();

  if (decimalPos === -1) {
    return valueStr;
  }

  // With decimal
  const negative = valueStr.startsWith('-');
  let splitStr = negative ? valueStr.slice(1) : valueStr;

  // Fill 0 for slice
  splitStr = splitStr.padStart(decimalPos + 1, '0');

  const integer = splitStr.slice(0, -decimalPos);
  const decimal = splitStr.slice(-decimalPos);

  const fullNumber = trimNumber(`${integer}.${decimal}`).fullStr;

  return `${negative ? '-' : ''}${fullNumber}`;
}

export class NumberDecimal {
  number: number;

  constructor(value: string | number) {
    this.number = Number(value);
  }

  add(value: string | number) {
    return new NumberDecimal(this.number + Number(value));
  }

  toString() {
    return num2str(this.number);
  }
}

export class BigIntDecimal {
  number: bigint;

  //  12345.6789012345
  //       |-- pos --|
  decimalPos: number;

  constructor(value: string | number) {
    const trimRet = trimNumber(typeof value === 'string' ? value : num2str(value));
    this.decimalPos = reverseIndexOf(trimRet.trimStr, '.');
    this.number = BigInt(trimRet.trimStr.replace('.', '')) * BigInt(trimRet.negative ? -1 : 1);
  }

  private alignDecimal(decimalPos: number) {
    if (this.decimalPos === decimalPos) {
      return this.number;
    }

    return this.number * BigInt(10 ** (decimalPos - this.decimalPos));
  }

  add(value: string | number) {
    const offset = new BigIntDecimal(value);
    const maxDecimalPos = Math.max(this.decimalPos, offset.decimalPos);
    const value1 = this.alignDecimal(maxDecimalPos);
    const value2 = offset.alignDecimal(maxDecimalPos);

    const mergedValue = value1 + value2;

    return new BigIntDecimal(hydrateDecimal(mergedValue, maxDecimalPos));
  }

  toString() {
    return hydrateDecimal(this.number, this.decimalPos);
  }
}

const ExportDecimal = supportBigInt ? BigIntDecimal : NumberDecimal;

export default ExportDecimal;
