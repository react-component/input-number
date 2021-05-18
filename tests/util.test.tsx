import getMiniDecimal, {
  BigIntDecimal,
  DecimalClass,
  NumberDecimal,
  ValueType,
  toFixed,
} from '../src/utils/MiniDecimal';

jest.mock('../src/utils/supportUtil');
const { supportBigInt } = require('../src/utils/supportUtil');

describe('InputNumber.Util', () => {
  beforeEach(() => {
    supportBigInt.mockImplementation(() => {
      return true;
    });
  });

  afterEach(() => {
    supportBigInt.mockRestore();
  });

  const classList: {
    name: string;
    getDecimal: (value: ValueType) => DecimalClass;
    mockSupportBigInt?: boolean;
  }[] = [
    { name: 'Default', getDecimal: getMiniDecimal },
    { name: 'BigInt', getDecimal: (value: ValueType) => new BigIntDecimal(value) },
    {
      name: 'Number',
      getDecimal: (value: ValueType) => new NumberDecimal(value),
      mockSupportBigInt: false,
    },
  ];

  classList.forEach(({ name, getDecimal, mockSupportBigInt }) => {
    describe(name, () => {
      beforeEach(() => {
        supportBigInt.mockImplementation(() => {
          return mockSupportBigInt !== false;
        });
      });

      afterEach(() => {
        supportBigInt.mockRestore();
      });

      it('parse', () => {
        expect(getDecimal(100).toString()).toEqual('100');
        expect(getDecimal(11).toString()).toEqual('11');
        expect(getDecimal(-9).toString()).toEqual('-9');
        expect(getDecimal('11.28').toString()).toEqual('11.28');
        expect(getDecimal('-9.3').toString()).toEqual('-9.3');
        expect(getDecimal(1e-19).toString()).toEqual('0.0000000000000000001');
        expect(getDecimal(-1e-19).toString()).toEqual('-0.0000000000000000001');
        expect(getDecimal('-0').toString()).toEqual('0');
        expect(getDecimal('.1').toString()).toEqual('0.1');
        expect(getDecimal('1.').toString()).toEqual('1');
      });

      it('invalidate', () => {
        expect(getDecimal('abc').toString()).toEqual('');
      });

      it('add', () => {
        expect(getDecimal('1128').add('9.3').toString()).toEqual('1137.3');
        expect(getDecimal(1128).add(93).toString()).toEqual('1221');
        expect(getDecimal('1.35').add('2.65').toString()).toEqual('4');
        expect(getDecimal('0.1').add('1.1').toString()).toEqual('1.2');

        // Negative
        expect(getDecimal('-1128').add('-9.3').toString()).toEqual('-1137.3');
        expect(getDecimal('11.28').add('-9.3').toString()).toEqual('1.98');
        expect(getDecimal('1128').add('-0.93').toString()).toEqual('1127.07');
        expect(getDecimal('11.28').add('-93').toString()).toEqual('-81.72');
        expect(getDecimal('-11.28').add('9.3').toString()).toEqual('-1.98');

        // Continue update
        let number = getDecimal('2.3');
        number = number.add('-1');
        expect(number.toString()).toEqual('1.3');
        number = number.add('-1');
        expect(number.toString()).toEqual('0.3');

        // mini value
        expect(getDecimal(0).add(-0.000000001).toString()).toEqual('-0.000000001');
      });

      it('toString !safe', () => {
        const invalidate = getDecimal('Invalidate');
        expect(invalidate.toString()).toEqual('');
        expect(invalidate.toString(false)).toEqual('Invalidate');
      });
    });
  });

  describe('NumberDecimal', () => {
    beforeEach(() => {
      supportBigInt.mockImplementation(() => false);
    });

    afterEach(() => {
      supportBigInt.mockRestore();
    });

    it('parse', () => {
      expect(new NumberDecimal('1e24').toString()).toEqual(String(Number.MAX_SAFE_INTEGER));
      expect(new NumberDecimal('-1e+25').toString()).toEqual(String(Number.MIN_SAFE_INTEGER));
    });
  });

  describe('BigIntDecimal', () => {
    it('parse', () => {
      expect(new BigIntDecimal('1e24').toString()).toEqual('999999999999999983222784');
      expect(new BigIntDecimal('1e+25').toString()).toEqual('10000000000000000905969664');
    });

    it('add', () => {
      expect(new BigIntDecimal('11.28').add('0.0903').toString()).toEqual('11.3703');
    });
  });

  describe('toFixed', () => {
    it('less than precision', () => {
      expect(toFixed('1.1', ',', 2)).toEqual('1,10');
      expect(toFixed('1.23', '.', 5)).toEqual('1.23000');
    });

    it('large than precision', () => {
      expect(toFixed('1.234', '.', 2)).toEqual('1.23');
      expect(toFixed('1.235', '.', 2)).toEqual('1.24');
      expect(toFixed('1.238', '.', 2)).toEqual('1.24');

      // Integer
      expect(toFixed('1.238', '.', 0)).toEqual('1');
      expect(toFixed('1.5', '.', 0)).toEqual('2');
    });

    it('empty precision', () => {
      expect(toFixed('1.2', '.')).toEqual('1.2');
      expect(toFixed('1.000', '.')).toEqual('1');
    });

    it('should return "" when input is ""', () => {
      expect(toFixed('', '.')).toEqual('');
    });
  });
});
