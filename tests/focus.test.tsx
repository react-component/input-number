import { fireEvent, render } from '@testing-library/react';
import InputNumber, { InputNumberRef } from '../src';
import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';
import React from 'react';

const getInputRef = () => {
  const ref = React.createRef<InputNumberRef>();
  render(<InputNumber ref={ref} defaultValue={12345} />);
  return ref;
};

describe('InputNumber.Focus', () => {
  let inputSpy: ReturnType<typeof spyElementPrototypes>;
  let focus: ReturnType<typeof jest.fn>;
  let setSelectionRange: ReturnType<typeof jest.fn>;

  beforeEach(() => {
    focus = jest.fn();
    setSelectionRange = jest.fn();
    inputSpy = spyElementPrototypes(HTMLInputElement, {
      focus,
      setSelectionRange,
    });
  });

  afterEach(() => {
    inputSpy.mockRestore();
  });

  it('start', () => {
    const input = getInputRef();
    input.current?.focus({ cursor: 'start' });

    expect(focus).toHaveBeenCalled();
    expect(setSelectionRange).toHaveBeenCalledWith(expect.anything(), 0, 0);
  });

  it('end', () => {
    const input = getInputRef();
    input.current?.focus({ cursor: 'end' });

    expect(focus).toHaveBeenCalled();
    expect(setSelectionRange).toHaveBeenCalledWith(expect.anything(), 5, 5);
  });

  it('all', () => {
    const input = getInputRef();
    input.current?.focus({ cursor: 'all' });

    expect(focus).toHaveBeenCalled();
    expect(setSelectionRange).toHaveBeenCalledWith(expect.anything(), 0, 5);
  });

  it('disabled should reset focus', () => {
    const { container, rerender } = render(<InputNumber prefixCls="rc-input-number" />);
    const input = container.querySelector('input')!;

    fireEvent.focus(input);
    expect(container.querySelector('.rc-input-number-focused')).toBeTruthy();

    rerender(<InputNumber prefixCls="rc-input-number" disabled />);
    fireEvent.blur(input);

    expect(container.querySelector('.rc-input-number-focused')).toBeFalsy();
  });
});
