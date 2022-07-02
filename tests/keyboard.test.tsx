import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { render, fireEvent} from './util/wrapper';
import InputNumber from '../src';

describe('InputNumber.Keyboard', () => {
  it('up', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber onChange={onChange} />);
    fireEvent.keyDown(container.querySelector('input'), { which: KeyCode.UP,key: "Up Arrow", keyCode: KeyCode.UP  });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('up with pressing shift key', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber onChange={onChange} step={0.01} value={1.2} />);
    fireEvent.keyDown(container.querySelector('input'), { which: KeyCode.UP,key: "Up Arrow",keyCode: KeyCode.UP , shiftKey: true });
    expect(onChange).toHaveBeenCalledWith(1.3);
  });

  it('down', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber onChange={onChange} />);
    fireEvent.keyDown(container.querySelector('input'), { which: KeyCode.DOWN,key: "Dw Arrow",keyCode: KeyCode.DOWN  });
    expect(onChange).toHaveBeenCalledWith(-1);
  });

  it('down with pressing shift key', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber onChange={onChange} step={0.01} value={1.2} />);
    fireEvent.keyDown(container.querySelector('input'), { which: KeyCode.DOWN, key: "Dw Arrow",keyCode: KeyCode.DOWN ,shiftKey: true });
    expect(onChange).toHaveBeenCalledWith(1.1);
  });

  // shift + 10, ctrl + 0.1 test case removed

  it('disabled keyboard', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber keyboard={false} onChange={onChange} />);

    fireEvent.keyDown(container.querySelector('input'), { which: KeyCode.UP,key: "Up Arrow" });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.keyDown(container.querySelector('input'), { which: KeyCode.DOWN,key: "Dw Arrow"  });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('enter to trigger onChange with precision', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber precision={0} onChange={onChange} />);
    const input = container.querySelector('input')
    fireEvent.change(input,{ target: { value: '2.3333' } })
    expect(onChange).toHaveBeenCalledWith(2.3333);
    onChange.mockReset();

    fireEvent.keyDown(input, { which: KeyCode.ENTER,key: "Enter", keyCode: KeyCode.ENTER  });
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
