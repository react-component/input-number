import React from 'react';
import { mount } from './util/wrapper';
import InputNumber from '../src';

describe('InputNumber.Decimal', () => {
  it('decimal value', () => {
    const wrapper = mount(<InputNumber step={1} value={2.1} />);
    expect(wrapper.find('input').props().value).toEqual('2.1');
  });

  it('decimal defaultValue', () => {
    const wrapper = mount(<InputNumber step={1} defaultValue={2.1} />);
    expect(wrapper.find('input').props().value).toEqual('2.1');
  });

  it('increase and decrease decimal InputNumber by integer step', () => {
    const wrapper = mount(<InputNumber step={1} defaultValue={2.1} />);
    wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    expect(wrapper.find('input').props().value).toEqual('3.1');
    wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
    expect(wrapper.find('input').props().value).toEqual('2.1');
  });

  it('small value and step', () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(0.000000001);

      return (
        <InputNumber
          value={value}
          step={0.000000001}
          min={-10}
          max={10}
          onChange={(newValue) => {
            setValue(newValue);
          }}
        />
      );
    };

    const wrapper = mount(<Demo />);
    expect(wrapper.find('input').props().value).toEqual('0.000000001');

    for (let i = 0; i < 10; i += 1) {
      // plus until change precision
      wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    }

    wrapper.blurInput();
    expect(wrapper.find('input').props().value).toEqual('0.000000011');
  });

  it('small step with integer value', () => {
    const wrapper = mount(<InputNumber step="0.000000001" value={1} />);
    expect(wrapper.find('input').props().value).toEqual('1.000000000');
  });

  it('small step with empty value', () => {
    const wrapper = mount(<InputNumber step={0.1} />);
    expect(wrapper.find('input').props().value).toEqual('');

    wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    expect(wrapper.find('input').props().value).toEqual('0.1');
  });

  it('custom decimal separator', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber decimalSeparator="," onChange={onChange} />);

    wrapper.focusInput();
    wrapper.changeValue('1,1');
    wrapper.blurInput();

    expect(wrapper.find('input').props().value).toEqual('1,1');
    expect(onChange).toHaveBeenCalledWith(1.1);
  });
});
