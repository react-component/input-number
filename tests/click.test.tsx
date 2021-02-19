import React from 'react';
import { mount, ReactWrapper } from './util/wrapper';
import InputNumber, { InputNumberProps } from '../src';

jest.mock('../src/utils/supportUtil');
const { supportBigInt } = require('../src/utils/supportUtil');

describe('InputNumber.Click', () => {
  beforeEach(() => {
    supportBigInt.mockImplementation(() => true);
  });

  afterEach(() => {
    supportBigInt.mockRestore();
  });

  function testInputNumber(
    name: string,
    props: Partial<InputNumberProps>,
    operate: (wrapper: ReactWrapper) => void,
    changedValue: string | number,
    stepType: 'up' | 'down',
  ) {
    it(name, () => {
      const onChange = jest.fn();
      const onStep = jest.fn();
      const wrapper = mount(<InputNumber onChange={onChange} onStep={onStep} {...props} />);
      operate(wrapper);
      expect(onChange).toHaveBeenCalledWith(changedValue);
      expect(onStep).toHaveBeenCalledWith(changedValue, { offset: 1, type: stepType });

      wrapper.unmount();
    });
  }

  describe('basic work', () => {
    testInputNumber(
      'up button',
      { defaultValue: 10 },
      (wrapper) => wrapper.find('.rc-input-number-handler-up').simulate('mouseDown'),
      11,
      'up',
    );

    testInputNumber(
      'down button',
      { value: 10 },
      (wrapper) => wrapper.find('.rc-input-number-handler-down').simulate('mouseDown'),
      9,
      'down',
    );
  });

  describe('empty input', () => {
    testInputNumber(
      'up button',
      {},
      (wrapper) => wrapper.find('.rc-input-number-handler-up').simulate('mouseDown'),
      1,
      'up',
    );

    testInputNumber(
      'down button',
      {},
      (wrapper) => wrapper.find('.rc-input-number-handler-down').simulate('mouseDown'),
      -1,
      'down',
    );
  });

  describe('empty with min & max', () => {
    testInputNumber(
      'up button',
      { min: 6, max: 10 },
      (wrapper) => wrapper.find('.rc-input-number-handler-up').simulate('mouseDown'),
      6,
      'up',
    );

    testInputNumber(
      'down button',
      { min: 6, max: 10 },
      (wrapper) => wrapper.find('.rc-input-number-handler-down').simulate('mouseDown'),
      6,
      'down',
    );
  });

  describe('null with min & max', () => {
    testInputNumber(
      'up button',
      { value: null, min: 6, max: 10 },
      (wrapper) => wrapper.find('.rc-input-number-handler-up').simulate('mouseDown'),
      6,
      'up',
    );

    testInputNumber(
      'down button',
      { value: null, min: 6, max: 10 },
      (wrapper) => wrapper.find('.rc-input-number-handler-down').simulate('mouseDown'),
      6,
      'down',
    );
  });

  describe('disabled', () => {
    it('none', () => {
      const wrapper = mount(<InputNumber value={5} min={3} max={9} />);
      expect(wrapper.exists('.rc-input-number-handler-up-disabled')).toBeFalsy();
      expect(wrapper.exists('.rc-input-number-handler-down-disabled')).toBeFalsy();
    });

    it('min', () => {
      const wrapper = mount(<InputNumber value={3} min={3} max={9} />);
      expect(wrapper.exists('.rc-input-number-handler-down-disabled')).toBeTruthy();
    });

    it('max', () => {
      const wrapper = mount(<InputNumber value={9} min={3} max={9} />);
      expect(wrapper.exists('.rc-input-number-handler-up-disabled')).toBeTruthy();
    });
  });

  describe('safe integer', () => {
    it('back to max safe when BigInt not support', () => {
      supportBigInt.mockImplementation(() => false);

      const onChange = jest.fn();
      const wrapper = mount(<InputNumber defaultValue={1e24} onChange={onChange} />);
      wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
      expect(onChange).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);

      wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
      expect(onChange).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER - 1);

      supportBigInt.mockRestore();
    });

    it('back to min safe when BigInt not support', () => {
      supportBigInt.mockImplementation(() => false);

      const onChange = jest.fn();
      const wrapper = mount(<InputNumber defaultValue={-1e25} onChange={onChange} />);
      wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
      expect(onChange).toHaveBeenCalledWith(Number.MIN_SAFE_INTEGER);

      wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
      expect(onChange).toHaveBeenCalledWith(Number.MIN_SAFE_INTEGER + 1);

      supportBigInt.mockRestore();
    });

    it('no limit max safe when BigInt support', () => {
      const onChange = jest.fn();
      const wrapper = mount(<InputNumber stringMode defaultValue={1e24} onChange={onChange} />);
      wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
      expect(onChange).toHaveBeenCalledWith('999999999999999983222785');
    });

    it('no limit min safe when BigInt support', () => {
      const onChange = jest.fn();
      const wrapper = mount(<InputNumber stringMode defaultValue={-1e25} onChange={onChange} />);
      wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
      expect(onChange).toHaveBeenCalledWith('-10000000000000000905969665');
    });
  });

  it('focus input when click up/down button', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const wrapper = mount(<InputNumber onFocus={onFocus} onBlur={onBlur} />, {
      attachTo: document.body,
    });

    wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    expect(wrapper.exists('.rc-input-number-focused')).toBeTruthy();
    expect(onFocus).toHaveBeenCalled();

    wrapper.blurInput();
    expect(onBlur).toHaveBeenCalled();
    expect(wrapper.exists('.rc-input-number-focused')).toBeFalsy();
  });
});
