webpackJsonp([5],{

/***/ 107:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(108);


/***/ }),

/***/ 108:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_input_number_assets_index_less__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_input_number_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rc_input_number_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_input_number__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_dom__);



/* eslint no-console:0 */





var Demo = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default()(Demo, _React$Component);

  function Demo() {
    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Demo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      disabled: false,
      readOnly: false,
      value: 8
    }, _this.onChange = function (v) {
      console.log('onChange:', v);
      _this.setState({
        value: v
      });
    }, _this.toggleDisabled = function () {
      _this.setState({
        disabled: !_this.state.disabled
      });
    }, _this.toggleReadOnly = function () {
      _this.setState({
        readOnly: !_this.state.readOnly
      });
    }, _temp), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  Demo.prototype.render = function render() {
    return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
      'div',
      { style: { margin: 10 } },
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4_rc_input_number__["a" /* default */], {
        'aria-label': 'Number input example that demonstrates using decimal values',
        min: -8,
        max: 10,
        step: 0.1,
        value: this.state.value,
        style: { width: 100 },
        readOnly: this.state.readOnly,
        onChange: this.onChange,
        disabled: this.state.disabled
      }),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'p',
        null,
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'button',
          { onClick: this.toggleDisabled },
          'toggle Disabled'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'button',
          { onClick: this.toggleReadOnly },
          'toggle readOnly'
        )
      )
    );
  };

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_6_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ })

},[107]);
//# sourceMappingURL=decimal.js.map