import React from 'react';
import rcUtil from 'rc-util';

function noop() {
}

function preventDefault(e) {
  e.preventDefault();
}

const InputNumber = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      prefixCls: 'rc-input-number',
      max: Infinity,
      min: -Infinity,
      style: {},
      defaultValue: '',
      onChange: noop,
    };
  },

  getInitialState() {
    let value;
    const props = this.props;
    if ('value' in props) {
      value = props.value;
    } else {
      value = props.defaultValue;
    }
    return {
      inputValue: value,
      value: this.toPrecisionAs(value),
      focused: props.autoFocus,
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = this.toPrecisionAs(nextProps.value);
      this.setState({
        inputValue: value,
        value: value,
      });
    }
  },

  toPrecisionAs(num) {
    if (isNaN(num)) {
      return num;
    }
    let stepString = this.props.step.toString();
    let precision = 0;
    if (stepString.indexOf('.') >= 0) {
      precision = stepString.length - stepString.indexOf('.') - 1;
    }
    return Number(Number(num).toFixed(precision));
  },

  onChange(event) {
    const props = this.props;
    let val = event.target.value.trim();
    this.setInputValue(val);
  },

  onKeyDown(e) {
    if (e.keyCode === 38) {
      this.up(e);
    } else if (e.keyCode === 40) {
      this.down(e);
    }
  },

  onFocus() {
    this.setState({
      focused: true,
    });
  },

  onBlur(event) {
    const props = this.props;
    let val = event.target.value.trim();
    this.setState({
      focused: false,
    });
    if (!isNaN(val)) {
      val = Number(val);
      if (val < props.min) {
        val = props.min;
      }
      if (val > props.max) {
        val = props.max;
      }
    } else {
      val = this.state.value;
    }
    this.setValue(val);
  },

  setValue(v) {
    const value = this.toPrecisionAs(v);
    if (!('value' in this.props)) {
      this.setState({
        value: value,
        inputValue: value,
      });
    }
    this.props.onChange(value);
  },

  setInputValue(v) {
    this.setState({
      inputValue: v,
    });
  },

  step(type, e) {
    if (e) {
      e.preventDefault();
    }
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const value = this.state.value;
    if (isNaN(value)) {
      return;
    }
    const stepNum = props.step || 1;
    let val = value;
    if (type === 'down') {
      val -= stepNum;
    } else if (type === 'up') {
      val += stepNum;
    }
    if (val > props.max || val < props.min) {
      return;
    }
    this.setValue(val);
    this.refs.input.focus();
  },

  down(e) {
    this.step('down', e);
  },

  up(e) {
    this.step('up', e);
  },

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const classes = rcUtil.classSet({
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
        downDisabledClass = `${prefixCls}-handler-up-disabled`;
      }
    } else {
      upDisabledClass = `${prefixCls}-handler-up-disabled`;
      downDisabledClass = `${prefixCls}-handler-up-disabled`;
    }

    // focus state, show input value
    // unfocus state, show valid value
    let inputDisplayValue;
    if (this.state.focused) {
      inputDisplayValue = this.state.inputValue;
    } else {
      inputDisplayValue = this.state.value;
    }

    // ref for test
    return (
      <div className={classes} style={props.style}>
        <div className={`${prefixCls}-handler-wrap`}>
          <a unselectable="unselectable"
             ref="up"
             onClick={upDisabledClass ? noop : this.up}
             onMouseDown={preventDefault}
             className={`${prefixCls}-handler ${prefixCls}-handler-up ${upDisabledClass}`}>
            <span unselectable="unselectable" className={`${prefixCls}-handler-up-inner`}
                  onClick={preventDefault}/>
          </a>
          <a unselectable="unselectable"
             ref="down"
             onMouseDown={preventDefault}
             onClick={downDisabledClass ? noop : this.down}
             className={`${prefixCls}-handler ${prefixCls}-handler-down ${downDisabledClass}`}>
            <span unselectable="unselectable" className={`${prefixCls}-handler-down-inner`}
                  onClick={preventDefault}/>
          </a>
        </div>
        <div className={`${prefixCls}-input-wrap`}>
          <input className={`${prefixCls}-input`}
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
                 value={inputDisplayValue}/>
        </div>
      </div>
    );
  },
});

module.exports = InputNumber;
