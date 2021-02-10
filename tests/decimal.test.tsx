import MiniDecimal from '../src/utils/MiniDecimal';

describe('InputNumber.Decimal', () => {
  it('parse', () => {
    expect(new MiniDecimal(100).toString()).toEqual('100');
    expect(new MiniDecimal(11).toString()).toEqual('11');
    expect(new MiniDecimal(-9).toString()).toEqual('-9');
    expect(new MiniDecimal('11.28').toString()).toEqual('11.28');
    expect(new MiniDecimal('-9.3').toString()).toEqual('-9.3');
    expect(new MiniDecimal(1e-19).toString()).toEqual(
      '0.0000000000000000001',
    );
    expect(new MiniDecimal(-1e-19).toString()).toEqual(
      '-0.0000000000000000001',
    );
  });

  it('invalidate', () => {
    expect(new MiniDecimal('.1').toString()).toEqual('');
    expect(new MiniDecimal('abc').toString()).toEqual('');
    expect(new MiniDecimal('1.').toString()).toEqual('');
  });

  it('add', () => {
    expect(new MiniDecimal('1128').add('9.3').toString()).toEqual('1137.3');
    expect(new MiniDecimal('11.28').add('0.0903').toString()).toEqual('11.3703');
    expect(new MiniDecimal(1128).add(93).toString()).toEqual('1221');
    expect(new MiniDecimal('1.35').add('2.65').toString()).toEqual('4');
    expect(new MiniDecimal('0.1').add('1.1').toString()).toEqual('1.2');

    // Negative
    expect(new MiniDecimal('-1128').add('-9.3').toString()).toEqual('-1137.3');
    expect(new MiniDecimal('11.28').add('-9.3').toString()).toEqual('1.98');
    expect(new MiniDecimal('1128').add('-0.93').toString()).toEqual('1127.07');
    expect(new MiniDecimal('11.28').add('-93').toString()).toEqual('-81.72');
    expect(new MiniDecimal('-11.28').add('9.3').toString()).toEqual('-1.98');

    // Continue update
    let number = new MiniDecimal('2.3');
    number = number.add('-1');
    expect(number.toString()).toEqual('1.3');
    number = number.add('-1');
    expect(number.toString()).toEqual('0.3');

    // mini value
    expect(new MiniDecimal(0).add(-0.000000001).toString()).toEqual(
      '-0.000000001',
    );
  });
});
