/* eslint-disable react/no-multi-comp */
require('../assets/index.less');
const keyCode = require('rc-util/lib/KeyCode');
const expect = require('expect.js');
const InputNum = require('../index');
const React = require('react');
const TestUtils = require('react-addons-test-utils');
const ReactDOM = require('react-dom');
const Simulate = TestUtils.Simulate;
require('../assets/index.less');

const defaultValue = 98;

describe('inputNumber', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let onChangeFirstArgument;

  const Component = React.createClass({
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
          <InputNum
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
    inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
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
  });

  describe('clickable', () => {
    it('up button works', () => {
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.refs.up));
      expect(inputNumber.state.value).to.be(99);
    });

    it('down button works', () => {
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.refs.down));
      expect(inputNumber.state.value).to.be(97);
    });
  });

  describe('touchable', () => {
    it('up button works', () => {
      Simulate.touchStart(ReactDOM.findDOMNode(inputNumber.refs.up));
      expect(inputNumber.state.value).to.be(99);
    });

    it('down button works', () => {
      Simulate.touchStart(ReactDOM.findDOMNode(inputNumber.refs.down));
      expect(inputNumber.state.value).to.be(97);
    });
  });

  describe('long press', () => {
    it('up button works', (done) => {
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.refs.up));
      setTimeout(() => {
        expect(inputNumber.state.value).to.be(99);
        setTimeout(() => {
          expect(inputNumber.state.value).to.above(99);
          done();
        }, 200);
      }, 500);
    });

    it('down button works', (done) => {
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.refs.down));
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
        Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.refs.up));
      }
      expect(inputNumber.state.value).to.be(101);
    });

    it('min', () => {
      for (let i = 0; i < 100; i++) {
        Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.refs.down));
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
        Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.refs.down));
      }
      expect(inputNumber.state.value).to.be(defaultValue - 3 * 5);
    });

    it('step read only', () => {
      // testing in read only.
      example.setState({ step: 5 });
      example.triggerBoolean('readOnly');
      for (let i = 0; i < 3; i++) {
        Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.refs.down));
      }
      expect(inputNumber.state.value).to.be(defaultValue);
    });

    it('decimal step', () => {
      example.setState({ step: 0.1 });
      for (let i = 0; i < 3; i++) {
        Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.refs.down));
      }
      expect(inputNumber.state.value).to.be(defaultValue - 3 * 0.1);
    });

    it('controlled component will restore when blur input', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" value={1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
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
      expect(onChangeFirstArgument).to.be(undefined);
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

    it('input negative symbol', () => {
      example.setState({ min: -100 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '-' } });
      expect(inputElement.value).to.be('-');
      expect(onChangeFirstArgument).to.be('-');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('');
      expect(onChangeFirstArgument).to.be(undefined);
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
      expect(onChangeFirstArgument).to.be(undefined);
    });
  });

  describe('default value', () => {
    it('default value should be empty', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
      expect(inputNumber.state.value).to.be('');
      expect(inputElement.value).to.be('');
    });

    it('default value should be empty when step is decimal', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" step={0.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
      expect(inputNumber.state.value).to.be('');
      expect(inputElement.value).to.be('');
    });

    it('default value should be 1', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" defaultValue={1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
      expect(inputNumber.state.value).to.be(1);
      expect(inputElement.value).to.be('1');
    });
  });

  describe('decimal', () => {
    it('decimal value', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" step={1} value={2.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.1');
    });

    it('decimal defaultValue', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" step={1} defaultValue={2.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.1');
    });

    it('increase and decrease decimal InputNumber by integer step', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" step={1} defaultValue={2.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.refs.up));
      expect(inputNumber.state.value).to.be(3.1);
      expect(inputElement.value).to.be('3.1');
      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.refs.down));
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.1');
    });

    it('decimal step should not display complete precision', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" step={0.01} value={2.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.10');
    });

    it('string step should display complete precision', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" step="1.000" value={2.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.100');
    });

    it('small value and step', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" value={0.000000001} step={0.000000001} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
      expect(inputNumber.state.value).to.be(0.000000001);
      expect(inputElement.value).to.be('0.000000001');
    });

    it('small step with integer value', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" value={1} step="0.000000001" />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
      expect(inputNumber.state.value).to.be(1);
      expect(inputElement.value).to.be('1.000000000');
    });
  });

  describe('GitHub issues', () => {
    // https://github.com/react-component/input-number/issues/32
    it('issue 32', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" step={0.1} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '2' } });
      expect(inputNumber.state.value).to.be('');
      expect(inputElement.value).to.be('2');
      Simulate.blur(inputElement);
      expect(inputNumber.state.value).to.be(2);
      expect(inputElement.value).to.be('2.0');
    });

    // https://github.com/react-component/input-number/issues/35
    it('issue 35', () => {
      let num;
      const Demo = React.createClass({
        render() {
          return (
            <InputNum
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
      inputElement = ReactDOM.findDOMNode(inputNumber.refs.input);

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
    });

    // https://github.com/ant-design/ant-design/issues/4229
    it('long press not trigger onChange in uncontrolled component', (done) => {
      let num;
      const Demo = React.createClass({
        render() {
          return (
            <InputNum
              ref="inputNum"
              defaultValue={0}
              onChange={value => { num = value; } }
            />
          );
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;

      Simulate.mouseDown(ReactDOM.findDOMNode(inputNumber.refs.up));
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
  });
});
