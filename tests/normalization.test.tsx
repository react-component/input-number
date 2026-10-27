import React from 'react';
import InputNumber from '../src';
import { act, fireEvent, render } from './util/wrapper';

describe('InputNumber input normalization', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it.each([2, 0, null, undefined, '2.5'])(
    'does not normalize stale input after value changes to %s',
    (value) => {
      const onChange = jest.fn();
      const onInput = jest.fn();
      const { container, rerender } = render(
        <InputNumber value={9} onChange={onChange} onInput={onInput} />,
      );
      const input = container.querySelector('input');

      fireEvent.keyDown(input, { key: '1' });
      fireEvent.change(input, { target: { value: '1。' } });
      expect(onChange).toHaveBeenCalledWith(1);
      expect(onInput).toHaveBeenCalledWith('1。');

      rerender(<InputNumber value={value} onChange={onChange} onInput={onInput} />);
      const expectedInput = value == null ? '' : String(value);
      expect(input.value).toBe(expectedInput);

      act(() => {
        jest.runOnlyPendingTimers();
      });

      expect(input.value).toBe(expectedInput);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onInput).toHaveBeenCalledTimes(1);
    },
  );

  it.each([false, true])('preserves normalization with controlled=%s', (controlled) => {
    const onChange = jest.fn();
    const onInput = jest.fn();
    const Demo = () => {
      const [value, setValue] = React.useState(0);
      return (
        <InputNumber
          defaultValue={0}
          value={controlled ? value : undefined}
          onChange={(nextValue) => {
            onChange(nextValue);
            setValue(nextValue);
          }}
          onInput={onInput}
        />
      );
    };
    const { container } = render(<Demo />);
    const input = container.querySelector('input');

    fireEvent.keyDown(input, { key: '8' });
    fireEvent.change(input, { target: { value: '8。1' } });

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(input.value).toBe('8.1');
    expect(onChange.mock.calls).toEqual([[81], [8.1]]);
    expect(onInput.mock.calls).toEqual([['8。1'], ['8.1']]);
  });

  it('normalizes new input after a controlled value update', () => {
    const onChange = jest.fn();
    const { container, rerender } = render(<InputNumber value={9} onChange={onChange} />);
    const input = container.querySelector('input');

    fireEvent.keyDown(input, { key: '1' });
    fireEvent.change(input, { target: { value: '1。' } });
    rerender(<InputNumber value={2} onChange={onChange} />);

    act(() => {
      jest.runOnlyPendingTimers();
    });
    onChange.mockClear();

    fireEvent.change(input, { target: { value: '2。5' } });
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(input.value).toBe('2.5');
    expect(onChange.mock.calls).toEqual([[25], [2.5]]);
  });
});
