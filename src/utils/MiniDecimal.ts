/* eslint-disable max-classes-per-file */

import { isE, num2str, trimNumber, validateNumber } from './numberUtil';

// We use BigInt here.
// Will fallback to Number if not support.
const supportBigInt = typeof BigInt !== 'undefined';

export type ValueType = string | number | undefined;

export interface DecimalClass {
  add: (value: ValueType) => DecimalClass;

  isEmpty: () => boolean;

  isNaN: () => boolean;

  isInvalidate: () => boolean;

  toNumber: () => number;

  toString: () => string;

  equals: (target: DecimalClass) => boolean;

  lessEquals: (target: DecimalClass) => boolean;

  negate: () => DecimalClass;
}

class NumberDecimal implements DecimalClass {
  number: number;
  empty: boolean;

  constructor(value: ValueType) {
    if (!value && value !== 0) {
      this.empty = true;
      return;
    }

    this.number = Number(value);
  }

  negate() {
    return new NumberDecimal(-this.toNumber());
  }

  add(value: ValueType) {
    if (this.isInvalidate()) {
      return new NumberDecimal(value);
    }
    return new NumberDecimal(this.number + Number(value));
  }

  isEmpty() {
    return this.isEmpty();
  }

  isNaN() {
    return Number.isNaN(this.number);
  }

  isInvalidate() {
    return !this.isEmpty() && !this.isNaN();
  }

  equals(target: DecimalClass) {
    return this.toString() === target.toString();
  }

  lessEquals(target: DecimalClass) {
    return this.add(target.negate().toString()).toNumber() <= 0;
  }

  toNumber() {
    return this.number;
  }

  toString() {
    if (this.isInvalidate()) {
      return '';
    }

    return num2str(this.number);
  }
}

class BigIntDecimal implements DecimalClass {
  negative: boolean;
  integer: bigint;
  decimal: bigint;
  /** BigInt will convert `0009` to `9`. We need record the len of decimal */
  decimalLen: number;
  empty: boolean;
  nan: boolean;

  constructor(value: string | number) {
    if (!value && value !== 0) {
      this.empty = true;
      return;
    }

    // Act like Number convert
    if (value === '-') {
      this.nan = true;
      return;
    }

    let mergedValue = value;

    // We need convert back to Number since it require `toFixed` to handle this
    if (isE(mergedValue)) {
      mergedValue = Number(mergedValue);
    }

    mergedValue = typeof mergedValue === 'string' ? mergedValue : num2str(mergedValue);

    if (validateNumber(mergedValue)) {
      const trimRet = trimNumber(mergedValue);
      this.negative = trimRet.negative;
      const numbers = trimRet.trimStr.split('.');
      this.integer = BigInt(numbers[0]);
      const decimalStr = numbers[1] || '0';
      this.decimal = BigInt(decimalStr);
      this.decimalLen = decimalStr.length;
    } else {
      this.nan = true;
    }
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

  negate() {
    const clone = new BigIntDecimal(this.toString());
    clone.negative = !clone.negative;
    return clone;
  }

  add(value: ValueType): BigIntDecimal {
    if (this.isInvalidate()) {
      return new BigIntDecimal(value);
    }

    const offset = new BigIntDecimal(value);
    if (offset.isInvalidate()) {
      return this;
    }

    const maxDecimalLength = Math.max(this.getDecimalStr().length, offset.getDecimalStr().length);
    const myAlignedDecimal = this.alignDecimal(maxDecimalLength);
    const offsetAlignedDecimal = offset.alignDecimal(maxDecimalLength);

    const valueStr = (myAlignedDecimal + offsetAlignedDecimal).toString();

    // We need fill string length back to `maxDecimalLength` to avoid parser failed
    const { negativeStr, trimStr } = trimNumber(valueStr);
    const hydrateValueStr = `${negativeStr}${trimStr.padStart(maxDecimalLength + 1, '0')}`;

    return new BigIntDecimal(
      `${hydrateValueStr.slice(0, -maxDecimalLength)}.${hydrateValueStr.slice(-maxDecimalLength)}`,
    );
  }

  isEmpty() {
    return this.empty;
  }

  isNaN() {
    return this.nan;
  }

  isInvalidate() {
    return this.isEmpty() || this.isNaN();
  }

  equals(target: DecimalClass) {
    return this.toString() === target.toString();
  }

  lessEquals(target: DecimalClass) {
    return this.add(target.negate().toString()).toNumber() <= 0;
  }

  toNumber() {
    if (this.isNaN()) {
      return NaN;
    }
    return Number(this.toString());
  }

  toString(): string {
    if (this.isInvalidate()) {
      return '';
    }
    return trimNumber(`${this.getMark()}${this.getIntegerStr()}.${this.getDecimalStr()}`).fullStr;
  }
}

const ExportDecimal = supportBigInt ? BigIntDecimal : NumberDecimal;

export default ExportDecimal;
