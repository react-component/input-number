import React from 'react';
import { render, fireEvent } from './util/wrapper';
import InputNumber from '../src';

describe('InputNumber.Decimal', () => {
  it('decimal value', () => {
    const { container } = render(<InputNumber step={1} value={2.1} />);
    expect(container.querySelector('input').value).toEqual('2.1');
  });

  it('decimal defaultValue', () => {
    const { container } = render(<InputNumber step={1} defaultValue={2.1} />);
    expect(container.querySelector('input').value).toEqual('2.1');
  });

  it('increase and decrease decimal InputNumber by integer step', () => {
    const { container } = render(<InputNumber step={1} defaultValue={2.1} />);
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    expect(container.querySelector('input').value).toEqual('3.1');
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
    expect(container.querySelector('input').value).toEqual('2.1');
  });

  it('small value and step', () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(0.000000001);

      return (
        <InputNumber
          value={value}
          step={0.000000001}
          min={-10}
          max={10}
          onChange={newValue => {
            setValue(newValue);
          }}
        />
      );
    };

    const { container } = render(<Demo />);
    const input = container.querySelector('input');
    expect(input.value).toEqual('0.000000001');

    for (let i = 0; i < 10; i += 1) {
      // plus until change precision
      fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    }

    fireEvent.blur(input);
    expect(input.value).toEqual('0.000000011');
  });

  it('small step with integer value', () => {
    const { container } = render(<InputNumber step="0.000000001" value={1} />);
    expect(container.querySelector('input').value).toEqual('1.000000000');
  });

  it('small step with empty value', () => {
    const { container } = render(<InputNumber step={0.1} />);
    expect(container.querySelector('input').value).toEqual('');

    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    expect(container.querySelector('input').value).toEqual('0.1');
  });

  it('custom decimal separator', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber decimalSeparator="," onChange={onChange} />);

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '1,1' } });
    fireEvent.blur(input);

    expect(container.querySelector('input').value).toEqual('1,1');
    expect(onChange).toHaveBeenCalledWith(1.1);
  });

  describe('precision', () => {
    it('decimal step should not display complete precision', () => {
      const { container } = render(<InputNumber step={0.01} value={2.1} />);
      expect(container.querySelector('input').value).toEqual('2.10');
    });

    it('string step should display complete precision', () => {
      const { container } = render(<InputNumber step="1.000" value={2.1} />);
      expect(container.querySelector('input').value).toEqual('2.100');
    });

    it('prop precision is specified', () => {
      const onChange = jest.fn();
      const { container } = render(
        <InputNumber onChange={onChange} precision={2} defaultValue={2} />,
      );
      const input = container.querySelector('input');
      expect(input.value).toEqual('2.00');

      fireEvent.change(input, { target: { value: '3.456' } });
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith(3.46);
      expect(container.querySelector('input').value).toEqual('3.46');

      onChange.mockReset();
      fireEvent.change(input, { target: { value: '3.465' } });
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith(3.47);
      expect(container.querySelector('input').value).toEqual('3.47');

      onChange.mockReset();
      fireEvent.change(input, { target: { value: '3.455' } });
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith(3.46);
      expect(container.querySelector('input').value).toEqual('3.46');

      onChange.mockReset();
      fireEvent.change(input, { target: { value: '1' } });
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith(1);
      expect(container.querySelector('input').value).toEqual('1.00');
    });

    it('zero precision should work', () => {
      const onChange = jest.fn();
      const { container } = render(<InputNumber onChange={onChange} precision={0} />);
      const input = container.querySelector('input');
      fireEvent.change(input, { target: { value: '1.44' } });
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith(1);
      expect(container.querySelector('input').value).toEqual('1');
    });

    it('should not trigger onChange when blur InputNumber with precision', () => {
      const onChange = jest.fn();
      const { container } = render(
        <InputNumber precision={2} defaultValue={2} onChange={onChange} />,
      );
      const input = container.querySelector('input');
      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledTimes(0);
    });

    it('uncontrolled precision should not format immediately', () => {
      const { container } = render(<InputNumber precision={2} />);
      const input = container.querySelector('input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '3' } });

      expect(container.querySelector('input').value).toEqual('3');
    });

    it('should empty value after removing value', () => {
      const onChange = jest.fn();
      const { container } = render(<InputNumber precision={2} onChange={onChange} />);
      const input = container.querySelector('input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '3' } });
      fireEvent.change(input, { target: { value: '' } });

      expect(container.querySelector('input').value).toEqual('');

      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith(null);
      expect(container.querySelector('input').value).toEqual('');
    });

    it('should trigger onChange when removing value', () => {
      const onChange = jest.fn();
      const { container, rerender } = render(<InputNumber onChange={onChange} />);
      const input = container.querySelector('input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '1' } });
      expect(container.querySelector('input').value).toEqual('1');
      expect(onChange).toHaveBeenCalledWith(1);

      fireEvent.change(input, { target: { value: '' } });
      expect(container.querySelector('input').value).toEqual('');
      expect(onChange).toHaveBeenCalledWith(null);

      rerender(<InputNumber onChange={onChange} min={0} max={10} />);
      fireEvent.change(input, { target: { value: '2' } });
      expect(container.querySelector('input').value).toEqual('2');
      expect(onChange).toHaveBeenCalledWith(2);

      fireEvent.change(input, { target: { value: '' } });
      expect(container.querySelector('input').value).toEqual('');
      expect(onChange).toHaveBeenCalledWith(null);
    });
  });
});
