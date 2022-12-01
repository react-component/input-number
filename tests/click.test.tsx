import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import InputNumber, { InputNumberProps } from '../src';
import KeyCode from 'rc-util/lib/KeyCode';

jest.mock('@rc-component/mini-decimal/lib/supportUtil');
const { supportBigInt } = require('@rc-component/mini-decimal/lib/supportUtil');
// jest.mock('../src/utils/supportUtil');
// const { supportBigInt } = require('../src/utils/supportUtil');

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
    selector: string,
    changedValue: string | number,
    stepType: 'up' | 'down',
  ) {
    it(name, () => {
      const onChange = jest.fn();
      const onStep = jest.fn();
      const { container, unmount } = render(
        <InputNumber onChange={onChange} onStep={onStep} {...props} />,
      );
      fireEvent.focus(container.querySelector('input'));
      fireEvent.mouseDown(container.querySelector(selector));
      fireEvent.mouseUp(container.querySelector(selector));
      fireEvent.click(container.querySelector(selector));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(changedValue);
      expect(onStep).toHaveBeenCalledWith(changedValue, { offset: 1, type: stepType });
      unmount();
    });
  }

  describe('basic work', () => {
    testInputNumber('up button', { defaultValue: 10 }, '.rc-input-number-handler-up', 11, 'up');

    testInputNumber('down button', { value: 10 }, '.rc-input-number-handler-down', 9, 'down');
  });

  describe('empty input', () => {
    testInputNumber('up button', {}, '.rc-input-number-handler-up', 1, 'up');

    testInputNumber('down button', {}, '.rc-input-number-handler-down', -1, 'down');
  });

  describe('empty with min & max', () => {
    testInputNumber('up button', { min: 6, max: 10 }, '.rc-input-number-handler-up', 6, 'up');

    testInputNumber('down button', { min: 6, max: 10 }, '.rc-input-number-handler-down', 6, 'down');
  });

  describe('null with min & max', () => {
    testInputNumber(
      'up button',
      { value: null, min: 6, max: 10 },
      '.rc-input-number-handler-up',
      6,
      'up',
    );

    testInputNumber(
      'down button',
      { value: null, min: 6, max: 10 },
      '.rc-input-number-handler-down',
      6,
      'down',
    );
  });

  describe('disabled', () => {
    it('none', () => {
      const { container } = render(<InputNumber value={5} min={3} max={9} />);
      expect(container.querySelector('.rc-input-number-handler-up-disabled')).toBeFalsy();
      expect(container.querySelector('.rc-input-number-handler-down-disabled')).toBeFalsy();
    });

    it('min', () => {
      const { container } = render(<InputNumber value={3} min={3} max={9} />);
      expect(container.querySelector('.rc-input-number-handler-down-disabled')).toBeTruthy();
    });

    it('max', () => {
      const { container } = render(<InputNumber value={9} min={3} max={9} />);
      expect(container.querySelector('.rc-input-number-handler-up-disabled')).toBeTruthy();
    });
  });

  describe('safe integer', () => {
    it('back to max safe when BigInt not support', () => {
      supportBigInt.mockImplementation(() => false);

      const onChange = jest.fn();
      const { container } = render(<InputNumber defaultValue={1e24} onChange={onChange} />);
      fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
      expect(onChange).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);

      fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
      expect(onChange).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER - 1);

      supportBigInt.mockRestore();
    });

    it('back to min safe when BigInt not support', () => {
      supportBigInt.mockImplementation(() => false);

      const onChange = jest.fn();
      const { container } = render(<InputNumber defaultValue={-1e25} onChange={onChange} />);
      fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
      expect(onChange).toHaveBeenCalledWith(Number.MIN_SAFE_INTEGER);

      fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
      expect(onChange).toHaveBeenCalledWith(Number.MIN_SAFE_INTEGER + 1);

      supportBigInt.mockRestore();
    });

    it('no limit max safe when BigInt support', () => {
      const onChange = jest.fn();
      const { container } = render(
        <InputNumber stringMode defaultValue={1e24} onChange={onChange} />,
      );
      fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
      expect(onChange).toHaveBeenCalledWith('999999999999999983222785');
    });

    it('no limit min safe when BigInt support', () => {
      const onChange = jest.fn();
      const { container } = render(
        <InputNumber stringMode defaultValue={-1e25} onChange={onChange} />,
      );
      fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
      expect(onChange).toHaveBeenCalledWith('-10000000000000000905969665');
    });
  });

  it('focus input when click up/down button', async () => {
    jest.useFakeTimers();

    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { container } = render(<InputNumber onFocus={onFocus} onBlur={onBlur} />);

    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(document.activeElement).toBe(container.querySelector('input'));

    // jsdom not trigger onFocus with `.focus()`, let's trigger it manually
    fireEvent.focus(document.querySelector('input'));
    expect(container.querySelector('.rc-input-number-focused')).toBeTruthy();
    expect(onFocus).toHaveBeenCalled();

    fireEvent.blur(container.querySelector('input'));
    expect(onBlur).toHaveBeenCalled();
    expect(container.querySelector('.rc-input-number-focused')).toBeFalsy();

    jest.useRealTimers();
  });

  it('click down button with pressing shift key', () => {
    const onChange = jest.fn();
    const onStep = jest.fn();
    const { container } = render(
      <InputNumber onChange={onChange} onStep={onStep} step={0.01} value={1.2} />,
    );
    fireEvent.keyDown(container.querySelector('input'), {
      shiftKey: true,
      which: KeyCode.DOWN,
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: KeyCode.DOWN,
    });

    expect(onChange).toHaveBeenCalledWith(1.1);
    expect(onStep).toHaveBeenCalledWith(1.1, { offset: '0.1', type: 'down' });
  });

  it('click up button with pressing shift key', () => {
    const onChange = jest.fn();
    const onStep = jest.fn();
    const { container } = render(
      <InputNumber onChange={onChange} onStep={onStep} step={0.01} value={1.2} />,
    );

    fireEvent.keyDown(container.querySelector('input'), {
      shiftKey: true,
      which: KeyCode.UP,
      key: 'ArrowUp',
      code: 'ArrowUp',
      keyCode: KeyCode.UP,
    });
    expect(onChange).toHaveBeenCalledWith(1.3);
    expect(onStep).toHaveBeenCalledWith(1.3, { offset: '0.1', type: 'up' });
  });
});
