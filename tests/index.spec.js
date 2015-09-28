'use strict';

var keyCode = require('rc-util').KeyCode;
var expect = require('expect.js');
var InputNum = require('../index');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
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
      var prop = {}
      prop[propName] = !this.state[propName]
      this.setState(prop);
    },
    render() {
      return (
        <div>
          <InputNum
            ref="inputNum"
            min={this.state.min}
            max={this.state.max}
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
  })

  var example;
  beforeEach(function (done) {
    React.render(<Component />, container, function () {
      example = this
      done();
    });
  });

  afterEach(function () {
    React.unmountComponentAtNode(container);
  });

  describe('keyboard works', function () {
    it('up works', function (done) {
      var inputNumber = example.refs.inputNum
      Simulate.keyDown(React.findDOMNode(inputNumber.refs.input), {
        keyCode: keyCode.UP
      });
      expect(inputNumber.state.value).to.be(99);
      done();
    })

    it('down works', function (done) {
      var inputNumber = example.refs.inputNum
      Simulate.keyDown(React.findDOMNode(inputNumber.refs.input), {
        keyCode: keyCode.DOWN
      });
      expect(inputNumber.state.value).to.be(97);
      done();
    })
  })

  describe('up/down button works', function () {
    it('up button works', function (done) {
      var inputNumber = example.refs.inputNum
      Simulate.click(React.findDOMNode(inputNumber.refs.up));
      expect(inputNumber.state.value).to.be(99);
      done();
    })

    it('down button works', function (done) {
      var inputNumber = example.refs.inputNum
      Simulate.click(React.findDOMNode(inputNumber.refs.down));
      expect(inputNumber.state.value).to.be(97);
      done();
    })
  })

  describe('check props works', function () {
    it('max', function (done) {
      var inputNumber = example.refs.inputNum
      for (var i = 0; i < 3; i++) {
        Simulate.click(React.findDOMNode(inputNumber.refs.up));
      }
      expect(inputNumber.state.value).to.be(100);
      done()
    })

    it('min', function (done) {
      var inputNumber = example.refs.inputNum
      for (var i = 0; i < 100; i++) {
        Simulate.click(React.findDOMNode(inputNumber.refs.down));
      }
      expect(inputNumber.state.value).to.be(1);
      done()
    })

    it('disabled', function (done) {
      var inputNumber = example.refs.inputNum
      example.triggerBoolean('disabled')
      expect(inputNumber.props.disabled).to.be(true);
      done()
    })

    it('readonly', function (done) {
      var inputNumber = example.refs.inputNum
      example.triggerBoolean('readOnly')
      expect(inputNumber.props.readOnly).to.be(true);
      done()
    })

    it('autofocus', function (done) {
      var inputNumber = example.refs.inputNum
      example.triggerBoolean('autoFocus')
      expect(inputNumber.props.autoFocus).to.be(true);
      done()
    })

    it('step', function (done) {
      var inputNumber = example.refs.inputNum
      example.setState({step: 5})
      for (var i = 0; i < 3; i++) {
        Simulate.click(React.findDOMNode(inputNumber.refs.down));
      }
      expect(inputNumber.state.value).to.be(defaultValue - 3 * 5);
      done()
    })
  })

})
