import MiniDecimal, { BigIntDecimal, NumberDecimal } from '../src/utils/MiniDecimal';

describe('InputNumber.Decimal', () => {
  const classList: { name: string; Class: typeof MiniDecimal }[] = [
    { name: 'Default', Class: MiniDecimal },
    { name: 'BigInt', Class: BigIntDecimal },
    { name: 'Number', Class: NumberDecimal },
  ];

  classList.forEach(({ name, Class }) => {
    describe(name, () => {
      it('parse', () => {
        expect(new Class(100).toString()).toEqual('100');
        expect(new Class(11).toString()).toEqual('11');
        expect(new Class(-9).toString()).toEqual('-9');
        expect(new Class('11.28').toString()).toEqual('11.28');
        expect(new Class('-9.3').toString()).toEqual('-9.3');
        expect(new Class(1e-19).toString()).toEqual('0.0000000000000000001');
        expect(new Class(-1e-19).toString()).toEqual('-0.0000000000000000001');
        expect(new Class('-0').toString()).toEqual('0');
        expect(new Class('.1').toString()).toEqual('0.1');
        expect(new Class('1.').toString()).toEqual('1');
      });

      it('invalidate', () => {
        expect(new Class('abc').toString()).toEqual('');
      });

      it('add', () => {
        expect(new Class('1128').add('9.3').toString()).toEqual('1137.3');
        expect(new Class(1128).add(93).toString()).toEqual('1221');
        expect(new Class('1.35').add('2.65').toString()).toEqual('4');
        expect(new Class('0.1').add('1.1').toString()).toEqual('1.2');

        // Negative
        expect(new Class('-1128').add('-9.3').toString()).toEqual('-1137.3');
        expect(new Class('11.28').add('-9.3').toString()).toEqual('1.98');
        expect(new Class('1128').add('-0.93').toString()).toEqual('1127.07');
        expect(new Class('11.28').add('-93').toString()).toEqual('-81.72');
        expect(new Class('-11.28').add('9.3').toString()).toEqual('-1.98');

        // Continue update
        let number = new Class('2.3');
        number = number.add('-1');
        expect(number.toString()).toEqual('1.3');
        number = number.add('-1');
        expect(number.toString()).toEqual('0.3');

        // mini value
        expect(new Class(0).add(-0.000000001).toString()).toEqual('-0.000000001');
      });
    });
  });

  describe('BigIntDecimal', () => {
    it('add', () => {
      expect(new BigIntDecimal('11.28').add('0.0903').toString()).toEqual('11.3703');
    });
  });
});
