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
	var InputNumber = __webpack_require__(3);
	var React = __webpack_require__(47);
	var ReactDOM = __webpack_require__(130);
	
	var Component = React.createClass({
	  displayName: 'Component',
	  getInitialState: function getInitialState() {
	    return {
	      disabled: false,
	      readOnly: false,
	      value: 50000
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
	  numberWithCommas: function numberWithCommas(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	  },
	  format: function format(num) {
	    return '$ ' + this.numberWithCommas(num) + ' boeing737';
	  },
	  parser: function parser(num) {
	    return num.toString().split(' ')[1].replace(/,*/g, '');
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      { style: { margin: 10 } },
	      React.createElement(InputNumber, {
	        min: -8000,
	        max: 10000000,
	        value: this.state.value,
	        style: { width: 200 },
	        readOnly: this.state.readOnly,
	        onChange: this.onChange,
	        disabled: this.state.disabled,
	        autoFocus: false,
	        step: 100,
	        formatter: this.format,
	        parser: this.parser
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
//# sourceMappingURL=combination-key-format.js.map