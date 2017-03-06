webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(268);


/***/ },

/***/ 268:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint no-console:0 */
	__webpack_require__(2);
	var InputNumber = __webpack_require__(3);
	var React = __webpack_require__(47);
	var ReactDOM = __webpack_require__(130);
	
	var Component = React.createClass({
	  displayName: 'Component',
	  getInitialState: function getInitialState() {
	    return {
	      disabled: false,
	      readOnly: false,
	      value: 5
	    };
	  },
	  onChange: function onChange(value) {
	    console.log('onChange:', value);
	    this.setState({ value: value });
	  },
	  toggleDisabled: function toggleDisabled() {
	    this.setState({
	      disabled: !this.state.disabled
	    });
	  },
	  toggleReadOnly: function toggleReadOnly() {
	    this.setState({
	      readOnly: !this.state.readOnly
	    });
	  },
	  render: function render() {
	    var upHandler = React.createElement(
	      'div',
	      { style: { color: 'blue' } },
	      'x'
	    );
	    var downHandler = React.createElement(
	      'div',
	      { style: { color: 'red' } },
	      'V'
	    );
	    return React.createElement(
	      'div',
	      { style: { margin: 10 } },
	      React.createElement(InputNumber, {
	        min: -8,
	        max: 10,
	        value: this.state.value,
	        style: { width: 100 },
	        readOnly: this.state.readOnly,
	        onChange: this.onChange,
	        disabled: this.state.disabled,
	        upHandler: upHandler,
	        downHandler: downHandler
	      })
	    );
	  }
	});
	
	ReactDOM.render(React.createElement(Component, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=custom.js.map