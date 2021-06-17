import React from 'react';
import { mount } from './util/wrapper';
import InputNumber from '../src';
import KeyCode from 'rc-util/lib/KeyCode';

describe('InputNumber.Formatter', () => {
  it('formatter on default', () => {
    const wrapper = mount(<InputNumber step={1} value={5} formatter={(num) => `$ ${num}`} />);
    expect(wrapper.getInputValue()).toEqual('$ 5');
  });

  it('formatter on mousedown', () => {
    const wrapper = mount(<InputNumber defaultValue={5} formatter={(num) => `$ ${num}`} />);
    wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    expect(wrapper.getInputValue()).toEqual('$ 6');

    wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
    expect(wrapper.getInputValue()).toEqual('$ 5');
  });

  it('formatter on keydown', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <InputNumber defaultValue={5} onChange={onChange} formatter={(num) => `$ ${num} ¥`} />,
    );

    wrapper.focusInput();
    wrapper.findInput().simulate('keyDown', { which: KeyCode.UP });
    expect(wrapper.getInputValue()).toEqual('$ 6 ¥');
    expect(onChange).toHaveBeenCalledWith(6);

    wrapper.findInput().simulate('keyDown', { which: KeyCode.DOWN });
    expect(wrapper.getInputValue()).toEqual('$ 5 ¥');
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('formatter on direct input', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <InputNumber defaultValue={5} formatter={(num) => `$ ${num}`} onChange={onChange} />,
    );

    wrapper.focusInput();
    wrapper.changeValue('100');
    expect(wrapper.getInputValue()).toEqual('$ 100');
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it('formatter and parser', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <InputNumber
        defaultValue={5}
        formatter={(num) => `$ ${num} boeing 737`}
        parser={(num) => num.toString().split(' ')[1]}
        onChange={onChange}
      />,
    );

    wrapper.focusInput();
    wrapper.findInput().simulate('keyDown', { which: KeyCode.UP });
    expect(wrapper.getInputValue()).toEqual('$ 6 boeing 737');
    expect(onChange).toHaveBeenLastCalledWith(6);

    wrapper.findInput().simulate('keyDown', { which: KeyCode.DOWN });
    expect(wrapper.getInputValue()).toEqual('$ 5 boeing 737');
    expect(onChange).toHaveBeenLastCalledWith(5);

    wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    expect(wrapper.getInputValue()).toEqual('$ 6 boeing 737');
    expect(onChange).toHaveBeenLastCalledWith(6);
  });

  it('control not block user input', () => {
    const Demo = () => {
      const [value, setValue] = React.useState<number>(null);

      return (
        <InputNumber<number>
          value={value}
          onChange={setValue}
          formatter={(num, info) => {
            if (info.userTyping) {
              return info.input;
            }

            return String(num);
          }}
          parser={(num) => Number(num)}
        />
      );
    };

    const wrapper = mount(<Demo />);

    wrapper.changeValue('-');
    wrapper.changeValue('-0');
    expect(wrapper.findInput().props().value).toEqual('-0');

    wrapper.findInput().simulate('blur');
    expect(wrapper.findInput().props().value).toEqual('0');
  });
});
