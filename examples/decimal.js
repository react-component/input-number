webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint no-console:0 */
	__webpack_require__(2);
	var InputNum = __webpack_require__(3);
	var React = __webpack_require__(47);
	var ReactDOM = __webpack_require__(129);
	var Component = React.createClass({
	  displayName: 'Component',
	  getInitialState: function getInitialState() {
	    return {
	      disabled: false,
	      readOnly: false,
	      value: 8
	    };
	  },
	  onChange: function onChange(v) {
	    console.log('onChange: ' + v);
	    this.setState({
	      value: v
	    });
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
	      React.createElement(InputNum, {
	        min: -8,
	        max: 10,
	        step: 0.1,
	        value: this.state.value,
	        style: { width: 100 },
	        readOnly: this.state.readOnly,
	        onChange: this.onChange,
	        disabled: this.state.disabled
	      }),
	      React.createElement(
	        'p',
	        null,
	        React.createElement(
	          'button',
	          { onClick: this.toggleDisabled },
	          'toggle Disabled'
	        ),
	        React.createElement(
	          'button',
	          { onClick: this.toggleReadOnly },
	          'toggle readOnly'
	        )
	      )
	    );
	  }
	});
	ReactDOM.render(React.createElement(Component, null), document.getElementById('__react-content'));

/***/ }
]);
//# sourceMappingURL=decimal.js.map