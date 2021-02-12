import React from 'react';
import { mount } from './util/wrapper';
import InputNumber from '../src';
import KeyCode from 'rc-util/lib/KeyCode';

describe('InputNumber.Formatter', () => {
  it('formatter on default', () => {
    const wrapper = mount(<InputNumber step={1} value={5} formatter={(num) => `$ ${num}`} />);
    expect(wrapper.getInputValue()).toEqual('$ 5');
  });

  it('formatter on mousedown', () => {
    const wrapper = mount(<InputNumber defaultValue={5} formatter={(num) => `$ ${num}`} />);
    wrapper.find('.rc-input-number-handler-up').simulate('mouseDown');
    expect(wrapper.getInputValue()).toEqual('$ 6');

    wrapper.find('.rc-input-number-handler-down').simulate('mouseDown');
    expect(wrapper.getInputValue()).toEqual('$ 5');
  });

  // TODO: handle this
  // it('formatter on touchstart', () => {
  //   class Demo extends React.Component {
  //     render() {
  //       return (
  //         <InputNumber
  //           ref="inputNum"
  //           step={1}
  //           defaultValue={5}
  //           useTouch
  //           formatter={(num) => `${num} ¥`}
  //         />
  //       );
  //     }
  //   }
  //   example = ReactDOM.render(<Demo />, container);
  //   inputNumber = example.refs.inputNum;
  //   inputElement = ReactDOM.findDOMNode(inputNumber.input);

  //   Simulate.touchStart(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
  //   expect(inputNumber.state.value).to.be(6);
  //   expect(inputElement.value).to.be('6 ¥');
  //   Simulate.touchStart(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'));
  //   expect(inputNumber.state.value).to.be(5);
  //   expect(inputElement.value).to.be('5 ¥');
  // });

  it('formatter on keydown', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <InputNumber defaultValue={5} onChange={onChange} formatter={(num) => `$ ${num} ¥`} />,
    );

    wrapper.focusInput();
    wrapper.findInput().simulate('keyDown', { which: KeyCode.UP });
    expect(wrapper.getInputValue()).toEqual('$ 6 ¥');
    expect(onChange).toHaveBeenCalledWith(6);

    wrapper.findInput().simulate('keyDown', { which: KeyCode.DOWN });
    expect(wrapper.getInputValue()).toEqual('$ 5 ¥');
    expect(onChange).toHaveBeenCalledWith(5);
  });

  // it('formatter on direct input', () => {
  //   let onChangeFirstArgumentFormat;

  //   class Demo extends React.Component {
  //     state = {
  //       value: 5,
  //     };

  //     onChange = (value) => {
  //       onChangeFirstArgumentFormat = value;
  //       this.setState({ value });
  //     };

  //     render() {
  //       return (
  //         <InputNumber
  //           ref="inputNum"
  //           step={1}
  //           defaultValue={5}
  //           formatter={(num) => `$ ${num}`}
  //           onChange={this.onChange}
  //         />
  //       );
  //     }
  //   }
  //   example = ReactDOM.render(<Demo />, container);
  //   inputNumber = example.refs.inputNum;
  //   inputElement = ReactDOM.findDOMNode(inputNumber.input);

  //   Simulate.focus(inputElement);
  //   Simulate.change(inputElement, { target: { value: '100' } });
  //   expect(inputElement.value).to.be('$ 100');
  //   expect(onChangeFirstArgumentFormat).to.be(100);
  //   Simulate.blur(inputElement);
  //   expect(inputElement.value).to.be('$ 100');
  //   expect(inputNumber.state.value).to.be(100);
  // });

  // it('formatter and parser', () => {
  //   class Demo extends React.Component {
  //     render() {
  //       return (
  //         <InputNumber
  //           ref="inputNum"
  //           step={1}
  //           defaultValue={5}
  //           useTouch
  //           formatter={(num) => `$ ${num} boeing 737`}
  //           parser={(num) => num.toString().split(' ')[1]}
  //         />
  //       );
  //     }
  //   }
  //   example = ReactDOM.render(<Demo />, container);
  //   inputNumber = example.refs.inputNum;
  //   inputElement = ReactDOM.findDOMNode(inputNumber.input);
  //   Simulate.focus(inputElement);
  //   Simulate.keyDown(inputElement, { keyCode: keyCode.UP });
  //   expect(inputNumber.state.value).to.be(6);
  //   expect(inputElement.value).to.be('$ 6 boeing 737');
  //   Simulate.keyDown(inputElement, { keyCode: keyCode.DOWN });
  //   expect(inputNumber.state.value).to.be(5);
  //   expect(inputElement.value).to.be('$ 5 boeing 737');
  //   Simulate.touchStart(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
  //   expect(inputNumber.state.value).to.be(6);
  //   expect(inputElement.value).to.be('$ 6 boeing 737');
  // });
});
