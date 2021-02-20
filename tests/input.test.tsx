import React from 'react';
import { mount } from './util/wrapper';
import KeyCode from 'rc-util/lib/KeyCode';
import InputNumber, { InputNumberProps } from '../src';

describe('InputNumber.Input', () => {
  function prepareWrapper(text: string, props?: Partial<InputNumberProps>, skipInputCheck = false) {
    const wrapper = mount(<InputNumber {...props} />);
    wrapper.focusInput();
    for (let i = 0; i < text.length; i += 1) {
      const inputTxt = text.slice(0, i + 1);
      wrapper.changeValue(inputTxt);
    }

    if (!skipInputCheck) {
      expect(wrapper.getInputValue()).toEqual(text);
    }

    wrapper.blurInput();

    return wrapper;
  }

  it('input valid number', () => {
    const wrapper = prepareWrapper('6');

    expect(wrapper.getInputValue()).toEqual('6');
  });

  it('input invalid number', () => {
    const wrapper = prepareWrapper('xx');

    expect(wrapper.getInputValue()).toEqual('');
  });

  it('input invalid string with number', () => {
    const wrapper = prepareWrapper('2x');

    expect(wrapper.getInputValue()).toEqual('2');
  });

  it('input invalid decimal point with max number', () => {
    const wrapper = prepareWrapper('15.', { max: 10 });
    expect(wrapper.getInputValue()).toEqual('10');
  });

  it('input invalid decimal point with min number', () => {
    const wrapper = prepareWrapper('3.', { min: 5 });
    expect(wrapper.getInputValue()).toEqual('5');
  });

  it('input negative symbol', () => {
    const wrapper = prepareWrapper('-');
    expect(wrapper.getInputValue()).toEqual('');
  });

  it('input negative number', () => {
    const wrapper = prepareWrapper('-98');
    expect(wrapper.getInputValue()).toEqual('-98');
  });

  // https://github.com/ant-design/ant-design/issues/9439
  it('input negative zero', () => {
    const wrapper = prepareWrapper('-0', {}, true);
    expect(wrapper.getInputValue()).toEqual('0');
  });

  it('input decimal number with integer step', () => {
    const wrapper = prepareWrapper('1.2', { step: 1.2 });
    expect(wrapper.getInputValue()).toEqual('1.2');
  });

  it('input decimal number with decimal step', () => {
    const wrapper = prepareWrapper('1.2', { step: 0.1 });
    expect(wrapper.getInputValue()).toEqual('1.2');
  });

  it('input empty text and blur', () => {
    const wrapper = prepareWrapper('');
    expect(wrapper.getInputValue()).toEqual('');
  });

  it('blur on default input', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber onChange={onChange} />);
    wrapper.blurInput();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('pressEnter works', () => {
    const onPressEnter = jest.fn();
    const wrapper = mount(<InputNumber onPressEnter={onPressEnter} />);
    wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });
    expect(onPressEnter).toHaveBeenCalled();
  });

  it('empty on blur should trigger null', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber defaultValue="1" onChange={onChange} />);
    wrapper.changeValue('');
    expect(onChange).not.toHaveBeenCalled();

    wrapper.blurInput()
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});
