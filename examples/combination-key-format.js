webpackJsonp([6],{

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_input_number_assets_index_less__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_input_number_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rc_input_number_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_input_number__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react_dom__);




/* eslint no-console:0 */





var Component = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Component, _React$Component);

  function Component() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Component);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Component.__proto__ || Object.getPrototypeOf(Component)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      disabled: false,
      readOnly: false,
      value: 50000
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
    }, _this.numberWithCommas = function (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }, _this.format = function (num) {
      return '$ ' + _this.numberWithCommas(num) + ' boeing737';
    }, _temp), __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Component, [{
    key: 'parser',
    value: function parser(num) {
      return num.toString().split(' ')[1].replace(/,*/g, '');
    }
  }, {
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
        'div',
        { style: { margin: 10 } },
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5_rc_input_number__["a" /* default */], {
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
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          'p',
          null,
          __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
            'button',
            { onClick: this.toggleDisabled },
            'toggle Disabled'
          ),
          __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
            'button',
            { onClick: this.toggleReadOnly },
            'toggle readOnly'
          )
        )
      );
    }
  }]);

  return Component;
}(__WEBPACK_IMPORTED_MODULE_6_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_7_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(Component, null), document.getElementById('__react-content'));

/***/ }),

/***/ 288:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(137);


/***/ })

},[288]);
//# sourceMappingURL=combination-key-format.js.map