webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(270);


/***/ },

/***/ 270:
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
	    return React.createElement(
	      'div',
	      { style: { margin: 10 } },
	      React.createElement(InputNumber, { defaultValue: 3, id: 'x1' }),
	      React.createElement(InputNumber, { defaultValue: 4, id: 'x2' }),
	      React.createElement(InputNumber, { defaultValue: 5, id: 'x3' })
	    );
	  }
	});
	
	ReactDOM.render(React.createElement(Component, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=simple.js.map