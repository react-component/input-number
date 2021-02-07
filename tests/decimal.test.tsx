import MiniDecimal from '../src/utils/MiniDecimal';

describe('InputNumber.Decimal', () => {
  it('parse', () => {
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
  });

  it('add', () => {
    expect(new MiniDecimal('1128').add('9.3').toString()).toEqual('1137.3');
  });
});
