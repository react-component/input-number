import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, waitFor } from './util/wrapper';
import InputNumber from '../src';

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
});
