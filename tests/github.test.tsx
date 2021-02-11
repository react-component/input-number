import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from './util/wrapper';
import InputNumber from '../src';
import KeyCode from 'rc-util/lib/KeyCode';

// Github issues
describe('InputNumber.Github', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // https://github.com/react-component/input-number/issues/32
  it('issue 32', () => {
    const wrapper = mount(<InputNumber step={0.1} />);
    wrapper.focusInput();
    wrapper.changeValue('2');
    expect(wrapper.find('input').props().value).toEqual('2');

    wrapper.blurInput();
    expect(wrapper.find('input').props().value).toEqual('2.0');
  });

  // https://github.com/react-component/input-number/issues/197
  it('issue 197', () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(NaN);

      return (
        <InputNumber
          step={1}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
        />
      );
    };
    const wrapper = mount(<Demo />);
    wrapper.focusInput();
    wrapper.changeValue('foo');
  });

  // https://github.com/react-component/input-number/issues/222
  it('issue 222', () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(1);

      return (
        <InputNumber
          step={1}
          max={NaN}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
        />
      );
    };
    const wrapper = mount(<Demo />);
    wrapper.focusInput();
    wrapper.changeValue('foo');

    wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    expect(wrapper.find('input').props().value).toEqual('2');
  });

  // https://github.com/react-component/input-number/issues/35
  it('issue 35', () => {
    let num: string | number;

    const wrapper = mount(
      <InputNumber
        step={0.01}
        defaultValue={2}
        onChange={(value) => {
          num = value;
        }}
      />,
    );

    for (let i = 1; i <= 400; i += 1) {
      wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });

      // no number like 1.5499999999999999
      expect((num.toString().split('.')[1] || '').length < 3).toBeTruthy();
      const expectedValue = Number(((200 - i) / 100).toFixed(2));
      expect(wrapper.find('input').props().value).toEqual(String(expectedValue.toFixed(2)));
      expect(num).toEqual(expectedValue);
    }

    for (let i = 1; i <= 300; i += 1) {
      wrapper.find('input').simulate('keyDown', { which: KeyCode.UP });

      // no number like 1.5499999999999999
      expect((num.toString().split('.')[1] || '').length < 3).toBeTruthy();
      const expectedValue = Number(((i - 200) / 100).toFixed(2));
      expect(wrapper.find('input').props().value).toEqual(String(expectedValue.toFixed(2)));
      expect(num).toEqual(expectedValue);
    }
  });

  // https://github.com/ant-design/ant-design/issues/4229
  it('long press not trigger onChange in uncontrolled component', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber defaultValue={0} onChange={onChange} />);

    wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(onChange).toHaveBeenCalledWith(1);

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  // https://github.com/ant-design/ant-design/issues/4757
  it('should allow to input text like "1."', () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(1.1);

      return (
        <InputNumber
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
        />
      );
    };

    const wrapper = mount(<Demo />);

    wrapper.focusInput();
    wrapper.changeValue('1.');
    expect(wrapper.find('input').props().value).toEqual('1.');

    wrapper.blurInput();
    expect(wrapper.find('input').props().value).toEqual('1');
  });

  // https://github.com/ant-design/ant-design/issues/5012
  // https://github.com/react-component/input-number/issues/64
  it('controller InputNumber should be able to input number like 1.00* and 1.10*', () => {
    let num;

    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(2);

      return (
        <InputNumber
          value={value}
          onChange={(newValue) => {
            num = newValue;
            setValue(newValue);
          }}
        />
      );
    };

    const wrapper = mount(<Demo />);

    wrapper.focusInput();
    wrapper.changeValue('6.0');
    expect(wrapper.findInput().props().value).toEqual('6.0');
    expect(num).toEqual(6);

    wrapper.blurInput();
    expect(wrapper.findInput().props().value).toEqual('6');
    expect(num).toEqual(6);

    wrapper.focusInput();
    wrapper.changeValue('6.10');
    expect(wrapper.findInput().props().value).toEqual('6.10');
    expect(num).toEqual(6.1);

    wrapper.blurInput();
    expect(wrapper.findInput().props().value).toEqual('6.1');
    expect(num).toEqual(6.1);
  });

  it('onChange should not be called when input is not changed', () => {
    const onChange = jest.fn();
    const onInput = jest.fn();

    const wrapper = mount(<InputNumber onChange={onChange} onInput={onInput} />);

    wrapper.focusInput();
    wrapper.changeValue('1');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(1);
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledWith('1');

    wrapper.blurInput();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(1);

    wrapper.focusInput();
    wrapper.changeValue('');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(2);
    expect(onInput).toHaveBeenCalledWith('');

    wrapper.blurInput();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(2);

    wrapper.focusInput();
    wrapper.blurInput();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(2);
  });

  // https://github.com/ant-design/ant-design/issues/5235
  it('input long number', () => {
    const wrapper = mount(<InputNumber />);
    wrapper.focusInput();
    wrapper.changeValue('111111111111111111111');
    expect(wrapper.findInput().props().value).toEqual('111111111111111111111');
    wrapper.changeValue('11111111111111111111111111111');
    expect(wrapper.findInput().props().value).toEqual('11111111111111111111111111111');
  });

  // https://github.com/ant-design/ant-design/issues/7363
  it('uncontrolled input should trigger onChange always when blur it', () => {
    const onChange = jest.fn();
    const onInput = jest.fn();
    const wrapper = mount(<InputNumber min={1} max={10} onChange={onChange} onInput={onInput} />);

    wrapper.focusInput();
    wrapper.changeValue('123');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(10);
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledWith('123');

    wrapper.blurInput();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(1);

    // repeat it, it should works in same way
    wrapper.focusInput();
    wrapper.changeValue('123');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(2);
    expect(onInput).toHaveBeenCalledWith('123');

    wrapper.blurInput();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(2);
  });

  // https://github.com/ant-design/ant-design/issues/7867
  it('focus should not cut precision of input value', () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(2);
      return (
        <InputNumber
          value={value}
          step={0.1}
          onBlur={() => {
            setValue(2);
          }}
        />
      );
    };

    const wrapper = mount(<Demo />);

    wrapper.focusInput();
    wrapper.blurInput();

    expect(wrapper.findInput().props().value).toEqual('2.0');

    wrapper.focusInput();
    expect(wrapper.findInput().props().value).toEqual('2.0');
  });

  // https://github.com/ant-design/ant-design/issues/7940
  it('should not format during input', () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>('');
      return (
        <InputNumber
          value={value}
          step={0.1}
          onChange={(newValue) => {
            setValue(newValue);
          }}
        />
      );
    };

    const wrapper = mount(<Demo />);

    wrapper.focusInput();
    wrapper.changeValue('1');
    expect(wrapper.findInput().props().value).toEqual('1');
  });

  // https://github.com/ant-design/ant-design/issues/8196
  it('Allow input 。', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber min={1} max={10} onChange={onChange} />);
    wrapper.changeValue('8。1');
    expect(wrapper.findInput().props().value).toEqual('8.1');
    expect(onChange).toHaveBeenCalledWith(8.1);
  });

  // https://github.com/ant-design/ant-design/issues/25614
  it("focus value should be '' when clear the input", () => {
    let targetValue: string;

    const wrapper = mount(
      <InputNumber
        min={1}
        max={10}
        onBlur={(e) => {
          targetValue = e.target.value;
        }}
        value={1}
      />,
    );
    wrapper.focusInput();
    wrapper.changeValue('');
    wrapper.blurInput();
    expect(targetValue).toEqual('');
  });

  it('should set input value as formatted when blur', () => {
    let valueOnBlur: string;

    const wrapper = mount(
      <InputNumber
        onBlur={(e) => {
          valueOnBlur = e.target.value;
        }}
        formatter={(value) => `${Number(value) * 100}%`}
        value={1}
      />,
    );

    wrapper.blurInput();
    expect(wrapper.find('input').props().value).toEqual('100%');
    expect(valueOnBlur).toEqual('100%');
  });

  // https://github.com/ant-design/ant-design/issues/11574
  // Origin: should trigger onChange when max or min change
  it('warning UI when max or min change', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputNumber min={0} max={20} value={10} onChange={onChange} />);

    expect(wrapper.exists('.rc-input-number-out-of-range')).toBeFalsy();

    wrapper.setProps({ min: 11 });
    wrapper.update();
    expect(wrapper.findInput().props().value).toEqual('10');
    expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();
    expect(onChange).toHaveBeenCalledTimes(0);

    wrapper.setProps({ value: 15 });
    wrapper.setProps({ max: 14 });
    wrapper.update();

    expect(wrapper.findInput().props().value).toEqual('15');
    expect(wrapper.exists('.rc-input-number-out-of-range')).toBeTruthy();
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  // https://github.com/react-component/input-number/issues/120
  it('should not reset value when parent re-render with the same `value` prop', () => {
    const Demo = () => {
      const [, forceUpdate] = React.useState({});

      return (
        <InputNumber
          value={40}
          onChange={() => {
            forceUpdate({});
          }}
        />
      );
    };

    const wrapper = mount(<Demo />);
    wrapper.focusInput();
    wrapper.changeValue('401');

    // Demo re-render and the `value` prop is still 40, but the user input should be retained
    expect(wrapper.findInput().props().value).toEqual('401');
  });

  // https://github.com/ant-design/ant-design/issues/16710
  it('should use correct precision when change it to 0', () => {
    const Demo = () => {
      const [precision, setPrecision] = React.useState(2);

      return (
        <div>
          <InputNumber
            onChange={(newPrecision: number) => {
              setPrecision(newPrecision);
            }}
          />
          <InputNumber precision={precision} defaultValue={1.23} />
        </div>
      );
    };

    const wrapper = mount(<Demo />);
    wrapper.find('input').last().simulate('change', { target: { value: '1.23' } });
    wrapper.find('input').first().simulate('change', { target: { value: '0' } });

    expect(wrapper.find('input').last().props().value).toEqual('1');
  });

  // // https://github.com/react-component/input-number/issues/235
  // describe('cursor position', () => {
  //   const setUpCursorTest = (
  //     initialValue,
  //     changedValue,
  //     keyCodeValue,
  //     selectionStart,
  //     selectionEnd,
  //   ) => {
  //     class Demo extends React.Component {
  //       onChange = (value) => {
  //         this.setState({ value });
  //       };
  //       render() {
  //         return <InputNumber ref="inputNum" value={initialValue} onChange={this.onChange} />;
  //       }
  //     }
  //     example = ReactDOM.render(<Demo />, container);
  //     inputNumber = example.refs.inputNum;
  //     inputNumber.input.selectionStart = selectionStart;
  //     inputNumber.input.selectionEnd = selectionEnd || selectionStart;
  //     inputElement = ReactDOM.findDOMNode(inputNumber.input);
  //     Simulate.focus(inputElement);
  //     Simulate.keyDown(inputElement, { keyCode: keyCodeValue });
  //     Simulate.change(inputElement, { target: { value: changedValue } });
  //   };

  //   it('should be maintained on delete with identical consecutive digits', () => {
  //     setUpCursorTest(99999, '9999', keyCode.DELETE, 3);
  //     expect(inputNumber.input.selectionStart).to.be(3);
  //   });

  //   it('should be maintained on delete with unidentical consecutive digits', () => {
  //     setUpCursorTest(12345, '1235', keyCode.DELETE, 3);
  //     expect(inputNumber.input.selectionStart).to.be(3);
  //   });

  //   it('should be one step earlier on backspace with identical consecutive digits', () => {
  //     setUpCursorTest(99999, '9999', keyCode.BACKSPACE, 3);
  //     expect(inputNumber.input.selectionStart).to.be(2);
  //   });

  //   it('should be one step earlier on backspace with unidentical consecutive digits', () => {
  //     setUpCursorTest(12345, '1245', keyCode.BACKSPACE, 3);
  //     expect(inputNumber.input.selectionStart).to.be(2);
  //   });

  //   it('should be at the start of selection on delete with identical consecutive digits', () => {
  //     setUpCursorTest(99999, '999', keyCode.DELETE, 1, 3);
  //     expect(inputNumber.input.selectionStart).to.be(1);
  //   });

  //   it('should be at the start of selection on delete with unidentical consecutive digits', () => {
  //     // eslint-disable-line
  //     setUpCursorTest(12345, '145', keyCode.DELETE, 1, 3);
  //     expect(inputNumber.input.selectionStart).to.be(1);
  //   });

  //   it('should be at the start of selection on backspace with identical consecutive digits', () => {
  //     // eslint-disable-line
  //     setUpCursorTest(99999, '999', keyCode.BACKSPACE, 1, 3);
  //     expect(inputNumber.input.selectionStart).to.be(1);
  //   });

  //   it('should be at the start of selection on backspace with unidentical consecutive digits', () => {
  //     // eslint-disable-line
  //     setUpCursorTest(12345, '145', keyCode.BACKSPACE, 1, 3);
  //     expect(inputNumber.input.selectionStart).to.be(1);
  //   });

  //   it('should be one step later on new digit with identical consecutive digits', () => {
  //     setUpCursorTest(99999, '999999', keyCode.NINE, 3);
  //     expect(inputNumber.input.selectionStart).to.be(4);
  //   });

  //   it('should be one step later on new digit with unidentical consecutive digits', () => {
  //     setUpCursorTest(12345, '123945', keyCode.NINE, 3);
  //     expect(inputNumber.input.selectionStart).to.be(4);
  //   });

  //   it('should be one step later than the start of selection on new digit with identical consecutive digits', () => {
  //     // eslint-disable-line
  //     setUpCursorTest(99999, '9999', keyCode.NINE, 1, 3);
  //     expect(inputNumber.input.selectionStart).to.be(2);
  //   });

  //   it('should be one step laterthan the start of selection on new digit with unidentical consecutive digits', () => {
  //     // eslint-disable-line
  //     setUpCursorTest(12345, '1945', keyCode.NINE, 1, 3);
  //     expect(inputNumber.input.selectionStart).to.be(2);
  //   });
  // });
});
