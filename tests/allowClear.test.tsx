import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import InputNumber from '../src';

describe('InputNumber.AllowClear', () => {
  it('clears an uncontrolled value and calls change callbacks', () => {
    const calls: string[] = [];
    const onChange = jest.fn(() => calls.push('change'));
    const onClear = jest.fn(() => calls.push('clear'));
    const { container } = render(
      <InputNumber allowClear defaultValue={123} onChange={onChange} onClear={onClear} />,
    );

    fireEvent.click(container.querySelector('.rc-input-number-clear-icon'));

    expect(container.querySelector('input')).toHaveValue('');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(calls).toEqual(['change', 'clear']);
  });

  it('notifies without overriding a controlled value', () => {
    const onChange = jest.fn();
    const onClear = jest.fn();
    const { container } = render(
      <InputNumber allowClear value={123} onChange={onChange} onClear={onClear} />,
    );

    fireEvent.click(container.querySelector('.rc-input-number-clear-icon'));

    expect(container.querySelector('input')).toHaveValue('123');
    expect(onChange).toHaveBeenCalledWith(null);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('supports clearing zero', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber allowClear defaultValue={0} onChange={onChange} />);
    const clearButton = container.querySelector('.rc-input-number-clear-icon');

    expect(clearButton).not.toHaveClass('rc-input-number-clear-icon-hidden');
    fireEvent.click(clearButton);

    expect(container.querySelector('input')).toHaveValue('');
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('supports a custom clear icon', () => {
    const { getByTestId } = render(
      <InputNumber
        allowClear={{ clearIcon: <span data-testid="custom-clear">clear</span> }}
        defaultValue={1}
      />,
    );

    expect(getByTestId('custom-clear')).toBeInTheDocument();
  });

  it.each([
    ['disabled', { disabled: true }],
    ['readOnly', { readOnly: true }],
    ['allowClear.disabled', { allowClear: { disabled: true } }],
  ])('hides the clear button when %s', (_name, extraProps) => {
    const { container } = render(<InputNumber allowClear defaultValue={1} {...extraProps} />);

    expect(container.querySelector('.rc-input-number-clear-icon')).toHaveClass(
      'rc-input-number-clear-icon-hidden',
    );
  });

  it('preserves input focus on pointer interaction', () => {
    const onBlur = jest.fn();
    const { container } = render(<InputNumber allowClear defaultValue={1} onBlur={onBlur} />);
    const input = container.querySelector('input');
    const clearButton = container.querySelector<HTMLButtonElement>('.rc-input-number-clear-icon');

    act(() => input.focus());
    fireEvent.mouseDown(clearButton);
    fireEvent.click(clearButton);

    expect(input).toHaveFocus();
    expect(onBlur).not.toHaveBeenCalled();
  });

  it('uses an accessible keyboard-focusable button', () => {
    const onChange = jest.fn();
    const { getByRole } = render(<InputNumber allowClear defaultValue={1} onChange={onChange} />);
    const clearButton = getByRole('button', { name: 'Clear Value' });

    act(() => clearButton.focus());
    expect(clearButton).toHaveFocus();
    fireEvent.click(clearButton);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('isolates clear button keyboard events from input handlers', () => {
    const onChange = jest.fn();
    const onPressEnter = jest.fn();
    const onStep = jest.fn();
    const { getByRole } = render(
      <InputNumber
        allowClear
        value={1}
        onChange={onChange}
        onPressEnter={onPressEnter}
        onStep={onStep}
      />,
    );
    const input = getByRole('spinbutton');
    const clearButton = getByRole('button', { name: 'Clear Value' });

    fireEvent.change(input, { target: { value: '2' } });
    onChange.mockClear();
    act(() => clearButton.focus());

    ['Enter', 'ArrowUp', 'ArrowDown'].forEach((key) => {
      fireEvent.keyDown(clearButton, { key });
    });

    expect(onPressEnter).not.toHaveBeenCalled();
    expect(onStep).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('2');

    fireEvent.click(clearButton);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
