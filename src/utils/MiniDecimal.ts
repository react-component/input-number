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

  negate: () => DecimalClass;
}

export class NumberDecimal implements DecimalClass {
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

  toNumber() {
    return this.number;
  }

  toString() {
    return num2str(this.number);
  }
}

export class BigIntDecimal implements DecimalClass {
  negative: boolean;
  integer: bigint;
  decimal: bigint;
  /** BigInt will convert `0009` to `9`. We need record the len of decimal */
  decimalLen: number;
  nan: boolean;

  constructor(value: string | number) {
    // Act like Number convert
    if (!value && value !== 0) {
      this.nan = true;
      return;
    }

    const trimRet = trimNumber(typeof value === 'string' ? value : num2str(value));

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

    return new BigIntDecimal(
      `${valueStr.slice(0, -maxDecimalLength)}.${valueStr.slice(-maxDecimalLength)}`,
    );
  }

  isNaN() {
    return this.nan;
  }

  equals(target: DecimalClass) {
    return this.toString() === target.toString();
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
