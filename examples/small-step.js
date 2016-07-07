webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(177);


/***/ },

/***/ 177:
/***/ function(module, exports, __webpack_require__) {

	/* eslint no-console:0 */
	
	'use strict';
	
	__webpack_require__(2);
	var InputNum = __webpack_require__(3);
	var React = __webpack_require__(6);
	var ReactDOM = __webpack_require__(39);
	var Component = React.createClass({
	  displayName: 'Component',
	
	  getInitialState: function getInitialState() {
	    return {
	      value: 0.000000001
	    };
	  },
	  onChange: function onChange(v) {
	    console.log('onChange:', v);
	    this.setState({
	      value: v
	    });
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      { style: { margin: 10 } },
	      React.createElement(InputNum, { min: -10,
	        max: 10,
	        step: 0.000000001,
	        value: this.state.value,
	        style: { width: 100 },
	        onChange: this.onChange })
	    );
	  }
	});
	ReactDOM.render(React.createElement(Component, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=small-step.js.map