import React, { PropTypes } from 'react';
import classNames from 'classnames';
import mixin from './mixin';
import InputHandler from './InputHandler';

function noop() {
}

function preventDefault(e) {
  e.preventDefault();
}

const InputNumber = React.createClass({
  propTypes: {
    focusOnUpDown: PropTypes.bool,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    prefixCls: PropTypes.string,
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

  componentDidUpdate() {
    if (this.props.focusOnUpDown &&
      this.state.focused &&
      document.activeElement !== this.refs.input) {
      this.focus();
    }
  },

  onKeyDown(e, ...args) {
    if (e.keyCode === 38) {
      this.up(e);
    } else if (e.keyCode === 40) {
      this.down(e);
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

  getValueFromEvent(e) {
    return e.target.value;
  },

  focus() {
    this.refs.input.focus();
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
    const value = this.state.value;
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

    const editable = !props.readOnly && !props.disabled;

    // focus state, show input value
    // unfocus state, show valid value
    let inputDisplayValue;
    if (this.state.focused) {
      inputDisplayValue = this.state.inputValue;
    } else {
      inputDisplayValue = this.toPrecisionAsStep(this.state.value);
    }

    if (inputDisplayValue === undefined) {
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

    // ref for test
    return (
      <div className={classes} style={props.style}>
        <div className={`${prefixCls}-handler-wrap`}>
          <InputHandler
            ref="up"
            disabled={!!upDisabledClass || disabled || readOnly}
            prefixCls={prefixCls}
            unselectable="unselectable"
            {...upEvents}
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
            disabled={!!downDisabledClass || disabled || readOnly}
            prefixCls={prefixCls}
            unselectable="unselectable"
            {...downEvents}
            className={`${prefixCls}-handler ${prefixCls}-handler-down ${downDisabledClass}`}
          >
            {this.props.downHandler || <span
              unselectable="unselectable"
              className={`${prefixCls}-handler-down-inner`}
              onClick={preventDefault}
            />}
          </InputHandler>
        </div>
        <div className={`${prefixCls}-input-wrap`}>
          <input
            type={props.type}
            placeholder={props.placeholder}
            onClick={props.onClick}
            className={`${prefixCls}-input`}
            autoComplete="off"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyDown={this.onKeyDown}
            onKeyUp={this.onKeyUp}
            autoFocus={props.autoFocus}
            readOnly={props.readOnly}
            disabled={props.disabled}
            max={props.max}
            min={props.min}
            name={props.name}
            onChange={this.onChange}
            ref="input"
            value={inputDisplayValue}
          />
        </div>
      </div>
    );
  },
});

export default InputNumber;
