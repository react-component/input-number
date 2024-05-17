import InputNumber from '../src';
import { act, fireEvent, render, waitFor } from './util/wrapper';

// Jest will mass of advanceTimersByTime if other test case not use fakeTimer.
// Let's create a pure file here for test.

describe('InputNumber.LongPress', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('up button works', async () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber defaultValue={20} onChange={onChange} />);
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    act(() => {
      jest.advanceTimersByTime(600 + 200 * 5 + 100);
    });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(26));
  });

  it('down button works', async () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber defaultValue={20} onChange={onChange} />);
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));

    act(() => {
      jest.advanceTimersByTime(600 + 200 * 5 + 100);
    });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(14));
  });

  it('Simulates event calls out of order in Safari', async () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber defaultValue={20} onChange={onChange} />);
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    act(() => {
      jest.advanceTimersByTime(10);
    });
    fireEvent.mouseUp(container.querySelector('.rc-input-number-handler-up'));
    act(() => {
      jest.advanceTimersByTime(10);
    });
    fireEvent.mouseUp(container.querySelector('.rc-input-number-handler-up'));
    act(() => {
      jest.advanceTimersByTime(10);
    });
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    act(() => {
      jest.advanceTimersByTime(10);
    });
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    act(() => {
      jest.advanceTimersByTime(10);
    });
    fireEvent.mouseUp(container.querySelector('.rc-input-number-handler-up'));

    act(() => {
      jest.advanceTimersByTime(600 + 200 * 5 + 100);
    });

    await waitFor(() => expect(onChange).toBeCalledTimes(3));
  });
});
