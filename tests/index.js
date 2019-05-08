/* eslint-disable react/no-multi-comp, no-unused-vars */
import 'core-js/es6/map';
import 'core-js/es6/set';
import '../assets/index.less';
import keyCode from 'rc-util/lib/KeyCode';
import expect from 'expect.js';
import InputNumber from '../src';
import React from 'react';
import { Simulate, findRenderedDOMComponentWithTag } from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import createReactClass from 'create-react-class';

const defaultValue = 98;

describe('inputNumber', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let onChangeFirstArgument;
  let onChangeCallCount = 0;
  let onFocusCallCount = 0;
  let onBlurCallCount = 0;

  const Component = createReactClass({
    getInitialState() {
      return {
        min: 1,
        max: 200,
        value: defaultValue,
        step: 1,
        disabled: false,
        autoFocus: false,
        readOnly: false,
        name: 'inputNumber',
      };
    },
    onChange(value) {
      onChangeFirstArgument = value;
      onChangeCallCount += 1;
      this.setState({ value });
    },
    onFocus() {
      onFocusCallCount += 1;
    },
    onBlur() {
      onBlurCallCount += 1;
    },
    triggerBoolean(propName) {
      const prop = {};
      prop[propName] = !this.state[propName];
      this.setState(prop);
    },
    render() {
      return (
        <div>
          <InputNumber
            ref="inputNum"
            min={this.state.min}
            max={this.state.max}
            onChange={this.onChange}
            value={this.state.value}
            step={this.state.step}
            disabled={this.state.disabled}
            autoFocus={this.state.autoFocus}
            readOnly={this.state.readOnly}
            name={this.state.name}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
        </div>
      );
    },
  });

  let inputNumber;
  let example;
  let inputElement;
  beforeEach(() => {
    example = ReactDOM.render(<Component />, container);
    inputNumber = example.refs.inputNum;
    inputElement = ReactDOM.findDOMNode(inputNumber.input);
    onChangeCallCount = 0;
    onFocusCallCount = 0;
    onBlurCallCount = 0;
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    onChangeCallCount = 0;
    onFocusCallCount = 0;
    onBlurCallCount = 0;
  });

  describe('keyboard works', () => {
    it('up works', () => {
      Simulate.keyDown(inputElement, {
        keyCode: keyCode.UP,
      });
      expect(inputNumber.state.value).to.be(99);
    });

    it('down works', () => {
      Simulate.keyDown(inputElement, {
        keyCode: keyCode.DOWN,
      });
      expect(inputNumber.state.value).to.be(97);
    });

    it('combination keys works', () => {
      Simulate.keyDown(inputElement, {
        keyCode: keyCode.DOWN, shiftKey: true,
      });
      expect(inputNumber.state.value).to.be(88);

      Simulate.keyDown(inputElement, {
        keyCode: keyCode.UP, ctrlKey: true,
      });
      expect(inputNumber.state.value).to.be(88.1);

      Simulate.keyDown(inputElement, {
        keyCode: keyCode.UP, shiftKey: true,
      });
      expect(inputNumber.state.value).to.be(98.1);

      Simulate.keyDown(inputElement, {
        keyCode: keyCode.DOWN, ctrlKey: true,
      });
      expect(inputNumber.state.value).to.be(98);
    });
  });

  describe('clickable', () => {
    it('up button works', () => {
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.upHandler));
      expect(inputNumber.state.value).to.be(99);
    });

    it('down button works', () => {
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.downHandler));
      expect(inputNumber.state.value).to.be(97);
    });

    it('up button works on empty input', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.upHandler));
      expect(inputNumber.state.value).to.be(1);
    });

    it('down button works on empty input', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.downHandler));
      expect(inputNumber.state.value).to.be(-1);
    });

    it('up button works on empty input with min and max', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" min={6} max={10} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.upHandler));
      expect(inputNumber.state.value).to.be(6);
    });

    it('up button works null input with min and max', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" value={null} min={6} max={10} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.upHandler));
      expect(inputNumber.state.value).to.be(null);
    });

    it('down button works on empty input with min and max', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" min={6} max={10} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.downHandler));
      expect(inputNumber.state.value).to.be(6);
    });

    it('should not disable up and down buttons', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      expect(
        ReactDOM.findDOMNode(inputNumber.upHandler).className.indexOf('disabled') > 0
      ).to.be(false);
      expect(
        ReactDOM.findDOMNode(inputNumber.downHandler).className.indexOf('disabled') > 0
      ).to.be(false);
    });

    it('should record current properties upon mouse up', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref={"inputNum"} value={123} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);

      inputNumber = example.refs.inputNum;
      const inputField = ReactDOM.findDOMNode(inputNumber.input);

      expect(inputNumber.currentValue).to.be(undefined);
      expect(inputNumber.cursorStart).to.be(undefined);
      expect(inputNumber.cursorEnd).to.be(undefined);
      Simulate.mouseUp(inputField);

      expect(inputNumber.cursorStart).to.be(3);
      expect(inputNumber.cursorEnd).to.be(3);
      expect(inputNumber.currentValue).to.be('123');
    });
  });

  describe('long press', () => {
    it('up button works', (done) => {
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.upHandler));
      setTimeout(() => {
        expect(inputNumber.state.value).to.be(99);
        setTimeout(() => {
          expect(inputNumber.state.value).to.above(99);
          done();
        }, 200);
      }, 500);
    });

    it('down button works', (done) => {
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.downHandler));
      setTimeout(() => {
        expect(inputNumber.state.value).to.be(97);
        setTimeout(() => {
          expect(inputNumber.state.value).to.below(97);
          done();
        }, 200);
      }, 500);
    });
  });

  describe('check props works', () => {
    it('max', () => {
      for (let i = 0; i < 3; i++) {
        Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.upHandler));
      }
      expect(inputNumber.state.value).to.be(101);
    });

    it('min', () => {
      for (let i = 0; i < 100; i++) {
        Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.downHandler));
      }
      expect(inputNumber.state.value).to.be(1);
    });

    it('disabled', () => {
      example.triggerBoolean('disabled');
      expect(inputNumber.props.disabled).to.be(true);
    });

    it('readonly', () => {
      example.triggerBoolean('readOnly');
      expect(inputNumber.props.readOnly).to.be(true);
    });

    it('autofocus', () => {
      example.triggerBoolean('autoFocus');
      expect(inputNumber.props.autoFocus).to.be(true);
    });

    it('step', () => {
      example.setState({ step: 5 });
      for (let i = 0; i < 3; i++) {
        Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.downHandler));
      }
      expect(inputNumber.state.value).to.be(defaultValue - 3 * 5);
    });

    it('step read only', () => {
      // testing in read only.
      example.setState({ step: 5 });
      example.triggerBoolean('readOnly');
      for (let i = 0; i < 3; i++) {
        Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.downHandler));
      }
      expect(inputNumber.state.value).to.be(defaultValue);
    });

    it('decimal step', () => {
      example.setState({ step: 0.1 });
      for (let i = 0; i < 3; i++) {
        Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.downHandler));
      }
      expect(inputNumber.state.value).to.be(defaultValue - 3 * 0.1);
    });

    it('controlled component will restore when blur input', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" value={1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(1);
      expect(inputElement.value).to.be('1');
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '6' } });
      expect(inputNumber.state.value).to.be(1);
      expect(inputElement.value).to.be('6');
      Simulate.blur(inputElement);
      expect(inputNumber.state.value).to.be(1);
      expect(inputElement.value).to.be('1');
    });

    // Fix https://github.com/ant-design/ant-design/issues/7334
    it('controlled component will show limited value when input is not focused', () => {
      class Demo extends React.Component {
        state = {
          value: 2,
        };
        changeValue = () => {
          this.setState({ value: '103aa' });
        };
        render() {
          return (
            <div>
              <button onClick={this.changeValue}>change value</button>
              <InputNumber ref="inputNum" min={1} max={10} value={this.state.value} />
            </div>
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(2);
      expect(inputElement.value).to.be('2');
      Simulate.click(findRenderedDOMComponentWithTag(example, 'button'));
      expect(inputNumber.state.value).to.be(10);
      expect(inputElement.value).to.be('10');
    });

    // https://github.com/ant-design/ant-design/issues/7358
    it('controlled component should accept undefined value', () => {
      class Demo extends React.Component {
        state = {
          value: 2,
        };
        changeValue = () => {
          this.setState({ value: undefined });
        };
        render() {
          return (
            <div>
              <button onClick={this.changeValue}>change value</button>
              <InputNumber ref="inputNum" min={1} max={10} value={this.state.value} />
            </div>
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(2);
      expect(inputElement.value).to.be('2');
      Simulate.click(findRenderedDOMComponentWithTag(example, 'button'));
      expect(inputNumber.state.value).to.be(undefined);
      expect(inputElement.value).to.be('');
    });
  });

  describe('check value changes with readonly props set to true', () => {
    it('no value changes after readonly works', () => {
      example.triggerBoolean('readOnly');
      Simulate.focus(inputElement);
      Simulate.keyDown(inputElement, { keyCode: keyCode.UP });
      expect(inputNumber.state.value).to.be(98);
      Simulate.keyDown(inputElement, { keyCode: keyCode.DOWN });
      expect(inputNumber.state.value).to.be(98);
    });
  });

  describe('input directly', () => {
    it('input valid number', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '6' } });
      expect(inputElement.value).to.be('6');
      expect(onChangeFirstArgument).to.be(6);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('6');
      expect(onChangeFirstArgument).to.be(6);
    });

    it('input invalid number', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: 'xx' } });
      expect(inputElement.value).to.be('xx');
      expect(onChangeFirstArgument).to.be('xx');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('');
      expect(onChangeFirstArgument).to.be(null);
    });

    it('input invalid string with number', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '2x' } });
      expect(inputElement.value).to.be('2x');
      expect(onChangeFirstArgument).to.be('2x');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('2');
      expect(onChangeFirstArgument).to.be(2);
    });

    it('input invalid decimal point with max number', () => {
      example.setState({ max: 10 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '15.' } });
      expect(inputElement.value).to.be('15.');
      expect(onChangeFirstArgument).to.be('15.');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('10');
      expect(onChangeFirstArgument).to.be(10);
    });

    it('input invalid decimal point with min number', () => {
      example.setState({ min: 5 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '3.' } });
      expect(inputElement.value).to.be('3.');
      expect(onChangeFirstArgument).to.be('3.');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('5');
      expect(onChangeFirstArgument).to.be(5);
    });

    it('input negative symbol', () => {
      example.setState({ min: -100 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '-' } });
      expect(inputElement.value).to.be('-');
      expect(onChangeFirstArgument).to.be('-');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('');
      expect(onChangeFirstArgument).to.be(null);
    });

    it('input negative number', () => {
      example.setState({ min: -100 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '-98' } });
      expect(inputElement.value).to.be('-98');
      expect(onChangeFirstArgument).to.be(-98);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('-98');
      expect(onChangeFirstArgument).to.be(-98);
    });

    // https://github.com/ant-design/ant-design/issues/9439
    it('input negative zero', () => {
      example.setState({ min: -100 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '-0' } });
      expect(inputElement.value).to.be('-0');
      expect(onChangeFirstArgument).to.be(0);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('0');
      expect(onChangeFirstArgument).to.be(0);
    });

    it('input decimal number with integer step', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '1.2' } });
      expect(inputElement.value).to.be('1.2');
      expect(onChangeFirstArgument).to.be(1.2);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('1.2');
      expect(onChangeFirstArgument).to.be(1.2);
    });

    it('input decimal number with decimal step', () => {
      example.setState({ step: 0.1 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '1.2' } });
      expect(inputElement.value).to.be('1.2');
      expect(onChangeFirstArgument).to.be(1.2);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('1.2');
      expect(onChangeFirstArgument).to.be(1.2);
    });

    it('input empty text and blur', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '' } });
      expect(inputElement.value).to.be('');
      expect(onChangeFirstArgument).to.be('');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('');
      expect(onChangeFirstArgument).to.be(null);
    });

    it('blur on default input', () => {
      const onChange = sinon.spy();
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" onChange={onChange} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.blur(inputElement);
      expect(onChange.called).to.be(false);
    });
  });

  describe('default value', () => {
    it('default value should be empty', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputElement.value).to.be('');
    });

    it('default value should be empty when step is decimal', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" step={0.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputElement.value).to.be('');
    });

    it('default value should be 1', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" defaultValue={1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(1);
      expect(inputElement.value).to.be('1');
    });

    it('default value could be null', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" defaultValue={null} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(null);
      expect(inputElement.value).to.be('');
    });

    it('default value shouldn\'t higher than max', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" min={0} max={10} defaultValue={13} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(10);
    });

    it('default value shouldn\'t lower than min', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" min={0} max={10} defaultValue={-1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(0);
    });
  });

  describe('value', () => {
    it('value shouldn\'t higher than max', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" min={0} max={10} value={13} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(10);
    });

    it('value shouldn\'t lower than min', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" min={0} max={10} value={-1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(0);
    });
  });

  describe('decimal', () => {
    it('decimal value', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" step={1} value={2.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.1');
    });

    it('decimal defaultValue', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" step={1} defaultValue={2.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.1');
    });

    it('increase and decrease decimal InputNumber by integer step', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" step={1} defaultValue={2.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.upHandler));
      expect(inputNumber.state.value).to.be(3.1);
      expect(inputElement.value).to.be('3.1');
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.downHandler));
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.1');
    });

    it('small value and step', () => {
      const Demo = createReactClass({
        getInitialState() {
          return {
            value: 0.000000001,
          };
        },
        onChange(v) {
          this.setState({
            value: v,
          });
        },
        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={this.state.value}
              step={0.000000001}
              min={-10}
              max={10}
              onChange={this.onChange}
            />
          );
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(0.000000001);
      expect(inputElement.value).to.be('0.000000001');
      for (let i = 0; i < 10; i++) {
        // plus until change precision
        Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.upHandler));
      }
      Simulate.blur(inputElement);
      expect(inputNumber.state.value).to.be(0.000000011);
      expect(inputElement.value).to.be('0.000000011');
    });

    it('small step with integer value', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" value={1} step="0.000000001" />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(1);
      expect(inputElement.value).to.be('1.000000000');
    });

    it('custom decimal separator', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" decimalSeparator="," />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '1,1' } });
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('1,1');
      expect(inputNumber.state.value).to.be(1.1);
    });
  });

  describe('GitHub issues', () => {
    // https://github.com/react-component/input-number/issues/32
    it('issue 32', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" step={0.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '2' } });
      expect(inputNumber.state.value).to.be(undefined);
      expect(inputElement.value).to.be('2');
      Simulate.blur(inputElement);
      expect(inputNumber.state.value).to.be(2);
      expect(inputElement.value).to.be('2.0');
    });

    // https://github.com/react-component/input-number/issues/35
    it('issue 35', () => {
      let num;
      const Demo = createReactClass({
        render() {
          return (
            <InputNumber
              ref="inputNum"
              step={0.01}
              defaultValue={2}
              onChange={value => { num = value; } }
            />
          );
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      for (let i = 1; i <= 400; i++) {
        Simulate.keyDown(inputElement, {
          keyCode: keyCode.DOWN,
        });
        // no number like 1.5499999999999999
        expect((num.toString().split('.')[1] || '').length).to.below(3);
        const expectedValue = Number(((200 - i) / 100).toFixed(2));
        expect(inputNumber.state.value).to.be(expectedValue);
        expect(num).to.be(expectedValue);
      }

      for (let i = 1; i <= 300; i++) {
        Simulate.keyDown(inputElement, {
          keyCode: keyCode.UP,
        });
        // no number like 1.5499999999999999
        expect((num.toString().split('.')[1] || '').length).to.below(3);
        const expectedValue = Number(((i - 200) / 100).toFixed(2));
        expect(num).to.be(expectedValue);
        expect(inputNumber.state.value).to.be(expectedValue);
      }
    }).timeout(10000);

    // https://github.com/ant-design/ant-design/issues/4229
    it('long press not trigger onChange in uncontrolled component', (done) => {
      let num;
      const Demo = createReactClass({
        render() {
          return (
            <InputNumber
              ref="inputNum"
              defaultValue={0}
              onChange={value => { num = value; } }
            />
          );
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;

      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.upHandler));
      setTimeout(() => {
        expect(num).to.be(1);
        setTimeout(() => {
          expect(num).to.above(1);
          done();
        }, 200);
      }, 500);
    });

    // https://github.com/ant-design/ant-design/issues/4757
    it('should allow to input text like "1."', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '1.' } });
      expect(inputElement.value).to.be('1.');
      expect(onChangeFirstArgument).to.be('1.');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('1');
      expect(onChangeFirstArgument).to.be(1);
    });

    // https://github.com/ant-design/ant-design/issues/5012
    // https://github.com/react-component/input-number/issues/64
    it('controller InputNumber should be able to input number like 1.00* and 1.10*', () => {
      let num;
      const Demo = createReactClass({
        getInitialState() {
          return { value: 2 };
        },
        onChange(value) {
          this.setState({ value });
        },
        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={this.state.value}
              onChange={value => { num = value; this.onChange(value); } }
            />
          );
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '6.0' } });
      expect(inputElement.value).to.be('6.0');
      expect(num).to.be(6);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('6');
      expect(num).to.be(6);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '6.10' } });
      expect(inputElement.value).to.be('6.10');
      expect(num).to.be(6.1);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('6.1');
      expect(num).to.be(6.1);
    });

    it('onChange should not be called when input is not changed', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '1' } });
      expect(onChangeCallCount).to.be(1);
      expect(onChangeFirstArgument).to.be(1);
      Simulate.blur(inputElement);
      expect(onChangeCallCount).to.be(1);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '' } });
      expect(onChangeCallCount).to.be(2);
      expect(onChangeFirstArgument).to.be('');
      Simulate.blur(inputElement);
      expect(onChangeCallCount).to.be(3);
      expect(onChangeFirstArgument).to.be(null);
      Simulate.focus(inputElement);
      Simulate.blur(inputElement);
      expect(onChangeCallCount).to.be(3);
    });

    // https://github.com/ant-design/ant-design/issues/5235
    it('input long number', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '111111111111111111111' } });
      expect(inputElement.value).to.be('111111111111111111111');
      Simulate.change(inputElement, { target: { value: '11111111111111111111111111111' } });
      expect(inputElement.value).to.be('11111111111111111111111111111');
    });

    // https://github.com/ant-design/ant-design/issues/7363
    it('uncontrolled input should trigger onChange always when blur it', () => {
      const onChange = sinon.spy();
      inputNumber = ReactDOM.render(
        <InputNumber
          min={1}
          max={10}
          onChange={onChange}
        />
      , container);
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '123' } });
      expect(onChange.callCount).to.be(1);
      expect(onChange.calledWith(123)).to.be(true);
      Simulate.blur(inputElement);
      expect(onChange.callCount).to.be(2);
      expect(onChange.calledWith(10)).to.be(true);

      // repeat it, it should works in same way
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '123' } });
      expect(onChange.callCount).to.be(3);
      expect(onChange.calledWith(123)).to.be(true);
      Simulate.blur(inputElement);
      expect(onChange.callCount).to.be(4);
      expect(onChange.calledWith(10)).to.be(true);
    });

    // https://github.com/ant-design/ant-design/issues/7867
    it('focus should not cut precision of input value', () => {
      const Demo = createReactClass({
        getInitialState() {
          return { value: 2 };
        },
        onBlur(value) {
          this.setState({ value: 2 });
        },
        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={this.state.value}
              step={0.1}
              onBlur={this.onBlur}
            />
          );
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('2.0');
      Simulate.focus(inputElement);
      expect(inputElement.value).to.be('2.0');
    });

    // https://github.com/ant-design/ant-design/issues/7940
    it('should not format during input', () => {
      const Demo = createReactClass({
        getInitialState() {
          return { value: '' };
        },
        onChange(value) {
          this.setState({ value });
        },
        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={this.state.value}
              step={0.1}
              onChange={this.onChange}
            />
          );
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '1' } });
      expect(inputElement.value).to.be('1');
    });

    // https://github.com/ant-design/ant-design/issues/8196
    it('Allow inputing 。', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '8。1' } });
      expect(inputElement.value).to.be('8.1');
    });

    it('focus input when click up/down button ', () => {
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.upHandler));
      expect(ReactDOM.findDOMNode(inputNumber).className.indexOf('focused') > 0).to.be(true);
      expect(document.activeElement).to.be(inputElement);
      expect(onFocusCallCount).to.be(1);
      Simulate.blur(inputElement);
      expect(onBlurCallCount).to.be(1);
      expect(ReactDOM.findDOMNode(inputNumber).className.indexOf('focused') > 0).to.be(false);
    });

    // https://github.com/ant-design/ant-design/issues/11574
    it('should trigger onChange when max or min change', () => {
      const onChange = sinon.spy();
      class Demo extends Component {
        state = {
          value: 10,
          min: 0,
          max: 20,
        };
        onChange = (value) => {
          this.setValue(value);
          onChange(value);
        }
        setMax(max) {
          this.setState({ max });
        }
        setMin(min) {
          this.setState({ min });
        }
        setValue(value) {
          this.setState({ value });
        }
        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={this.state.value}
              onChange={this.onChange}
              max={this.state.max}
              min={this.state.min}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      example.setMin(11);
      expect(inputElement.value).to.be('11');
      expect(onChange.calledWith(11)).to.be(true);

      example.setValue(15);

      example.setMax(14);
      expect(inputElement.value).to.be('14');
      expect(onChange.calledWith(14)).to.be(true);
    });

    // https://github.com/react-component/input-number/issues/120
    it('should not reset value when parent rerenders with the same `value` prop', () => {
      class Demo extends React.Component {
        state = { value: 40 };

        onChange = () => {
          this.forceUpdate();
        };

        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={this.state.value}
              onChange={this.onChange}
            />
          );
        }
      }

      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '401' } });

      // Demo rerenders and the `value` prop is still 40, but the user input should
      // be retained
      expect(inputElement.value).to.be('401');
    });
  });

  describe(`required prop`, () => {
    it(`should add required attr to the input tag when get passed as true`, () => {
      ReactDOM.render(<InputNumber id="required-input-test" required />, container);
      const inputTag = container.querySelector('#required-input-test');
      expect(
        inputTag.getAttribute(`required`)
      ).not.to.be(null);
    });

    it(`should not add required attr to the input as default props when not being supplied`, () => {
      ReactDOM.render(<InputNumber id="required-input-test" />, container);
      const inputTag = container.querySelector('#required-input-test');
      expect(
        inputTag.getAttribute(`required`)
      ).to.be(null);
    });

    it(`should not add required attr to the input tag when get passed as false`, () => {
      ReactDOM.render(<InputNumber id="required-input-test" required={false} />, container);
      const inputTag = container.querySelector('#required-input-test');
      expect(
        inputTag.getAttribute(`required`)
      ).to.be(null);
    });
  });

  describe('Pattern prop', () => {
    it(`should render with a pattern attribute if the pattern prop is supplied`, () => {
      ReactDOM.render(<InputNumber id="pattern-input-test" pattern="\d*" />, container);
      const patternAttribute = container
        .querySelector('#pattern-input-test')
        .getAttribute(`pattern`);
      expect(patternAttribute).to.equal('\\d*');
    });

    it(`should render with no pattern attribute if the pattern prop is not supplied`, () => {
      ReactDOM.render(<InputNumber id="pattern-input-test" />, container);
      const patternAttribute = container
        .querySelector('#pattern-input-test')
        .getAttribute(`pattern`);
      expect(patternAttribute).to.be(null);
    });
  });

  describe('precision', () => {
    it('decimal step should not display complete precision', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" step={0.01} value={2.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.10');
    });

    it('string step should display complete precision', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" step="1.000" value={2.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.100');
    });

    it('prop precision is specified', () => {
      const Demo = createReactClass({
        onChange(value) {
          onChangeFirstArgument = value;
        },
        render() {
          return (
            <InputNumber ref="inputNum" precision={2} defaultValue={2} onChange={this.onChange} />
          );
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputElement.value).to.be('2.00');
      Simulate.change(inputElement, { target: { value: '3.456' } });
      Simulate.blur(inputElement);
      expect(onChangeFirstArgument).to.be(3.46);
      expect(inputElement.value).to.be('3.46');
      Simulate.change(inputElement, { target: { value: '1' } });
      Simulate.blur(inputElement);
      expect(onChangeFirstArgument).to.be(1);
      expect(inputElement.value).to.be('1.00');
    });
  });

  describe('formatter', () => {
    it('formatter on default', () => {
      const Demo = createReactClass({
        render() {
          return (<InputNumber
            ref="inputNum"
            step={1}
            value={5}
            formatter={num => `$ ${num}`}
          />);
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      expect(inputNumber.state.value).to.be(5);
      expect(inputElement.value).to.be('$ 5');
    });

    it('formatter on mousedown', () => {
      const Demo = createReactClass({
        render() {
          return (<InputNumber
            ref="inputNum"
            step={1}
            defaultValue={5}
            formatter={num => `$ ${num}`}
          />);
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.upHandler));
      expect(inputNumber.state.value).to.be(6);
      expect(inputElement.value).to.be('$ 6');
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.downHandler));
      expect(inputNumber.state.value).to.be(5);
      expect(inputElement.value).to.be('$ 5');
    });

    it('formatter on touchstart', () => {
      const Demo = createReactClass({
        render() {
          return (<InputNumber
            ref="inputNum"
            step={1}
            defaultValue={5}
            useTouch
            formatter={num => `${num} ¥`}
          />);
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      Simulate.touchStart(ReactDOM.findDOMNode(inputNumber.upHandler));
      expect(inputNumber.state.value).to.be(6);
      expect(inputElement.value).to.be('6 ¥');
      Simulate.touchStart(ReactDOM.findDOMNode(inputNumber.downHandler));
      expect(inputNumber.state.value).to.be(5);
      expect(inputElement.value).to.be('5 ¥');
    });

    it('formatter on keydown', () => {
      const Demo = createReactClass({
        render() {
          return (<InputNumber
            ref="inputNum"
            step={1}
            defaultValue={5}
            formatter={num => `$ ${num} ¥`}
          />);
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      Simulate.focus(inputElement);
      Simulate.keyDown(inputElement, { keyCode: keyCode.UP });
      expect(inputNumber.state.value).to.be(6);
      expect(inputElement.value).to.be('$ 6 ¥');
      Simulate.keyDown(inputElement, { keyCode: keyCode.DOWN });
      expect(inputNumber.state.value).to.be(5);
      expect(inputElement.value).to.be('$ 5 ¥');
    });

    it('formatter on direct input', () => {
      let onChangeFirstArgumentFormat;
      let onChangeCallCountFormat = 0;

      const Demo = createReactClass({
        getInitialState() {
          return { value: 5 };
        },
        onChange(value) {
          onChangeFirstArgumentFormat = value;
          onChangeCallCountFormat += 1;
          this.setState({ value });
        },
        render() {
          return (<InputNumber
            ref="inputNum"
            step={1}
            defaultValue={5}
            formatter={num => `$ ${num}`}
            onChange={this.onChange}
          />);
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '100' } });
      expect(inputElement.value).to.be('$ 100');
      expect(onChangeFirstArgumentFormat).to.be(100);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('$ 100');
      expect(inputNumber.state.value).to.be(100);
    });

    it('formatter and parser', () => {
      const Demo = createReactClass({
        render() {
          return (<InputNumber
            ref="inputNum"
            step={1}
            defaultValue={5}
            useTouch
            formatter={num => `$ ${num} boeing 737`}
            parser={num => num.toString().split(' ')[1]}
          />);
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.keyDown(inputElement, { keyCode: keyCode.UP });
      expect(inputNumber.state.value).to.be(6);
      expect(inputElement.value).to.be('$ 6 boeing 737');
      Simulate.keyDown(inputElement, { keyCode: keyCode.DOWN });
      expect(inputNumber.state.value).to.be(5);
      expect(inputElement.value).to.be('$ 5 boeing 737');
      Simulate.touchStart(ReactDOM.findDOMNode(inputNumber.upHandler));
      expect(inputNumber.state.value).to.be(6);
      expect(inputElement.value).to.be('$ 6 boeing 737');
    });
  });

  describe('aria and data props', () => {
    it('passes data-* attributes', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" value={1} data-test="test-id" data-id="12345"/>;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputElement.getAttribute('data-test')).to.be('test-id');
      expect(inputElement.getAttribute('data-id')).to.be('12345');
    });

    it('passes aria-* attributes', () => {
      const Demo = createReactClass({
        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={1}
              aria-labelledby="test-id"
              aria-label="some-label"
            />
          );
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputElement.getAttribute('aria-labelledby')).to.be('test-id');
      expect(inputElement.getAttribute('aria-label')).to.be('some-label');
    });

    it('passes role attribute', () => {
      const Demo = createReactClass({
        render() {
          return <InputNumber ref="inputNum" value={1} role="searchbox"/>;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputElement.getAttribute('role')).to.be('searchbox');
    });
  });
});

describe('Mobile inputNumber use TouchEvents', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let onChangeFirstArgument;
  let onChangeCallCount = 0;

  const Component = createReactClass({
    getInitialState() {
      return {
        min: 1,
        max: 200,
        value: defaultValue,
        step: 1,
        disabled: false,
        autoFocus: false,
        readOnly: false,
        name: 'inputNumber',
      };
    },
    onChange(value) {
      onChangeFirstArgument = value;
      onChangeCallCount += 1;
      this.setState({ value });
    },
    triggerBoolean(propName) {
      const prop = {};
      prop[propName] = !this.state[propName];
      this.setState(prop);
    },
    render() {
      return (
        <div>
          <InputNumber
            ref="inputNum"
            min={this.state.min}
            max={this.state.max}
            onChange={this.onChange}
            value={this.state.value}
            step={this.state.step}
            disabled={this.state.disabled}
            autoFocus={this.state.autoFocus}
            readOnly={this.state.readOnly}
            name={this.state.name}
            useTouch
          />
        </div>
      );
    },
  });

  let inputNumber;
  let example;
  let inputElement;
  beforeEach(() => {
    example = ReactDOM.render(<Component />, container);
    inputNumber = example.refs.inputNum;
    inputElement = ReactDOM.findDOMNode(inputNumber.input);
    onChangeCallCount = 0;
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    onChangeCallCount = 0;
  });

  describe('touchable', () => {
    it('up button works', () => {
      Simulate.touchStart(ReactDOM.findDOMNode(inputNumber.upHandler));
      expect(inputNumber.state.value).to.be(99);
    });

    it('down button works', () => {
      Simulate.touchStart(ReactDOM.findDOMNode(inputNumber.downHandler));
      expect(inputNumber.state.value).to.be(97);
    });
  });
});
