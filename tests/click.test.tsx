import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
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
  ) {
    it(name, () => {
      const onChange = jest.fn();
      const wrapper = mount(<InputNumber onChange={onChange} {...props} />);
      operate(wrapper);
      wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
      expect(onChange).toHaveBeenCalledWith(changedValue);

      wrapper.unmount();
    });
  }

  describe('basic work', () => {
    testInputNumber(
      'up button',
      { defaultValue: 10 },
      (wrapper) => wrapper.find('.rc-input-number-handler-up').simulate('mouseDown'),
      11,
    );

    testInputNumber(
      'down button',
      { value: 10 },
      (wrapper) => wrapper.find('.rc-input-number-handler-down').simulate('mouseDown'),
      9,
    );
  });

  describe('empty input', () => {
    testInputNumber(
      'up button',
      {},
      (wrapper) => wrapper.find('.rc-input-number-handler-up').simulate('mouseDown'),
      1,
    );

    testInputNumber(
      'down button',
      {},
      (wrapper) => wrapper.find('.rc-input-number-handler-down').simulate('mouseDown'),
      -1,
    );
  });

  describe('empty with min & max', () => {
    testInputNumber(
      'up button',
      { min: 6, max: 10 },
      (wrapper) => wrapper.find('.rc-input-number-handler-up').simulate('mouseDown'),
      6,
    );

    testInputNumber(
      'down button',
      { min: 6, max: 10 },
      (wrapper) => wrapper.find('.rc-input-number-handler-down').simulate('mouseDown'),
      6,
    );
  });

  describe('null with min & max', () => {
    testInputNumber(
      'up button',
      { value: null, min: 6, max: 10 },
      (wrapper) => wrapper.find('.rc-input-number-handler-up').simulate('mouseDown'),
      6,
    );

    testInputNumber(
      'down button',
      { value: null, min: 6, max: 10 },
      (wrapper) => wrapper.find('.rc-input-number-handler-down').simulate('mouseDown'),
      6,
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

  // TODO: cursor follow up
});
