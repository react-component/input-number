webpackJsonp([1],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(282);


/***/ }),

/***/ 282:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck2 = __webpack_require__(2);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(3);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(72);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	__webpack_require__(80);
	
	var _rcInputNumber = __webpack_require__(81);
	
	var _rcInputNumber2 = _interopRequireDefault(_rcInputNumber);
	
	var _react = __webpack_require__(92);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(136);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint no-console:0 */
	var Component = function (_React$Component) {
	  (0, _inherits3.default)(Component, _React$Component);
	
	  function Component() {
	    var _temp, _this, _ret;
	
	    (0, _classCallCheck3.default)(this, Component);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
	      disabled: false,
	      readOnly: false,
	      value: 5
	    }, _this.onChange = function (value) {
	      console.log('onChange:', value);
	      _this.setState({ value: value });
	    }, _this.toggleDisabled = function () {
	      _this.setState({
	        disabled: !_this.state.disabled
	      });
	    }, _this.toggleReadOnly = function () {
	      _this.setState({
	        readOnly: !_this.state.readOnly
	      });
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }
	
	  Component.prototype.render = function render() {
	    var upHandler = _react2.default.createElement(
	      'div',
	      { style: { color: 'blue' } },
	      'x'
	    );
	    var downHandler = _react2.default.createElement(
	      'div',
	      { style: { color: 'red' } },
	      'V'
	    );
	    return _react2.default.createElement(
	      'div',
	      { style: { margin: 10 } },
	      _react2.default.createElement(_rcInputNumber2.default, {
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
	  };
	
	  return Component;
	}(_react2.default.Component);
	
	_reactDom2.default.render(_react2.default.createElement(Component, null), document.getElementById('__react-content'));

/***/ })

});
//# sourceMappingURL=custom.js.map