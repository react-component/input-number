import MiniDecimal from '../src/utils/MiniDecimal';

describe('InputNumber.Decimal', () => {
  it('parse', () => {
    expect(new MiniDecimal(100).toString()).toEqual('100');
    expect(new MiniDecimal(11).toString()).toEqual('11');
    expect(new MiniDecimal(-9).toString()).toEqual('-9');
    expect(new MiniDecimal('11.28').toString()).toEqual('11.28');
    expect(new MiniDecimal('-9.3').toString()).toEqual('-9.3');
    expect(new MiniDecimal(1e-19).toString()).toEqual(
      '0.0000000000000000000999999999999999975245926835260131855729159055676881799265554029432223615003749728',
    );
    expect(new MiniDecimal(-1e-19).toString()).toEqual(
      '-0.0000000000000000000999999999999999975245926835260131855729159055676881799265554029432223615003749728',
    );
    expect(new MiniDecimal('.1').toString()).toEqual('0.1');
    expect(new MiniDecimal('1.').toString()).toEqual('1');
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
      '-0.0000000010000000000000000622815914577798564188970686927859787829220294952392578125',
    );
  });
});
