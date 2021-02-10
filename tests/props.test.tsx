import React from 'react';
import { mount } from 'enzyme';
import InputNumber from '../src';

describe('InputNumber.Props', () => {
  it('max', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber max={10} onChange={onChange} />);
    for (let i = 0; i < 100; i += 1) {
      wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    }

    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0]).toEqual(10);
  });

  it('min', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber min={-10} onChange={onChange} />);
    for (let i = 0; i < 100; i += 1) {
      wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
    }

    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0]).toEqual(-10);
  });

  it('disabled', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber onChange={onChange} disabled />);
    wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
    expect(wrapper.exists('.rc-input-number-disabled')).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disabled', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber onChange={onChange} readOnly />);
    wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
    expect(wrapper.exists('.rc-input-number-readonly')).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('autofocus', () => {
    const wrapper = mount(<InputNumber autoFocus />);
    expect(wrapper.find('input').props().autoFocus).toBeTruthy();
  });

  describe('step', () => {
    it('basic', () => {
      const onChange = jest.fn();
      const wrapper = mount(<InputNumber onChange={onChange} step={5} />);

      for (let i = 0; i < 3; i += 1) {
        wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
        expect(onChange).toHaveBeenCalledWith(-5 * (i + 1));
      }
    });

    it('stringMode', () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <InputNumber stringMode onChange={onChange} step="0.000000001" defaultValue="0.000000001" />,
      );

      for (let i = 0; i < 11; i += 1) {
        wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
      }

      expect(onChange).toHaveBeenCalledWith('-0.00000001');
    });
  });
});
