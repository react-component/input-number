import KeyCode from 'rc-util/lib/KeyCode';
import InputNumber from '../src';
import { fireEvent, render } from './util/wrapper';

describe('InputNumber.Wheel', () => {
  it('wheel up', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber onChange={onChange} changeOnWheel />);
    fireEvent.focus(container.firstChild);
    fireEvent.wheel(container.querySelector('input'), {deltaY: -1});
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('wheel up with pressing shift key', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber onChange={onChange} step={0.01} value={1.2} changeOnWheel />);
    fireEvent.focus(container.firstChild);
    fireEvent.keyDown(container.querySelector('input'), {
      which: KeyCode.SHIFT,
      key: 'Shift',
      keyCode: KeyCode.SHIFT,
      shiftKey: true,
    });
    fireEvent.wheel(container.querySelector('input'), {deltaY: -1});
    expect(onChange).toHaveBeenCalledWith(1.3);
  });

  it('wheel down', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber onChange={onChange} changeOnWheel />);
    fireEvent.focus(container.firstChild);
    fireEvent.wheel(container.querySelector('input'), {deltaY: 1});
    expect(onChange).toHaveBeenCalledWith(-1);
  });

  it('wheel down with pressing shift key', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber onChange={onChange} step={0.01} value={1.2} changeOnWheel />);
    fireEvent.focus(container.firstChild);
    fireEvent.keyDown(container.querySelector('input'), {
      which: KeyCode.SHIFT,
      key: 'Shift',
      keyCode: KeyCode.SHIFT,
      shiftKey: true,
    });
    fireEvent.wheel(container.querySelector('input'), {deltaY: 1});
    expect(onChange).toHaveBeenCalledWith(1.1);
  });

  it('disabled wheel', () => {
    const onChange = jest.fn();
    const { container, rerender } = render(<InputNumber onChange={onChange} />);
    fireEvent.focus(container.firstChild);

    fireEvent.wheel(container.querySelector('input'), {deltaY: -1});
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.wheel(container.querySelector('input'), {deltaY: 1});
    expect(onChange).not.toHaveBeenCalled();

    rerender(<InputNumber onChange={onChange} changeOnWheel />);
    fireEvent.focus(container.firstChild);

    fireEvent.wheel(container.querySelector('input'), {deltaY: 1});
    expect(onChange).toHaveBeenCalledWith(-1);
  });

  it('wheel is limited to range', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber onChange={onChange} min={-3} max={3} changeOnWheel />);
    fireEvent.focus(container.firstChild);
    fireEvent.keyDown(container.querySelector('input'), {
      which: KeyCode.SHIFT,
      key: 'Shift',
      keyCode: KeyCode.SHIFT,
      shiftKey: true,
    });
    fireEvent.wheel(container.querySelector('input'), {deltaY: -1});
    expect(onChange).toHaveBeenCalledWith(3);
    fireEvent.wheel(container.querySelector('input'), {deltaY: 1});
    expect(onChange).toHaveBeenCalledWith(-3);
  });
});
