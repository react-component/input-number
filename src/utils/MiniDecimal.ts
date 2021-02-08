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
  negative: boolean;
  integer: bigint;
  decimal: bigint;
  /** BigInt will convert `0009` to `9`. We need record the len of decimal */
  decimalLen: number;

  constructor(value: string | number) {
    const trimRet = trimNumber(typeof value === 'string' ? value : num2str(value));
    this.negative = trimRet.negative;
    const numbers = trimRet.trimStr.split('.');
    this.integer = BigInt(numbers[0]);
    const decimalStr = numbers[1] || '0';
    this.decimal = BigInt(decimalStr);
    this.decimalLen = decimalStr.length;
  }

  private getMark() {
    return this.negative ? '-' : '';
  }

  private getIntegerStr() {
    return this.integer.toString();
  }

  private getDecimalStr() {
    return this.decimal.toString().padStart(this.decimalLen, '0');
  }

  /**
   * Align BigIntDecimal with same decimal length. e.g. 12.3 + 5 = 1230000
   * This is used for add function only.
   */
  private alignDecimal(decimalLength: number): bigint {
    const str = `${this.getMark()}${this.getIntegerStr()}${this.getDecimalStr().padEnd(
      decimalLength,
      '0',
    )}`;
    return BigInt(str);
  }

  add(value: string | number): BigIntDecimal {
    const offset = new BigIntDecimal(value);
    const maxDecimalLength = Math.max(this.getDecimalStr().length, offset.getDecimalStr().length);
    const myAlignedDecimal = this.alignDecimal(maxDecimalLength);
    const offsetAlignedDecimal = offset.alignDecimal(maxDecimalLength);

    const valueStr = (myAlignedDecimal + offsetAlignedDecimal).toString();

    return new BigIntDecimal(
      `${valueStr.slice(0, -maxDecimalLength)}.${valueStr.slice(-maxDecimalLength)}`,
    );
  }

  toString(): string {
    return trimNumber(`${this.getMark()}${this.getIntegerStr()}.${this.getDecimalStr()}`).fullStr;
  }
}

const ExportDecimal = supportBigInt ? BigIntDecimal : NumberDecimal;

export default ExportDecimal;
