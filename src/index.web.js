import React, { PropTypes } from 'react';
import classNames from 'classnames';
import mixin from './mixin';

function noop() {
}

function preventDefault(e) {
  e.preventDefault();
}

const InputNumber = React.createClass({
  propTypes: {
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    readOnly: PropTypes.bool,
    max: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  },

  mixins: [mixin],

  getDefaultProps() {
    return {
      prefixCls: 'rc-input-number',
    };
  },

  componentDidMount() {
    this.componentDidUpdate();
  },

  componentDidUpdate() {
    if (this.state.focused && document.activeElement !== this.refs.input) {
      this.refs.input.focus();
    }
  },

  onKeyDown(e, ...args) {
    if (e.keyCode === 38) {
      this.up(e);
    } else if (e.keyCode === 40) {
      this.down(e);
    }
    this.props.onKeyDown(e, ...args);
  },

  getValueFromEvent(e) {
    return e.target.value;
  },

  focus() {
    this.refs.input.focus();
  },

  render() {
    const props = { ...this.props };
    const prefixCls = props.prefixCls;
    const classes = classNames({
      [prefixCls]: true,
      [props.className]: !!props.className,
      [`${prefixCls}-disabled`]: props.disabled,
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
      inputDisplayValue = this.state.value;
    }

    if (inputDisplayValue === undefined) {
      inputDisplayValue = '';
    }

    // Remove React warning.
    // Warning: Input elements must be either controlled
    // or uncontrolled (specify either the value prop, or
    // the defaultValue prop, but not both).
    delete props.defaultValue;
    // https://fb.me/react-unknown-prop
    delete props.prefixCls;

    // ref for test
    return (
      <div className={classes} style={props.style}>
        <div className={`${prefixCls}-handler-wrap`}>
          <a
            unselectable="unselectable"
            ref="up"
            onTouchStart={(editable && !upDisabledClass) ? this.up : noop}
            onTouchEnd={this.stop}
            onMouseDown={(editable && !upDisabledClass) ? this.up : noop}
            onMouseUp={this.stop}
            onMouseLeave={this.stop}
            className={`${prefixCls}-handler ${prefixCls}-handler-up ${upDisabledClass}`}
          >
            <span
              unselectable="unselectable"
              className={`${prefixCls}-handler-up-inner`}
              onClick={preventDefault}
            />
          </a>
          <a
            unselectable="unselectable"
            ref="down"
            onTouchStart={(editable && !downDisabledClass) ? this.down : noop}
            onTouchEnd={this.stop}
            onMouseDown={(editable && !downDisabledClass) ? this.down : noop}
            onMouseUp={this.stop}
            onMouseLeave={this.stop}
            className={`${prefixCls}-handler ${prefixCls}-handler-down ${downDisabledClass}`}
          >
            <span
              unselectable="unselectable"
              className={`${prefixCls}-handler-down-inner`}
              onClick={preventDefault}
            />
          </a>
        </div>
        <div className={`${prefixCls}-input-wrap`}>
          <input
            {...props}
            style={null}
            className={`${prefixCls}-input`}
            autoComplete="off"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyDown={this.onKeyDown}
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
