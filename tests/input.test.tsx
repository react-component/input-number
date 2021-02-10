import React from 'react';
import { mount } from 'enzyme';
import InputNumber, { InputNumberProps } from '../src';

describe('InputNumber.Input', () => {
  function prepareWrapper(text: string, props?: Partial<InputNumberProps>, skipInputCheck = false) {
    const wrapper = mount(<InputNumber {...props} />);
    wrapper.find('input').simulate('focus');
    for (let i = 0; i < text.length; i += 1) {
      const inputTxt = text.slice(0, i + 1);
      wrapper.find('input').simulate('change', { target: { value: inputTxt } });
    }

    if (!skipInputCheck) {
      expect(wrapper.find('input').props().value).toEqual(text);
    }

    wrapper.find('input').simulate('blur');

    return wrapper;
  }

  it('input valid number', () => {
    const wrapper = prepareWrapper('6');

    expect(wrapper.find('input').props().value).toEqual('6');
  });

  it('input invalid number', () => {
    const wrapper = prepareWrapper('xx');

    expect(wrapper.find('input').props().value).toEqual('');
  });

  it('input invalid string with number', () => {
    const wrapper = prepareWrapper('2x');

    expect(wrapper.find('input').props().value).toEqual('2');
  });

  it('input invalid decimal point with max number', () => {
    const wrapper = prepareWrapper('15.', { max: 10 });
    expect(wrapper.find('input').props().value).toEqual('10');
  });

  it('input invalid decimal point with min number', () => {
    const wrapper = prepareWrapper('3.', { min: 5 });
    expect(wrapper.find('input').props().value).toEqual('5');
  });

  it('input negative symbol', () => {
    const wrapper = prepareWrapper('-');
    expect(wrapper.find('input').props().value).toEqual('');
  });

  it('input negative number', () => {
    const wrapper = prepareWrapper('-98');
    expect(wrapper.find('input').props().value).toEqual('-98');
  });

  // https://github.com/ant-design/ant-design/issues/9439
  it('input negative zero', () => {
    const wrapper = prepareWrapper('-0', {}, true);
    expect(wrapper.find('input').props().value).toEqual('0');
  });
});
