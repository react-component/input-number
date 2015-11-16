'use strict';

var keyCode = require('rc-util').KeyCode;
var expect = require('expect.js');
var InputNum = require('../index');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var ReactDOM = require('react-dom');
var Simulate = TestUtils.Simulate;
require('../assets/index.less');

var defaultValue = 98;

describe('inputNumber', function () {
  var container = document.createElement('div');
  document.body.appendChild(container);

  var Component = React.createClass({
    getInitialState() {
      return {
        min: 1,
        max: 100,
        value: defaultValue,
        step: 1,
        disabled: false,
        autoFocus: false,
        readOnly: false,
        name: 'inputNumber'
      }
    },
    triggerBoolean(propName) {
      var prop = {};
      prop[propName] = !this.state[propName];
      this.setState(prop);
    },
    onChange(value) {
      this.setState({value});
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
    }
  });

  var inputNumber;
  var example;
  beforeEach(function () {
    example = ReactDOM.render(<Component />, container);
    inputNumber = example.refs.inputNum;
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(container);
  });

  describe('keyboard works', function () {
    it('up works', function (done) {
      Simulate.keyDown(ReactDOM.findDOMNode(inputNumber.refs.input), {
        keyCode: keyCode.UP
      });
      expect(inputNumber.state.value).to.be(99);
      done();
    });

    it('down works', function (done) {
      Simulate.keyDown(ReactDOM.findDOMNode(inputNumber.refs.input), {
        keyCode: keyCode.DOWN
      });
      expect(inputNumber.state.value).to.be(97);
      done();
    })
  });

  describe('up/down button works', function () {
    it('up button works', function (done) {
      Simulate.click(ReactDOM.findDOMNode(inputNumber.refs.up));
      expect(inputNumber.state.value).to.be(99);
      done();
    })

    it('down button works', function (done) {
      Simulate.click(ReactDOM.findDOMNode(inputNumber.refs.down));
      expect(inputNumber.state.value).to.be(97);
      done();
    })
  });

  describe('check props works', function () {
    it('max', function (done) {
      for (var i = 0; i < 3; i++) {
        Simulate.click(ReactDOM.findDOMNode(inputNumber.refs.up));
      }
      expect(inputNumber.state.value).to.be(100);
      done()
    });

    it('min', function (done) {
      for (var i = 0; i < 100; i++) {
        Simulate.click(ReactDOM.findDOMNode(inputNumber.refs.down));
      }
      expect(inputNumber.state.value).to.be(1);
      done()
    })

    it('disabled', function (done) {
      example.triggerBoolean('disabled')
      expect(inputNumber.props.disabled).to.be(true);
      done()
    })

    it('readonly', function (done) {
      example.triggerBoolean('readOnly')
      expect(inputNumber.props.readOnly).to.be(true);
      done()
    })

    it('autofocus', function (done) {
      example.triggerBoolean('autoFocus')
      expect(inputNumber.props.autoFocus).to.be(true);
      done()
    })

    it('step', function (done) {
      example.setState({step: 5})
      for (var i = 0; i < 3; i++) {
        Simulate.click(ReactDOM.findDOMNode(inputNumber.refs.down));
      }
      expect(inputNumber.state.value).to.be(defaultValue - 3 * 5);
      done()
    })

    it('decimal step', function (done) {
      example.setState({step: 0.1})
      for (var i = 0; i < 3; i++) {
        Simulate.click(ReactDOM.findDOMNode(inputNumber.refs.down));
      }
      expect(inputNumber.state.value).to.be(defaultValue - 3 * 0.1);
      done()
    })
  })

  describe('input directly', function () {
    it('input valid number', function (done) {
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: '6'}})
      expect(inputNumber.state.inputValue).to.be('6')
      expect(inputNumber.state.value).to.be(98)
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(6)
      expect(inputNumber.state.value).to.be(6)
      done()
    })

    it('input invalid number', function (done) {
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: 'xx'}})
      expect(inputNumber.state.inputValue).to.be('xx')
      expect(inputNumber.state.value).to.be(98)
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(98)
      expect(inputNumber.state.value).to.be(98)
      done()
    })

    it('input negative symbol', function (done) {
      example.setState({min: -100})
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: '-'}})
      expect(inputNumber.state.inputValue).to.be('-')
      expect(inputNumber.state.value).to.be(98)
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(98)
      expect(inputNumber.state.value).to.be(98)
      done()
    })

    it('input negative number', function (done) {
      example.setState({min: -100})
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: '-98'}})
      expect(inputNumber.state.inputValue).to.be('-98')
      expect(inputNumber.state.value).to.be(98)
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(-98)
      expect(inputNumber.state.value).to.be(-98)
      done()
    })

    it('input decimal number with integer step', function (done) {
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: '1.2'}})
      expect(inputNumber.state.inputValue).to.be('1.2')
      expect(inputNumber.state.value).to.be(98)
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(1)
      expect(inputNumber.state.value).to.be(1)
      done()
    })

    it('input decimal number with decimal step', function (done) {
      example.setState({step: 0.1})
      Simulate.focus(ReactDOM.findDOMNode(inputNumber.refs.input));
      Simulate.change(ReactDOM.findDOMNode(inputNumber.refs.input), {target: {value: '1.2'}})
      expect(inputNumber.state.inputValue).to.be('1.2')
      expect(inputNumber.state.value).to.be(98)
      Simulate.blur(ReactDOM.findDOMNode(inputNumber.refs.input));
      expect(inputNumber.state.inputValue).to.be(1.2)
      expect(inputNumber.state.value).to.be(1.2)
      done()
    })
  })

});
