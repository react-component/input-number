/* eslint-disable react/no-multi-comp */
const keyCode = require('rc-util').KeyCode;
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

  const Component = React.createClass({
    getInitialState() {
      return {
        min: 1,
        max: 100,
        value: defaultValue,
        step: 1,
        disabled: false,
        autoFocus: false,
        readOnly: false,
        name: 'inputNumber',
      };
    },
    onChange(value) {
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
  beforeEach(() => {
    example = ReactDOM.render(<Component />, container);
    inputNumber = example.refs.inputNum;
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  describe('keyboard works', () => {
    it('up works', (done) => {
      Simulate.keyDown(ReactDOM.findDOMNode(inputNumber.refs.input), {
        keyCode: keyCode.UP,
      });
      expect(inputNumber.state.value).to.be(99);
      done();
    });

    it('down works', (done) => {
      Simulate.keyDown(ReactDOM.findDOMNode(inputNumber.refs.input), {
        keyCode: keyCode.DOWN,
      });
      expect(inputNumber.state.value).to.be(97);
      done();
    });
  });

  describe('up/down button works', () => {
    it('up button works', (done) => {
      Simulate.click(ReactDOM.findDOMNode(inputNumber.refs.up));
      expect(inputNumber.state.value).to.be(99);
      done();
    });

    it('down button works', (done) => {
      Simulate.click(ReactDOM.findDOMNode(inputNumber.refs.down));
      expect(inputNumber.state.value).to.be(97);
      done();
    });
  });

  describe('check props works', () => {
    it('max', (done) => {
      for (let i = 0; i < 3; i++) {
        Simulate.click(ReactDOM.findDOMNode(inputNumber.refs.up));
      }
      expect(inputNumber.state.value).to.be(100);
      done();
    });

    it('min', (done) => {
      for (let i = 0; i < 100; i++) {
        Simulate.click(ReactDOM.findDOMNode(inputNumber.refs.down));
      }
      expect(inputNumber.state.value).to.be(1);
      done();
    });

    it('disabled', (done) => {
      example.triggerBoolean('disabled');
      expect(inputNumber.props.disabled).to.be(true);
      done();
    });

    it('readonly', (done) => {
      example.triggerBoolean('readOnly');
      expect(inputNumber.props.readOnly).to.be(true);
      done();
    });

    it('autofocus', (done) => {
      example.triggerBoolean('autoFocus');
      expect(inputNumber.props.autoFocus).to.be(true);
      done();
    });

    it('step', (done) => {
      example.setState({step: 5});
      for (let i = 0; i < 3; i++) {
        Simulate.click(ReactDOM.findDOMNode(inputNumber.refs.down));
      }
      expect(inputNumber.state.value).to.be(defaultValue - 3 * 5);
      done();
    });

    it('decimal step', (done) => {
      example.setState({step: 0.1});
      for (let i = 0; i < 3; i++) {
        Simulate.click(ReactDOM.findDOMNode(inputNumber.refs.down));
      }
      expect(inputNumber.state.value).to.be(defaultValue - 3 * 0.1);
      done();
    });
  });

  describe('input directly', () => {
    it('input valid number', (done) => {
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: '6'}});
      expect(inputNumber.state.inputValue).to.be('6');
      expect(inputNumber.state.value).to.be(98);
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(6);
      expect(inputNumber.state.value).to.be(6);
      done();
    });

    it('input invalid number', (done) => {
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: 'xx'}});
      expect(inputNumber.state.inputValue).to.be('xx');
      expect(inputNumber.state.value).to.be(98);
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(98);
      expect(inputNumber.state.value).to.be(98);
      done();
    });

    it('input negative symbol', (done) => {
      example.setState({min: -100});
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: '-'}});
      expect(inputNumber.state.inputValue).to.be('-');
      expect(inputNumber.state.value).to.be(98);
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(98);
      expect(inputNumber.state.value).to.be(98);
      done();
    });

    it('input negative number', (done) => {
      example.setState({min: -100});
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: '-98'}});
      expect(inputNumber.state.inputValue).to.be('-98');
      expect(inputNumber.state.value).to.be(98);
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(-98);
      expect(inputNumber.state.value).to.be(-98);
      done();
    });

    it('input decimal number with integer step', (done) => {
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: '1.2'}});
      expect(inputNumber.state.inputValue).to.be('1.2');
      expect(inputNumber.state.value).to.be(98);
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(1);
      expect(inputNumber.state.value).to.be(1);
      done();
    });

    it('input decimal number with decimal step', (done) => {
      example.setState({step: 0.1});
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: '1.2'}});
      expect(inputNumber.state.inputValue).to.be('1.2');
      expect(inputNumber.state.value).to.be(98);
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(1.2);
      expect(inputNumber.state.value).to.be(1.2);
      done();
    });

    it('input empty text and blur', (done) => {
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: ''}});
      expect(inputNumber.state.inputValue).to.be('');
      expect(inputNumber.state.value).to.be(98);
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(undefined);
      expect(inputNumber.state.value).to.be(undefined);
      done();
    });

    it('small step', () => {
      const Demo = React.createClass({
        render() {
          return <InputNum ref="inputNum" value={1.0000001} step={0.0000001} />;
        },
      });
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      expect(inputNumber.state.inputValue).to.be(1.0000001);
      expect(inputNumber.state.value).to.be(1.0000001);
    });
  });

  it('string step', () => {
    const Demo = React.createClass({
      render() {
        return <InputNum ref="inputNum" step="1.000" value={2.123} />;
      },
    });
    example = ReactDOM.render(<Demo />, container);
    inputNumber = example.refs.inputNum;
    expect(inputNumber.state.inputValue).to.be(2.123);
    expect(inputNumber.state.value).to.be(2.123);
  });
});
