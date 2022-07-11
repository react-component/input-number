import React from 'react';
import { render, fireEvent } from './util/wrapper';
import InputNumber from '../src';
import KeyCode from 'rc-util/lib/KeyCode';

describe('InputNumber.Formatter', () => {
  it('formatter on default', () => {
    const { container } = render(<InputNumber step={1} value={5} formatter={num => `$ ${num}`} />);
    const input = container.querySelector('input');
    expect(input.value).toEqual('$ 5');
  });

  it('formatter on mousedown', () => {
    const { container } = render(<InputNumber defaultValue={5} formatter={num => `$ ${num}`} />);
    const input = container.querySelector('input');
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    expect(input.value).toEqual('$ 6');

    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
    expect(input.value).toEqual('$ 5');
  });

  it('formatter on keydown', () => {
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber defaultValue={5} onChange={onChange} formatter={num => `$ ${num} ¥`} />,
    );

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.keyDown(input, {
      which: KeyCode.UP,
      key: 'ArrowUp',
      code: 'ArrowUp',
      keyCode: KeyCode.UP,
    });

    expect(input.value).toEqual('$ 6 ¥');
    expect(onChange).toHaveBeenCalledWith(6);

    fireEvent.keyDown(input, {
      which: KeyCode.DOWN,
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: KeyCode.DOWN,
    });
    expect(input.value).toEqual('$ 5 ¥');
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('formatter on direct input', () => {
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber defaultValue={5} formatter={num => `$ ${num}`} onChange={onChange} />,
    );
    const input = container.querySelector('input');
    fireEvent.focus(input);

    fireEvent.change(input, { target: { value: '100' } });
    expect(input.value).toEqual('$ 100');
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it('formatter and parser', () => {
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber
        defaultValue={5}
        formatter={num => `$ ${num} boeing 737`}
        parser={num => num.toString().split(' ')[1]}
        onChange={onChange}
      />,
    );
    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.keyDown(input, {
      which: KeyCode.UP,
      key: 'ArrowUp',
      code: 'ArrowUp',
      keyCode: KeyCode.UP,
    });
    expect(input.value).toEqual('$ 6 boeing 737');
    expect(onChange).toHaveBeenLastCalledWith(6);

    fireEvent.keyDown(input, {
      which: KeyCode.DOWN,
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: KeyCode.DOWN,
    });

    expect(input.value).toEqual('$ 5 boeing 737');
    expect(onChange).toHaveBeenLastCalledWith(5);

    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'), {
      which: KeyCode.DOWN,
    });
    expect(input.value).toEqual('$ 6 boeing 737');
    expect(onChange).toHaveBeenLastCalledWith(6);
  });

  it('control not block user input', async () => {
    let numValue;
    const Demo = () => {
      const [value, setValue] = React.useState<number>(null);

      return (
        <InputNumber<number>
          value={value}
          onChange={setValue}
          formatter={(num, info) => {
            if (info.userTyping) {
              return info.input;
            }

            return String(num);
          }}
          parser={num => {
            numValue = num;
            return Number(num);
          }}
        />
      );
    };

    const { container } = render(<Demo />);
    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '-' } });
    fireEvent.change(input, { target: { value: '-0' } });

    expect(numValue).toEqual('-0');

    fireEvent.blur(input);
    expect(input.value).toEqual('0');
  });
});
