import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import classNames from 'classnames';
import mixin from './mixin';
import InputHandler from './InputHandler';

function noop() {
}

function preventDefault(e) {
  e.preventDefault();
}

const InputNumber = createReactClass({
  propTypes: {
    focusOnUpDown: PropTypes.bool,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    prefixCls: PropTypes.string,
    tabIndex: PropTypes.string,
    disabled: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    readOnly: PropTypes.bool,
    max: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    upHandler: PropTypes.node,
    downHandler: PropTypes.node,
    useTouch: PropTypes.bool,
    formatter: PropTypes.func,
    parser: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    precision: PropTypes.number,
  },

  mixins: [mixin],

  getDefaultProps() {
    return {
      focusOnUpDown: true,
      useTouch: false,
      prefixCls: 'rc-input-number',
    };
  },

  componentDidMount() {
    this.componentDidUpdate();
  },

  componentWillUpdate() {
    try {
      this.start = this.input.selectionStart;
      this.end = this.input.selectionEnd;
    } catch (e) {
      // Fix error in Chrome:
      // Failed to read the 'selectionStart' property from 'HTMLInputElement'
      // http://stackoverflow.com/q/21177489/3040605
    }
  },

  componentDidUpdate() {
    if (this.props.focusOnUpDown && this.state.focused) {
      const selectionRange = this.input.setSelectionRange;
      if (selectionRange &&
          typeof selectionRange === 'function' &&
          this.start !== undefined &&
          this.end !== undefined &&
          this.start !== this.end) {
        this.input.setSelectionRange(this.start, this.end);
      } else {
        this.focus();
      }
    }
  },

  onKeyDown(e, ...args) {
    if (e.keyCode === 38) {
      const ratio = this.getRatio(e);
      this.up(e, ratio);
      this.stop();
    } else if (e.keyCode === 40) {
      const ratio = this.getRatio(e);
      this.down(e, ratio);
      this.stop();
    }
    const { onKeyDown } = this.props;
    if (onKeyDown) {
      onKeyDown(e, ...args);
    }
  },

  onKeyUp(e, ...args) {
    this.stop();
    const { onKeyUp } = this.props;
    if (onKeyUp) {
      onKeyUp(e, ...args);
    }
  },

  getRatio(e) {
    let ratio = 1;
    if (e.metaKey || e.ctrlKey) {
      ratio = 0.1;
    } else if (e.shiftKey) {
      ratio = 10;
    }
    return ratio;
  },

  getValueFromEvent(e) {
    return e.target.value;
  },

  focus() {
    this.input.focus();
  },

  formatWrapper(num) {
    if (this.props.formatter) {
      return this.props.formatter(num);
    }
    return num;
  },

  saveInput(node) {
    this.input = node;
  },

  render() {
    const props = { ...this.props };
    const { prefixCls, disabled, readOnly, useTouch } = props;
    const classes = classNames({
      [prefixCls]: true,
      [props.className]: !!props.className,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-focused`]: this.state.focused,
    });
    let upDisabledClass = '';
    let downDisabledClass = '';
    const { value } = this.state;
    if (value) {
      if (!isNaN(value)) {
        const val = Number(value);
        if (val >= props.max) {
          upDisabledClass = `${prefixCls}-handler-up-disabled`;
        }
        if (val <= props.min) {
          downDisabledClass = `${prefixCls}-handler-down-disabled`;
        }
      } else {
        upDisabledClass = `${prefixCls}-handler-up-disabled`;
        downDisabledClass = `${prefixCls}-handler-down-disabled`;
      }
    }

    const editable = !props.readOnly && !props.disabled;

    // focus state, show input value
    // unfocus state, show valid value
    let inputDisplayValue;
    if (this.state.focused) {
      inputDisplayValue = this.state.inputValue;
    } else {
      inputDisplayValue = this.toPrecisionAsStep(this.state.value);
    }

    if (inputDisplayValue === undefined || inputDisplayValue === null) {
      inputDisplayValue = '';
    }

    let upEvents;
    let downEvents;
    if (useTouch) {
      upEvents = {
        onTouchStart: (editable && !upDisabledClass) ? this.up : noop,
        onTouchEnd: this.stop,
      };
      downEvents = {
        onTouchStart: (editable && !downDisabledClass) ? this.down : noop,
        onTouchEnd: this.stop,
      };
    } else {
      upEvents = {
        onMouseDown: (editable && !upDisabledClass) ? this.up : noop,
        onMouseUp: this.stop,
        onMouseLeave: this.stop,
      };
      downEvents = {
        onMouseDown: (editable && !downDisabledClass) ? this.down : noop,
        onMouseUp: this.stop,
        onMouseLeave: this.stop,
      };
    }
    const inputDisplayValueFormat = this.formatWrapper(inputDisplayValue);
    const isUpDisabled = !!upDisabledClass || disabled || readOnly;
    const isDownDisabled = !!downDisabledClass || disabled || readOnly;
    // ref for test
    return (
      <div
        className={classes}
        style={props.style}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onMouseOver={props.onMouseOver}
        onMouseOut={props.onMouseOut}
      >
        <div className={`${prefixCls}-handler-wrap`}>
          <InputHandler
            ref="up"
            disabled={isUpDisabled}
            prefixCls={prefixCls}
            unselectable="unselectable"
            {...upEvents}
            role="button"
            aria-label="Increase Value"
            aria-disabled={!!isUpDisabled}
            className={`${prefixCls}-handler ${prefixCls}-handler-up ${upDisabledClass}`}
          >
            {this.props.upHandler || <span
              unselectable="unselectable"
              className={`${prefixCls}-handler-up-inner`}
              onClick={preventDefault}
            />}
          </InputHandler>
          <InputHandler
            ref="down"
            disabled={isDownDisabled}
            prefixCls={prefixCls}
            unselectable="unselectable"
            {...downEvents}
            role="button"
            aria-label="Decrease Value"
            aria-disabled={!!isDownDisabled}
            className={`${prefixCls}-handler ${prefixCls}-handler-down ${downDisabledClass}`}
          >
            {this.props.downHandler || <span
              unselectable="unselectable"
              className={`${prefixCls}-handler-down-inner`}
              onClick={preventDefault}
            />}
          </InputHandler>
        </div>
        <div
          className={`${prefixCls}-input-wrap`}
          role="spinbutton"
          aria-valuemin={props.min}
          aria-valuemax={props.max}
          aria-valuenow={value}
        >
          <input
            type={props.type}
            placeholder={props.placeholder}
            onClick={props.onClick}
            className={`${prefixCls}-input`}
            tabIndex={props.tabIndex}
            autoComplete="off"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyDown={editable ? this.onKeyDown : noop}
            onKeyUp={editable ? this.onKeyUp : noop}
            autoFocus={props.autoFocus}
            maxLength={props.maxLength}
            readOnly={props.readOnly}
            disabled={props.disabled}
            max={props.max}
            min={props.min}
            step={props.step}
            name={props.name}
            id={props.id}
            onChange={this.onChange}
            ref={this.saveInput}
            value={inputDisplayValueFormat}
          />
        </div>
      </div>
    );
  },
});

export default InputNumber;
