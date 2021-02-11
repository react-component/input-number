import React from 'react';
import { mount } from 'enzyme';
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
    wrapper.find('input').simulate('focus');
    wrapper.find('input').simulate('change', { target: { value: '2' } });
    expect(wrapper.find('input').props().value).toEqual('2');

    wrapper.find('input').simulate('blur');
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
    wrapper.find('input').simulate('focus');
    wrapper.find('input').simulate('change', { target: { value: 'foo' } });
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
    wrapper.find('input').simulate('focus');
    wrapper.find('input').simulate('change', { target: { value: 'foo' } });

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

    // jest.advanceTimersByTime();

    //   Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
    //   setTimeout(() => {
    //     expect(num).to.be(1);
    //     setTimeout(() => {
    //       expect(num).to.above(1);
    //       done();
    //     }, 200);
    //   }, 500);
  });

  // // https://github.com/ant-design/ant-design/issues/4757
  // it('should allow to input text like "1."', () => {
  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '1.' } });
  //   expect(inputElement.value).to.be('1.');
  //   expect(onChangeFirstArgument).to.be('1.');
  //   Simulate.blur(inputElement);
  //   expect(inputElement.value).to.be('1');
  //   expect(onChangeFirstArgument).to.be(1);
  // });

  // // https://github.com/ant-design/ant-design/issues/5012
  // // https://github.com/react-component/input-number/issues/64
  // it('controller InputNumber should be able to input number like 1.00* and 1.10*', () => {
  //   let num;
  //   class Demo extends React.Component {
  //     state = {
  //       value: 2,
  //     };

  //     onChange = (value) => {
  //       this.setState({ value });
  //     };

  //     render() {
  //       return (
  //         <InputNumber
  //           ref="inputNum"
  //           value={this.state.value}
  //           onChange={(value) => {
  //             num = value;
  //             this.onChange(value);
  //           }}
  //         />
  //       );
  //     }
  //   }
  //   example = ReactDOM.render(<Demo />, container);
  //   inputNumber = example.refs.inputNum;
  //   inputElement = ReactDOM.findDOMNode(inputNumber.input);

  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '6.0' } });
  //   expect(inputElement.value).to.be('6.0');
  //   expect(num).to.be(6);
  //   Simulate.blur(inputElement);
  //   expect(inputElement.value).to.be('6');
  //   expect(num).to.be(6);
  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '6.10' } });
  //   expect(inputElement.value).to.be('6.10');
  //   expect(num).to.be(6.1);
  //   Simulate.blur(inputElement);
  //   expect(inputElement.value).to.be('6.1');
  //   expect(num).to.be(6.1);
  // });

  // it('onChange should not be called when input is not changed', () => {
  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '1' } });
  //   expect(onChangeCallCount).to.be(1);
  //   expect(onChangeFirstArgument).to.be(1);
  //   Simulate.blur(inputElement);
  //   expect(onChangeCallCount).to.be(1);
  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '' } });
  //   expect(onChangeCallCount).to.be(2);
  //   expect(onChangeFirstArgument).to.be('');
  //   Simulate.blur(inputElement);
  //   expect(onChangeCallCount).to.be(3);
  //   expect(onChangeFirstArgument).to.be(null);
  //   Simulate.focus(inputElement);
  //   Simulate.blur(inputElement);
  //   expect(onChangeCallCount).to.be(3);
  // });

  // // https://github.com/ant-design/ant-design/issues/5235
  // it('input long number', () => {
  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '111111111111111111111' } });
  //   expect(inputElement.value).to.be('111111111111111111111');
  //   Simulate.change(inputElement, { target: { value: '11111111111111111111111111111' } });
  //   expect(inputElement.value).to.be('11111111111111111111111111111');
  // });

  // // https://github.com/ant-design/ant-design/issues/7363
  // it('uncontrolled input should trigger onChange always when blur it', () => {
  //   const onChange = sinon.spy();
  //   inputNumber = ReactDOM.render(<InputNumber min={1} max={10} onChange={onChange} />, container);
  //   inputElement = ReactDOM.findDOMNode(inputNumber.input);
  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '123' } });
  //   expect(onChange.callCount).to.be(1);
  //   expect(onChange.calledWith(123)).to.be(true);
  //   Simulate.blur(inputElement);
  //   expect(onChange.callCount).to.be(2);
  //   expect(onChange.calledWith(10)).to.be(true);

  //   // repeat it, it should works in same way
  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '123' } });
  //   expect(onChange.callCount).to.be(3);
  //   expect(onChange.calledWith(123)).to.be(true);
  //   Simulate.blur(inputElement);
  //   expect(onChange.callCount).to.be(4);
  //   expect(onChange.calledWith(10)).to.be(true);
  // });

  // // https://github.com/ant-design/ant-design/issues/7867
  // it('focus should not cut precision of input value', () => {
  //   class Demo extends React.Component {
  //     state = {
  //       value: 2,
  //     };

  //     onBlur = () => {
  //       this.setState({ value: 2 });
  //     };

  //     render() {
  //       return (
  //         <InputNumber ref="inputNum" value={this.state.value} step={0.1} onBlur={this.onBlur} />
  //       );
  //     }
  //   }
  //   example = ReactDOM.render(<Demo />, container);
  //   inputNumber = example.refs.inputNum;
  //   inputElement = ReactDOM.findDOMNode(inputNumber.input);
  //   Simulate.focus(inputElement);
  //   Simulate.blur(inputElement);
  //   expect(inputElement.value).to.be('2.0');
  //   Simulate.focus(inputElement);
  //   expect(inputElement.value).to.be('2.0');
  // });

  // // https://github.com/ant-design/ant-design/issues/7940
  // it('should not format during input', () => {
  //   class Demo extends React.Component {
  //     state = {
  //       value: '',
  //     };

  //     onChange = (value) => {
  //       this.setState({ value });
  //     };

  //     render() {
  //       return (
  //         <InputNumber
  //           ref="inputNum"
  //           value={this.state.value}
  //           step={0.1}
  //           onChange={this.onChange}
  //         />
  //       );
  //     }
  //   }
  //   example = ReactDOM.render(<Demo />, container);
  //   inputNumber = example.refs.inputNum;
  //   inputElement = ReactDOM.findDOMNode(inputNumber.input);
  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '1' } });
  //   expect(inputElement.value).to.be('1');
  // });

  // // https://github.com/ant-design/ant-design/issues/8196
  // it('Allow inputing 。', () => {
  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '8。1' } });
  //   expect(inputElement.value).to.be('8.1');
  // });

  // it('focus input when click up/down button ', () => {
  //   Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
  //   expect(ReactDOM.findDOMNode(inputNumber).className.indexOf('focused') > 0).to.be(true);
  //   expect(document.activeElement).to.be(inputElement);
  //   expect(onFocusCallCount).to.be(1);
  //   Simulate.blur(inputElement);
  //   expect(onBlurCallCount).to.be(1);
  //   expect(ReactDOM.findDOMNode(inputNumber).className.indexOf('focused') > 0).to.be(false);
  // });

  // // https://github.com/ant-design/ant-design/issues/25614
  // it("focus value should be '' when clear the input", () => {
  //   let targetValue;
  //   class Demo extends React.Component {
  //     state = {
  //       value: 1,
  //     };

  //     render() {
  //       return (
  //         <div>
  //           <InputNumber
  //             ref="inputNum"
  //             min={1}
  //             max={10}
  //             onBlur={(e) => {
  //               targetValue = e.target.value;
  //             }}
  //             value={this.state.value}
  //           />
  //         </div>
  //       );
  //     }
  //   }
  //   example = ReactDOM.render(<Demo />, container);
  //   inputNumber = example.refs.inputNum;
  //   inputElement = ReactDOM.findDOMNode(inputNumber.input);
  //   expect(inputNumber.state.value).to.be(1);
  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '' } });
  //   Simulate.blur(inputElement);
  //   expect(targetValue).to.be('');
  // });

  // it('should set input value as formatted when blur', () => {
  //   let valueOnBlur;
  //   function onBlur(e) {
  //     valueOnBlur = e.target.value;
  //   }
  //   class Demo extends React.Component {
  //     state = {
  //       value: 1,
  //     };

  //     render() {
  //       return (
  //         <div>
  //           <InputNumber
  //             ref="inputNum"
  //             onBlur={onBlur}
  //             formatter={(value) => `${value * 100}%`}
  //             value={this.state.value}
  //           />
  //         </div>
  //       );
  //     }
  //   }
  //   example = ReactDOM.render(<Demo />, container);
  //   inputNumber = example.refs.inputNum;
  //   inputElement = ReactDOM.findDOMNode(inputNumber.input);
  //   Simulate.blur(inputElement);
  //   expect(inputElement.value).to.be('100%');
  //   expect(valueOnBlur).to.be('100%');
  // });

  // // https://github.com/ant-design/ant-design/issues/11574
  // it('should trigger onChange when max or min change', () => {
  //   const onChange = sinon.spy();
  //   class Demo extends Component {
  //     state = {
  //       value: 10,
  //       min: 0,
  //       max: 20,
  //     };

  //     onChange = (value) => {
  //       this.setValue(value);
  //       onChange(value);
  //     };

  //     setMax(max) {
  //       this.setState({ max });
  //     }

  //     setMin(min) {
  //       this.setState({ min });
  //     }

  //     setValue(value) {
  //       this.setState({ value });
  //     }

  //     render() {
  //       return (
  //         <InputNumber
  //           ref="inputNum"
  //           value={this.state.value}
  //           onChange={this.onChange}
  //           max={this.state.max}
  //           min={this.state.min}
  //         />
  //       );
  //     }
  //   }
  //   example = ReactDOM.render(<Demo />, container);
  //   inputNumber = example.refs.inputNum;
  //   inputElement = ReactDOM.findDOMNode(inputNumber.input);
  //   example.setMin(11);
  //   expect(inputElement.value).to.be('11');
  //   expect(onChange.calledWith(11)).to.be(true);

  //   example.setValue(15);

  //   example.setMax(14);
  //   expect(inputElement.value).to.be('14');
  //   expect(onChange.calledWith(14)).to.be(true);
  // });

  // // https://github.com/react-component/input-number/issues/120
  // it('should not reset value when parent rerenders with the same `value` prop', () => {
  //   class Demo extends React.Component {
  //     state = { value: 40 };

  //     onChange = () => {
  //       this.forceUpdate();
  //     };

  //     render() {
  //       return <InputNumber ref="inputNum" value={this.state.value} onChange={this.onChange} />;
  //     }
  //   }

  //   example = ReactDOM.render(<Demo />, container);
  //   inputNumber = example.refs.inputNum;
  //   inputElement = ReactDOM.findDOMNode(inputNumber.input);

  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '401' } });

  //   // Demo rerenders and the `value` prop is still 40, but the user input should
  //   // be retained
  //   expect(inputElement.value).to.be('401');
  // });

  // // https://github.com/ant-design/ant-design/issues/16710
  // it('should use correct precision when change it to 0', () => {
  //   class Demo extends React.Component {
  //     state = {
  //       precision: 2,
  //     };

  //     onPrecisionChange = (precision) => {
  //       this.setState({ precision });
  //     };

  //     render() {
  //       const { precision } = this.state;
  //       return (
  //         <div>
  //           <InputNumber onChange={this.onPrecisionChange} />
  //           <InputNumber mergedPPrecision={precision} defaultValue={1.23} />
  //         </div>
  //       );
  //     }
  //   }
  //   example = ReactDOM.render(<Demo />, container);
  //   const [precisionInput, numberInput] = scryRenderedDOMComponentsWithTag(example, 'input');
  //   expect(numberInput.value).to.be('1.23');
  //   Simulate.focus(precisionInput);
  //   Simulate.change(precisionInput, { target: { value: '0' } });
  //   Simulate.blur(precisionInput);
  //   expect(numberInput.value).to.be('1');
  // });

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
