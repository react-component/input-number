import React from 'react';
import { mount } from './util/wrapper';
import InputNumber from '../src';

jest.mock('rc-util/lib/isMobile', () => () => true);

// Mobile touch experience is not user friendly which not apply in antd.
// Let's hide operator instead.

describe('InputNumber.Mobile', () => {
  it('not show steps when mobile', () => {
    const wrapper = mount(<InputNumber />);
    expect(wrapper.exists('.rc-input-number-handler-wrap')).toBeFalsy();
  });
});

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

// describe('Mobile inputNumber use TouchEvents', () => {
//   const container = document.createElement('div');
//   document.body.appendChild(container);

//   class Component extends React.Component {
//     state = {
//       min: 1,
//       max: 200,
//       value: defaultValue,
//       step: 1,
//       disabled: false,
//       autoFocus: false,
//       readOnly: false,
//       name: 'inputNumber',
//     };

//     onChange = value => {
//       this.setState({ value });
//     };

//     triggerBoolean = propName => {
//       const prop = {};
//       prop[propName] = !this.state[propName];
//       this.setState(prop);
//     };

//     render() {
//       return (
//         <div>
//           <InputNumber
//             ref="inputNum"
//             min={this.state.min}
//             max={this.state.max}
//             onChange={this.onChange}
//             value={this.state.value}
//             step={this.state.step}
//             disabled={this.state.disabled}
//             autoFocus={this.state.autoFocus}
//             readOnly={this.state.readOnly}
//             name={this.state.name}
//             useTouch
//           />
//         </div>
//       );
//     }
//   }

//   let inputNumber;
//   let example;
//   let inputElement;
//   beforeEach(() => {
//     example = ReactDOM.render(<Component />, container);
//     inputNumber = example.refs.inputNum;
//     inputElement = ReactDOM.findDOMNode(inputNumber.input);
//   });

//   afterEach(() => {
//     ReactDOM.unmountComponentAtNode(container);
//   });

//   describe('touchable', () => {
//     it('up button works', () => {
//       Simulate.touchStart(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
//       expect(inputNumber.state.value).to.be(99);
//     });

//     it('down button works', () => {
//       Simulate.touchStart(
//         findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
//       );
//       expect(inputNumber.state.value).to.be(97);
//     });
//   });

//   // https://github.com/ant-design/ant-design/issues/17593
//   it('onBlur should be sync', () => {
//     class Demo extends React.Component {
//       render() {
//         return (
//           <InputNumber
//             onBlur={({ target: { value } }) => {
//               expect(value).to.be('1');
//             }}
//             mergedPPrecision={0}
//             ref="inputNum"
//           />
//         );
//       }
//     }
//     example = ReactDOM.render(<Demo />, container);
//     inputNumber = example.refs.inputNum;
//     inputElement = ReactDOM.findDOMNode(inputNumber.input);
//     Simulate.focus(inputElement);
//     inputElement.value = '1.2';
//     Simulate.change(inputElement);
//     Simulate.blur(inputElement);
//     expect(inputElement.value).to.be('1');
//   });
// });
