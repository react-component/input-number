var keyCode = require('rc-util').KeyCode;
var expect = require('expect.js');
var InputNum = require('../index');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;

describe('inputNumber', function(){
  var inputNumber;
  var container = document.createElement('div');
  document.body.appendChild(container);

  beforeEach(function (done) {
    React.render(<InputNum min="1" max="100" value="98" disabled={false} />, container, function () {
      inputNumber = this;
      done();
    });
  });

  afterEach(function () {
    React.unmountComponentAtNode(container);
  });

  describe('keyboard works', function(){
    it('up works', function(done){
      Simulate.keyDown(React.findDOMNode(inputNumber.refs.input), {
        keyCode: keyCode.UP
      });
      expect(inputNumber.state.value).to.be(99);
      done();
    })

    it('down works', function(done){
      Simulate.keyDown(React.findDOMNode(inputNumber.refs.input), {
        keyCode: keyCode.DOWN
      });
      expect(inputNumber.state.value).to.be(97);
      done();
    })
  })

  describe('up/down button works', function(){
    it('up button works', function(done){
      Simulate.click(React.findDOMNode(inputNumber.refs.up));
      expect(inputNumber.state.value).to.be(99);
      done();
    })

    it('down button works', function(done){
      Simulate.click(React.findDOMNode(inputNumber.refs.down));
      expect(inputNumber.state.value).to.be(97);
      done();
    })
  })

})
