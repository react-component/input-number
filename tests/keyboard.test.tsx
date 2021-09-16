import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { mount } from './util/wrapper';
import InputNumber from '../src';

describe('InputNumber.Keyboard', () => {
  it('up', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber onChange={onChange} />);
    wrapper.find('input').simulate('keyDown', { which: KeyCode.UP });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('down', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber onChange={onChange} />);
    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    expect(onChange).toHaveBeenCalledWith(-1);
  });

  // shift + 10, ctrl + 0.1 test case removed

  it('disabled keyboard', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber keyboard={false} onChange={onChange} />);

    wrapper.find('input').simulate('keyDown', { which: KeyCode.UP });
    expect(onChange).not.toHaveBeenCalled();

    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('enter to trigger onChange with precision', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber precision={0} onChange={onChange} />);

    wrapper.find('input').simulate('change', { target: { value: '2.3333' } });
    expect(onChange).toHaveBeenCalledWith(2.3333);
    onChange.mockReset();

    wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
