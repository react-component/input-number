/* eslint-disable max-classes-per-file */

import { num2str, trimNumber, validateNumber } from './numberUtil';

// We use BigInt here.
// Will fallback to Number if not support.
const supportBigInt = typeof BigInt !== 'undefined';

export type ValueType = string | number | undefined;

export interface DecimalClass {
  add: (value: ValueType) => DecimalClass;

  isNaN: () => boolean;

  toNumber: () => number;

  toString: () => string;

  equals: (target: DecimalClass) => boolean;

  lessEquals: (target: DecimalClass) => boolean;

  negate: () => DecimalClass;
}

class NumberDecimal implements DecimalClass {
  number: number;

  constructor(value: ValueType) {
    this.number = !value && value !== 0 ? NaN : Number(value);
  }

  negate() {
    return new NumberDecimal(-this.toNumber());
  }

  add(value: ValueType) {
    return new NumberDecimal(this.number + Number(value));
  }

  isNaN() {
    return Number.isNaN(this.number);
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
    return num2str(this.number);
  }
}

class BigIntDecimal implements DecimalClass {
  negative: boolean;
  integer: bigint;
  decimal: bigint;
  /** BigInt will convert `0009` to `9`. We need record the len of decimal */
  decimalLen: number;
  nan: boolean;

  constructor(value: string | number) {
    // Act like Number convert
    if ((!value && value !== 0) || value === '-') {
      this.nan = true;
      return;
    }

    let mergedValue = value;
    if (typeof mergedValue === 'string' && /^\d+e-\d+$/.test(mergedValue)) {
      mergedValue = Number(mergedValue);
    }

    const trimRet = trimNumber(
      typeof mergedValue === 'string' ? mergedValue : num2str(mergedValue),
    );

    if (validateNumber(trimRet.fullStr)) {
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
    const offset = new BigIntDecimal(value);
    const maxDecimalLength = Math.max(this.getDecimalStr().length, offset.getDecimalStr().length);
    const myAlignedDecimal = this.alignDecimal(maxDecimalLength);
    const offsetAlignedDecimal = offset.alignDecimal(maxDecimalLength);

    const valueStr = (myAlignedDecimal + offsetAlignedDecimal).toString();

    // We need fill string length back to `maxDecimalLength` to avoid parser failed
    const { negative, trimStr } = trimNumber(valueStr);
    const hydrateValueStr = `${negative ? '-' : ''}${trimStr.padStart(maxDecimalLength + 1, '0')}`;

    return new BigIntDecimal(
      `${hydrateValueStr.slice(0, -maxDecimalLength)}.${hydrateValueStr.slice(-maxDecimalLength)}`,
    );
  }

  isNaN() {
    return this.nan;
  }

  equals(target: DecimalClass) {
    return this.toString() === target.toString();
  }

  lessEquals(target: DecimalClass) {
    return this.add(target.negate().toString()).toNumber() <= 0;
  }

  toNumber() {
    return Number(this.toString());
  }

  toString(): string {
    return trimNumber(`${this.getMark()}${this.getIntegerStr()}.${this.getDecimalStr()}`).fullStr;
  }
}

const ExportDecimal = supportBigInt ? BigIntDecimal : NumberDecimal;

export default ExportDecimal;
