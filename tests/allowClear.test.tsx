import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import InputNumber from '../src';

describe('InputNumber.AllowClear', () => {
  it('does not render a clear button by default', () => {
    const { container } = render(<InputNumber defaultValue={1} />);

    expect(container.querySelector('.rc-input-number-clear-icon')).not.toBeInTheDocument();
  });

  it('clears an uncontrolled value and calls change callbacks', () => {
    const calls: string[] = [];
    const onChange = jest.fn(() => calls.push('change'));
    const onClear = jest.fn(() => calls.push('clear'));
    const { container } = render(
      <InputNumber allowClear={{}} defaultValue={123} onChange={onChange} onClear={onClear} />,
    );

    fireEvent.click(container.querySelector('.rc-input-number-clear-icon'));

    expect(container.querySelector('input')).toHaveValue('');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(calls).toEqual(['change', 'clear']);
  });

  it('clears raw input when the decimal value is already empty', () => {
    const onChange = jest.fn();
    const onClear = jest.fn();
    const { container, getByRole } = render(
      <InputNumber allowClear={{}} onChange={onChange} onClear={onClear} />,
    );
    const input = getByRole('spinbutton');
    const clearButton = container.querySelector<HTMLButtonElement>('.rc-input-number-clear-icon');

    fireEvent.change(input, { target: { value: '-' } });

    expect(clearButton).not.toHaveClass('rc-input-number-clear-icon-hidden');
    expect(clearButton).not.toBeDisabled();

    fireEvent.click(clearButton);

    expect(input).toHaveValue('');
    expect(onChange).not.toHaveBeenCalled();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('keeps raw input clearable when focus moves to the clear button', () => {
    const onClear = jest.fn();
    const { container, getByRole } = render(<InputNumber allowClear={{}} onClear={onClear} />);
    const input = getByRole('spinbutton');
    const clearButton = container.querySelector<HTMLButtonElement>('.rc-input-number-clear-icon');

    act(() => input.focus());
    fireEvent.change(input, { target: { value: '-' } });
    act(() => clearButton.focus());

    expect(clearButton).toHaveFocus();
    expect(clearButton).not.toBeDisabled();
    expect(input).toHaveValue('-');

    fireEvent.click(clearButton);

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does not restore pending input normalization after clearing', () => {
    jest.useFakeTimers();

    try {
      const onChange = jest.fn();
      const { container, getByRole } = render(<InputNumber allowClear={{}} onChange={onChange} />);
      const input = getByRole('spinbutton');

      fireEvent.change(input, { target: { value: '8。1' } });
      onChange.mockClear();

      fireEvent.click(container.querySelector('.rc-input-number-clear-icon'));

      expect(input).toHaveValue('');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(null);

      act(() => jest.runOnlyPendingTimers());

      expect(input).toHaveValue('');
      expect(onChange).toHaveBeenCalledTimes(1);
    } finally {
      jest.clearAllTimers();
      jest.useRealTimers();
    }
  });

  it('uses the null contract without parsing empty text', () => {
    const parser = jest.fn((text: string) => (text === '' ? 0 : Number(text)));
    const formatter = jest.fn((nextValue, { input }) => input || String(nextValue ?? ''));
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber
        allowClear={{}}
        defaultValue={1}
        parser={parser}
        formatter={formatter}
        onChange={onChange}
      />,
    );

    parser.mockClear();
    formatter.mockClear();
    fireEvent.click(container.querySelector('.rc-input-number-clear-icon'));

    expect(container.querySelector('input')).toHaveValue('');
    expect(onChange).toHaveBeenCalledWith(null);
    expect(parser).not.toHaveBeenCalled();
    expect(formatter.mock.calls.at(-1)?.[1]).toEqual({ userTyping: false, input: '' });
  });

  it('notifies without overriding a controlled value', () => {
    const onChange = jest.fn();
    const onClear = jest.fn();
    const { container } = render(
      <InputNumber allowClear={{}} value={123} onChange={onChange} onClear={onClear} />,
    );

    fireEvent.click(container.querySelector('.rc-input-number-clear-icon'));

    expect(container.querySelector('input')).toHaveValue('123');
    expect(onChange).toHaveBeenCalledWith(null);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('clears when controlled state accepts null', () => {
    const ControlledInputNumber = () => {
      const [currentValue, setCurrentValue] = React.useState<number | null>(123);
      return (
        <InputNumber<number> allowClear={{}} value={currentValue} onChange={setCurrentValue} />
      );
    };
    const { container } = render(<ControlledInputNumber />);

    fireEvent.click(container.querySelector('.rc-input-number-clear-icon'));

    expect(container.querySelector('input')).toHaveValue('');
  });

  it('supports clearing zero', () => {
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber allowClear={{}} defaultValue={0} onChange={onChange} />,
    );
    const clearButton = container.querySelector('.rc-input-number-clear-icon');

    expect(clearButton).not.toHaveClass('rc-input-number-clear-icon-hidden');
    fireEvent.click(clearButton);

    expect(container.querySelector('input')).toHaveValue('');
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('clears to null when precision is configured', () => {
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber allowClear={{}} defaultValue={1.23} precision={2} onChange={onChange} />,
    );

    fireEvent.click(container.querySelector('.rc-input-number-clear-icon'));

    expect(container.querySelector('input')).toHaveValue('');
    expect(onChange).toHaveBeenCalledTimes(1);
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

  it('supports a localized accessible label that takes precedence over the icon', () => {
    const { getByRole } = render(
      <InputNumber
        allowClear={{
          clearIcon: <span aria-label="Icon label">clear</span>,
          label: 'Effacer',
        }}
        defaultValue={1}
      />,
    );

    expect(getByRole('button', { name: 'Effacer' })).toHaveAttribute('aria-label', 'Effacer');
  });

  it.each([
    ['disabled', { disabled: true }],
    ['readOnly', { readOnly: true }],
    ['allowClear.disabled', { allowClear: { disabled: true } }],
  ])('disables the clear action when %s', (_name, extraProps) => {
    const onChange = jest.fn();
    const onClear = jest.fn();
    const { container } = render(
      <InputNumber
        allowClear={{}}
        defaultValue={1}
        styles={{ clear: { visibility: 'visible' } }}
        onChange={onChange}
        onClear={onClear}
        {...extraProps}
      />,
    );
    const clearButton = container.querySelector<HTMLButtonElement>('.rc-input-number-clear-icon');

    expect(clearButton).toHaveClass('rc-input-number-clear-icon-hidden');
    expect(clearButton).toBeDisabled();

    fireEvent.click(clearButton);

    expect(container.querySelector('input')).toHaveValue('1');
    expect(onChange).not.toHaveBeenCalled();
    expect(onClear).not.toHaveBeenCalled();
  });

  it('keeps an empty clear action inert when semantic styles reveal it', () => {
    const onChange = jest.fn();
    const onClear = jest.fn();
    const { container } = render(
      <InputNumber
        allowClear={{}}
        styles={{ clear: { visibility: 'visible' } }}
        onChange={onChange}
        onClear={onClear}
      />,
    );
    const clearButton = container.querySelector<HTMLButtonElement>('.rc-input-number-clear-icon');

    expect(clearButton).toHaveClass('rc-input-number-clear-icon-hidden');
    expect(clearButton).toBeDisabled();

    fireEvent.click(clearButton);

    expect(onChange).not.toHaveBeenCalled();
    expect(onClear).not.toHaveBeenCalled();
  });

  it('preserves input focus on pointer interaction', () => {
    const onBlur = jest.fn();
    const { container } = render(<InputNumber allowClear={{}} defaultValue={1} onBlur={onBlur} />);
    const input = container.querySelector('input');
    const clearButton = container.querySelector<HTMLButtonElement>('.rc-input-number-clear-icon');

    act(() => input.focus());
    fireEvent.mouseDown(clearButton);
    fireEvent.click(clearButton);

    expect(input).toHaveFocus();
    expect(onBlur).not.toHaveBeenCalled();
  });

  it('uses an accessible button and returns focus after keyboard activation', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <InputNumber allowClear={{}} defaultValue={1} onChange={onChange} />,
    );
    const input = getByRole('spinbutton');
    const clearButton = getByRole('button', { name: 'Clear' });

    expect(clearButton).toHaveAttribute('type', 'button');
    act(() => clearButton.focus());
    expect(clearButton).toHaveFocus();
    fireEvent.click(clearButton);

    expect(onChange).toHaveBeenCalledWith(null);
    expect(input).toHaveFocus();
    expect(clearButton).toBeDisabled();
    expect(clearButton).toHaveClass('rc-input-number-clear-icon-hidden');
  });

  it('isolates conflicting keys but lets unrelated keys propagate', () => {
    const onChange = jest.fn();
    const onPressEnter = jest.fn();
    const onStep = jest.fn();
    const onParentKeyDown = jest.fn();
    const { getByRole } = render(
      <div onKeyDown={onParentKeyDown}>
        <InputNumber
          allowClear={{}}
          value={1}
          onChange={onChange}
          onPressEnter={onPressEnter}
          onStep={onStep}
        />
      </div>,
    );
    const input = getByRole('spinbutton');
    const clearButton = getByRole('button', { name: 'Clear' });

    fireEvent.change(input, { target: { value: '2' } });
    onChange.mockClear();
    act(() => clearButton.focus());

    ['Enter', 'Up', 'ArrowUp', 'Down', 'ArrowDown'].forEach((key) => {
      fireEvent.keyDown(clearButton, { key });
    });

    expect(onPressEnter).not.toHaveBeenCalled();
    expect(onStep).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('2');
    expect(onParentKeyDown).not.toHaveBeenCalled();

    fireEvent.keyDown(clearButton, { key: 'Escape' });
    fireEvent.keyDown(clearButton, { key: ' ' });

    expect(onParentKeyDown.mock.calls.map(([event]) => event.key)).toEqual(['Escape', ' ']);

    fireEvent.click(clearButton);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
    expect(input).toHaveValue('1');
    expect(input).toHaveFocus();
  });

  it('lets step keys propagate when keyboard stepping is disabled', () => {
    const onParentKeyDown = jest.fn();
    const onStep = jest.fn();
    const { getByRole } = render(
      <div onKeyDown={onParentKeyDown}>
        <InputNumber allowClear={{}} defaultValue={1} keyboard={false} onStep={onStep} />
      </div>,
    );
    const clearButton = getByRole('button', { name: 'Clear' });

    ['Up', 'ArrowUp', 'Down', 'ArrowDown'].forEach((key) => {
      fireEvent.keyDown(clearButton, { key });
    });

    expect(onStep).not.toHaveBeenCalled();
    expect(onParentKeyDown.mock.calls.map(([event]) => event.key)).toEqual([
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
    ]);
  });
});
