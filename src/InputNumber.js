import React from 'react';
import classNames from 'classnames';

function noop() {
}

function preventDefault(e) {
  e.preventDefault();
}

const InputNumber = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
    step: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      prefixCls: 'rc-input-number',
      max: Infinity,
      min: -Infinity,
      step: 1,
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
    value = this.toPrecisionAsStep(value);
    return {
      inputValue: value,
      value: value,
      focused: props.autoFocus,
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = this.toPrecisionAsStep(nextProps.value);
      this.setState({
        inputValue: value,
        value: value,
      });
    }
  },

  onChange(event) {
    this.setInputValue(event.target.value.trim());
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
    if (val === '') {
      val = '';
    } else if (!isNaN(val)) {
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
    if (!('value' in this.props)) {
      this.setState({
        value: v,
        inputValue: v,
      });
    }
    this.props.onChange(v);
  },

  setInputValue(v) {
    this.setState({
      inputValue: v,
    });
  },

  getPrecision() {
    const props = this.props;
    const stepString = props.step.toString();
    if (stepString.indexOf('e-') >= 0) {
      return parseInt(stepString.slice(stepString.indexOf('-e')), 10);
    }
    let precision = 0;
    if (stepString.indexOf('.') >= 0) {
      precision = stepString.length - stepString.indexOf('.') - 1;
    }
    return precision;
  },

  getPrecisionFactor() {
    const precision = this.getPrecision();
    return Math.pow(10, precision);
  },

  toPrecisionAsStep(num) {
    if (isNaN(num) || num === '') {
      return num;
    }
    const precision = this.getPrecision();
    return Number(Number(num).toFixed(precision));
  },

  upStep(val) {
    const stepNum = this.props.step;
    const precisionFactor = this.getPrecisionFactor();
    return (precisionFactor * val + precisionFactor * stepNum) / precisionFactor;
  },

  downStep(val) {
    const stepNum = this.props.step;
    const precisionFactor = this.getPrecisionFactor();
    return (precisionFactor * val - precisionFactor * stepNum) / precisionFactor;
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
    const val = this[type + 'Step'](value);
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
