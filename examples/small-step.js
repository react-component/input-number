webpackJsonp([4],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(285);


/***/ }),

/***/ 285:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck2 = __webpack_require__(2);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(3);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(72);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	__webpack_require__(80);
	
	var _react = __webpack_require__(92);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(136);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var InputNum = __webpack_require__(81); /* eslint no-console:0 */
	
	var Component = function (_React$Component) {
	  (0, _inherits3.default)(Component, _React$Component);
	
	  function Component() {
	    var _temp, _this, _ret;
	
	    (0, _classCallCheck3.default)(this, Component);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
	      value: 0.000000001
	    }, _this.onChange = function (v) {
	      console.log('onChange:', v);
	      _this.setState({
	        value: v
	      });
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }
	
	  Component.prototype.render = function render() {
	    return _react2.default.createElement(
	      'div',
	      { style: { margin: 10 } },
	      _react2.default.createElement(InputNum, {
	        min: -10,
	        max: 10,
	        step: 0.000000001,
	        value: this.state.value,
	        style: { width: 100 },
	        onChange: this.onChange
	      })
	    );
	  };
	
	  return Component;
	}(_react2.default.Component);
	
	_reactDom2.default.render(_react2.default.createElement(Component, null), document.getElementById('__react-content'));

/***/ })

});
//# sourceMappingURL=small-step.js.map