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
    expect(wrapper.find('input').props()).toEqual(expect.objectContaining({
      'aria-valuemax': 10,
      'aria-valuenow': '10',
    }));
  });

  it('min', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber min={-10} onChange={onChange} />);
    for (let i = 0; i < 100; i += 1) {
      wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
    }

    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0]).toEqual(-10);
    expect(wrapper.find('input').props()).toEqual(expect.objectContaining({
      'aria-valuemin': -10,
      'aria-valuenow': '-10',
    }));
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
    wrapper.findInput().simulate('keyDown', { which: KeyCode.UP });
    wrapper.findInput().simulate('keyDown', { which: KeyCode.DOWN });
    expect(wrapper.exists('.rc-input-number-readonly')).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('autofocus', () => {
    const wrapper = mount(<InputNumber autoFocus />);
    expect(wrapper.findInput().props().autoFocus).toBeTruthy();
  });

  describe('step', () => {
    it('basic', () => {
      const onChange = jest.fn();
      const wrapper = mount(<InputNumber onChange={onChange} step={5} />);

      for (let i = 0; i < 3; i += 1) {
        wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
        expect(onChange).toHaveBeenCalledWith(-5 * (i + 1));
      }

      expect(wrapper.find('input').props().step).toEqual(5);
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
      expect(wrapper.getInputValue()).toEqual('3');

      wrapper.blurInput();
      expect(wrapper.getInputValue()).toEqual('9');
    });

    it('dynamic change value', () => {
      const wrapper = mount(<InputNumber value={9} />);
      wrapper.setProps({ value: '3' });
      wrapper.update();
      expect(wrapper.getInputValue()).toEqual('3');
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
      expect(wrapper.getInputValue()).toEqual('2');

      wrapper.find('button').simulate('click');
      expect(wrapper.getInputValue()).toEqual('103aa');
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
      expect(wrapper.getInputValue()).toEqual('2');

      wrapper.find('button').simulate('click');
      expect(wrapper.getInputValue()).toEqual('');
    });
  });

  describe('defaultValue', () => {
    it('default value should be empty', () => {
      const wrapper = mount(<InputNumber />);
      expect(wrapper.getInputValue()).toEqual('');
    });

    it('default value should be empty when step is decimal', () => {
      const wrapper = mount(<InputNumber step={0.1} />);
      expect(wrapper.getInputValue()).toEqual('');
    });

    it('default value should be 1', () => {
      const wrapper = mount(<InputNumber defaultValue={1} />);
      expect(wrapper.getInputValue()).toEqual('1');
    });

    it('default value could be null', () => {
      const wrapper = mount(<InputNumber defaultValue={null} />);
      expect(wrapper.getInputValue()).toEqual('');
    });

    it('warning when defaultValue higher than max', () => {
      const wrapper = mount(<InputNumber min={0} max={10} defaultValue={13} />);
      expect(wrapper.getInputValue()).toEqual('13');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();
    });

    it('warning when defaultValue lower than min', () => {
      const wrapper = mount(<InputNumber min={0} max={10} defaultValue={-1} />);
      expect(wrapper.getInputValue()).toEqual('-1');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();
    });

    it('default value can be a string greater than 16 characters', () => {
      const wrapper = mount(<InputNumber max={10} defaultValue="-3.637978807091713e-12" />);
      expect(wrapper.getInputValue()).toEqual('-0.000000000003637978807091713');
    });

    it('invalidate defaultValue', () => {
      const wrapper = mount(<InputNumber defaultValue="light" />);
      expect(wrapper.getInputValue()).toEqual('light');
    });
  });

  describe('value', () => {
    it("value shouldn't higher than max", () => {
      const wrapper = mount(<InputNumber min={0} max={10} value={13} />);
      expect(wrapper.getInputValue()).toEqual('13');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();
    });

    it("value shouldn't lower than min", () => {
      const wrapper = mount(<InputNumber min={0} max={10} value={-1} />);
      expect(wrapper.getInputValue()).toEqual('-1');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();
    });

    it('value can be a string greater than 16 characters', () => {
      const wrapper = mount(<InputNumber max={10} value="-3.637978807091713e-12" />);
      expect(wrapper.getInputValue()).toEqual('-0.000000000003637978807091713');
    });

    it('value decimal over six decimal not be scientific notation', () => {
      const onChange = jest.fn();
      const wrapper = mount(<InputNumber precision={7} step={0.0000001} onChange={onChange} />);

      for (let i = 1; i <= 9; i += 1) {
        wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
        expect(wrapper.getInputValue()).toEqual(`0.000000${i}`);
        expect(onChange).toHaveBeenCalledWith(0.0000001 * i);
      }

      for (let i = 8; i >= 1; i -= 1) {
        wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
        expect(wrapper.getInputValue()).toEqual(`0.000000${i}`);
        expect(onChange).toHaveBeenCalledWith(0.0000001 * i);
      }

      wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
      expect(wrapper.getInputValue()).toEqual(`0.0000000`);
      expect(onChange).toHaveBeenCalledWith(0);
    });

    it('value can be changed when dynamic setting max', () => {
      const wrapper = mount(<InputNumber value={11} max={10} />);

      // Origin logic shows `10` as `max`. But it breaks form logic.
      expect(wrapper.getInputValue()).toEqual('11');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();

      wrapper.setProps({ max: 20 });
      wrapper.update();
      expect(wrapper.getInputValue()).toEqual('11');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeFalsy();
    });

    it('value can be changed when dynamic setting min', () => {
      const wrapper = mount(<InputNumber value={9} min={10} />);

      // Origin logic shows `10` as `max`. But it breaks form logic.
      expect(wrapper.getInputValue()).toEqual('9');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();

      wrapper.setProps({ min: 0 });
      wrapper.update();
      expect(wrapper.getInputValue()).toEqual('9');
      expect(wrapper.exists('.rc-input-number-out-of-range')).toBeFalsy();
    });

    it('value can override given defaultValue', () => {
      const wrapper = mount(<InputNumber value={2} defaultValue={1} />);
      expect(wrapper.getInputValue()).toEqual('2');
    });
  });

  describe(`required prop`, () => {
    it(`should add required attr to the input tag when get passed as true`, () => {
      const wrapper = mount(<InputNumber required />);
      expect(wrapper.findInput().props().required).toBeTruthy();
    });

    it(`should not add required attr to the input as default props when not being supplied`, () => {
      const wrapper = mount(<InputNumber />);
      expect(wrapper.findInput().props().required).toBeFalsy();
    });

    it(`should not add required attr to the input tag when get passed as false`, () => {
      const wrapper = mount(<InputNumber required={false} />);
      expect(wrapper.findInput().props().required).toBeFalsy();
    });
  });

  describe('Pattern prop', () => {
    it(`should render with a pattern attribute if the pattern prop is supplied`, () => {
      const wrapper = mount(<InputNumber pattern="\d*" />);
      expect(wrapper.findInput().props().pattern).toEqual('\\d*');
    });

    it(`should render with no pattern attribute if the pattern prop is not supplied`, () => {
      const wrapper = mount(<InputNumber />);
      expect(wrapper.findInput().props().pattern).toBeFalsy();
    });
  });

  describe('onPaste props', () => {
    it('passes onPaste event handler', () => {
      const onPaste = jest.fn();
      const wrapper = mount(<InputNumber value={1} onPaste={onPaste} />);
      wrapper.findInput().simulate('paste');
      expect(onPaste).toHaveBeenCalled();
    });
  });

  describe('aria and data props', () => {
    it('passes data-* attributes', () => {
      const wrapper = mount(<InputNumber value={1} data-test="test-id" data-id="12345" />);
      expect(wrapper.findInput().props()).toEqual(
        expect.objectContaining({
          'data-test': 'test-id',
          'data-id': '12345',
        }),
      );
    });

    it('passes aria-* attributes', () => {
      const wrapper = mount(
        <InputNumber value={1} aria-labelledby="test-id" aria-label="some-label" />,
      );
      expect(wrapper.findInput().props()).toEqual(
        expect.objectContaining({
          'aria-labelledby': 'test-id',
          'aria-label': 'some-label',
        }),
      );
    });

    it('passes role attribute', () => {
      const wrapper = mount(<InputNumber value={1} role="searchbox" />);
      expect(wrapper.findInput().props()).toEqual(
        expect.objectContaining({
          role: 'searchbox',
        }),
      );
    });
  });
});
