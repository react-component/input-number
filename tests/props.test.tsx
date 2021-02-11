import React from 'react';
import { mount } from './util/wrapper';
import KeyCode from 'rc-util/lib/KeyCode';
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

  it('readOnly', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber onChange={onChange} readOnly />);
    wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
    wrapper.find('input').simulate('keyDown', { which: KeyCode.UP });
    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
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
        <InputNumber
          stringMode
          onChange={onChange}
          step="0.000000001"
          defaultValue="0.000000001"
        />,
      );

      for (let i = 0; i < 11; i += 1) {
        wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
      }

      expect(onChange).toHaveBeenCalledWith('-0.00000001');
    });

    it('decimal', () => {
      const onChange = jest.fn();
      const wrapper = mount(<InputNumber onChange={onChange} step={0.1} defaultValue={0.9} />);
      for (let i = 0; i < 3; i += 1) {
        wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
      }
      expect(onChange).toHaveBeenCalledWith(1.2);
    });
  });

  describe('controlled', () => {
    it('restore when blur input', () => {
      const wrapper = mount(<InputNumber value={9} />);
      wrapper.focusInput();

      wrapper.changeValue('3');
      expect(wrapper.find('input').props().value).toEqual('3');

      wrapper.blurInput();
      expect(wrapper.find('input').props().value).toEqual('9');
    });

    it('dynamic change value', () => {
      const wrapper = mount(<InputNumber value={9} />);
      wrapper.setProps({ value: '3' });
      wrapper.update();
      expect(wrapper.find('input').props().value).toEqual('3');
    });

    // Origin https://github.com/ant-design/ant-design/issues/7334
    // zombieJ: We should error this instead of auto change back to a normal value since it makes un-controlled
    it('show limited value when input is not focused', () => {
      const Demo = () => {
        const [value, setValue] = React.useState<string | number>(2);

        return (
          <div>
            <button
              type="button"
              onClick={() => {
                setValue('103aa');
              }}
            >
              change value
            </button>
            <InputNumber min={1} max={10} value={value} />
          </div>
        );
      };

      const wrapper = mount(<Demo />);
      expect(wrapper.find('input').props().value).toEqual('2');

      wrapper.find('button').simulate('click');
      expect(wrapper.find('input').props().value).toEqual('103aa');
      expect(wrapper.exists('.rc-input-number-not-a-number')).toBeTruthy();
    });

    // https://github.com/ant-design/ant-design/issues/7358
    it('controlled component should accept undefined value', () => {
      const Demo = () => {
        const [value, setValue] = React.useState<string | number>(2);

        return (
          <div>
            <button
              type="button"
              onClick={() => {
                setValue(undefined);
              }}
            >
              change value
            </button>
            <InputNumber min={1} max={10} value={value} />
          </div>
        );
      };

      const wrapper = mount(<Demo />);
      expect(wrapper.find('input').props().value).toEqual('2');

      wrapper.find('button').simulate('click');
      expect(wrapper.find('input').props().value).toEqual('');
    });
  });

  describe('defaultValue', () => {
    it('default value should be empty', () => {
      const wrapper = mount(<InputNumber />);
      expect(wrapper.find('input').props().value).toEqual('');
    });

    it('default value should be empty when step is decimal', () => {
      const wrapper = mount(<InputNumber step={0.1} />);
      expect(wrapper.find('input').props().value).toEqual('');
    });

    it('default value should be 1', () => {
      const wrapper = mount(<InputNumber defaultValue={1} />);
      expect(wrapper.find('input').props().value).toEqual('1');
    });

    it('default value could be null', () => {
      const wrapper = mount(<InputNumber defaultValue={null} />);
      expect(wrapper.find('input').props().value).toEqual('');
    });

    it('warning when defaultValue higher than max', () => {
      const wrapper = mount(<InputNumber min={0} max={10} defaultValue={13} />);
      expect(wrapper.find('input').props().value).toEqual('13');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();
    });

    it('warning when defaultValue lower than min', () => {
      const wrapper = mount(<InputNumber min={0} max={10} defaultValue={-1} />);
      expect(wrapper.find('input').props().value).toEqual('-1');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();
    });

    it('default value can be a string greater than 16 characters', () => {
      const wrapper = mount(<InputNumber max={10} defaultValue="-3.637978807091713e-12" />);
      expect(wrapper.find('input').props().value).toEqual('-0.000000000003637978807091713');
    });
  });

  describe('value', () => {
    it("value shouldn't higher than max", () => {
      const wrapper = mount(<InputNumber min={0} max={10} value={13} />);
      expect(wrapper.find('input').props().value).toEqual('13');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();
    });

    it("value shouldn't lower than min", () => {
      const wrapper = mount(<InputNumber min={0} max={10} value={-1} />);
      expect(wrapper.find('input').props().value).toEqual('-1');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();
    });

    it('value can be a string greater than 16 characters', () => {
      const wrapper = mount(<InputNumber max={10} value="-3.637978807091713e-12" />);
      expect(wrapper.find('input').props().value).toEqual('-0.000000000003637978807091713');
    });

    it('value decimal over six decimal not be scientific notation', () => {
      const onChange = jest.fn();
      const wrapper = mount(<InputNumber precision={7} step={0.0000001} onChange={onChange} />);

      for (let i = 1; i <= 9; i += 1) {
        wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
        expect(wrapper.find('input').props().value).toEqual(`0.000000${i}`);
        expect(onChange).toHaveBeenCalledWith(0.0000001 * i);
      }

      for (let i = 8; i >= 1; i -= 1) {
        wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
        expect(wrapper.find('input').props().value).toEqual(`0.000000${i}`);
        expect(onChange).toHaveBeenCalledWith(0.0000001 * i);
      }

      wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
      expect(wrapper.find('input').props().value).toEqual(`0.0000000`);
      expect(onChange).toHaveBeenCalledWith(0);
    });

    it('value can be changed when dynamic setting max', () => {
      const wrapper = mount(<InputNumber value={11} max={10} />);

      // Origin logic shows `10` as `max`. But it breaks form logic.
      expect(wrapper.find('input').props().value).toEqual('11');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();

      wrapper.setProps({ max: 20 });
      wrapper.update();
      expect(wrapper.find('input').props().value).toEqual('11');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeFalsy();
    });

    it('value can be changed when dynamic setting min', () => {
      const wrapper = mount(<InputNumber value={9} min={10} />);

      // Origin logic shows `10` as `max`. But it breaks form logic.
      expect(wrapper.find('input').props().value).toEqual('9');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();

      wrapper.setProps({ min: 0 });
      wrapper.update();
      expect(wrapper.find('input').props().value).toEqual('9');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeFalsy();
    });
  });
});
