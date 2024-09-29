import KeyCode from 'rc-util/lib/KeyCode';
import InputNumber from '../src';
import { fireEvent, render } from './util/wrapper';

describe('InputNumber.validator', () => {
  it('validator on direct input', () => {
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber
        defaultValue={0}
        validator={(num) => {
          return /^[0-9]*$/.test(num);
        }}
        onChange={onChange}
      />,
    );
    const input = container.querySelector('input');
    fireEvent.focus(input);

    fireEvent.change(input, { target: { value: 'a' } });
    expect(input.value).toEqual('0');
    fireEvent.change(input, { target: { value: '5' } });
    expect(input.value).toEqual('5');
    expect(onChange).toHaveBeenCalledWith(5);
    fireEvent.change(input, { target: { value: '10e' } });
    expect(input.value).toEqual('5');
    fireEvent.change(input, { target: { value: '_' } });
    expect(input.value).toEqual('5');
    fireEvent.change(input, { target: { value: '10' } });
    expect(input.value).toEqual('10');
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('validator and formatter', () => {
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber
        defaultValue={1}
        formatter={(num) => `$ ${num} boeing 737`}
        validator={(num) => {
          return /^[0-9]*$/.test(num);
        }}
        onChange={onChange}
      />,
    );
    const input = container.querySelector('input');
    fireEvent.focus(input);

    expect(input.value).toEqual('$ 1 boeing 737');
    fireEvent.change(input, { target: { value: '5' } });
    expect(input.value).toEqual('$ 5 boeing 737');

    fireEvent.keyDown(input, {
      which: KeyCode.UP,
      key: 'ArrowUp',
      code: 'ArrowUp',
      keyCode: KeyCode.UP,
    });

    expect(input.value).toEqual('$ 6 boeing 737');
    expect(onChange).toHaveBeenLastCalledWith(6);

    fireEvent.change(input, { target: { value: '#' } });
    expect(input.value).toEqual('$ 6 boeing 737');

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
    fireEvent.change(input, { target: { value: 'a' } });
    expect(input.value).toEqual('$ 6 boeing 737');
  });
});
