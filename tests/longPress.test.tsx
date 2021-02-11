import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from './util/wrapper';
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

  it('up button works', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber defaultValue={20} onChange={onChange} />);
    wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    act(() => {
      jest.advanceTimersByTime(600 + 200 * 5 + 100);
    });
    wrapper.find('.rc-input-number-handler-up').simulate('mouseUp');

    expect(onChange).toHaveBeenCalledWith(26);
  });

  it('down button works', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber defaultValue={20} onChange={onChange} />);
    wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
    act(() => {
      jest.advanceTimersByTime(600 + 200 * 5 + 100);
    });
    wrapper.find('.rc-input-number-handler-down').simulate('mouseUp');

    expect(onChange).toHaveBeenCalledWith(14);
  });
});
