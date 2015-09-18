'use strict';

var React = require('react');
var rcUtil = require('rc-util');

function noop() {
}

function isValueNumber(value) {
  return (/^-?\d+?$/).test(value + '');
}

function preventDefault(e) {
  e.preventDefault();
}

var InputNumber = React.createClass({
  getInitialState() {
    var value;
    var props = this.props;
    if ('value' in props) {
      value = props.value;
    } else {
      value = props.defaultValue;
    }
    return {
      value: value,
      focused: props.autoFocus
    };
  },

  getDefaultProps() {
    return {
      prefixCls: 'rc-input-number',
      max: Infinity,
      min: -Infinity,
      style: {},
      onChange: noop
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value
      });
    }
  },

  setValue(v, callback) {
    this.setState({
      value: v
    }, callback);
    this.props.onChange(v);
  },

  step(type, e, callback) {
    if (e) {
      e.preventDefault();
    }
    var props = this.props;
    if (props.disabled) {
      return;
    }
    var value = this.state.value;
    if (isNaN(value)) {
      return;
    }
    var stepNum = props.step || 1;
    var val = value;
    if (type === 'down') {
      val -= stepNum;
    } else if (type === 'up') {
      val += stepNum;
    }
    if (val > props.max || val < props.min) {
      return;
    }
    this.setValue(val, ()=> {
      React.findDOMNode(this.refs.input).focus();
    });
  },

  onChange(event) {
    var props = this.props;
    var val = event.target.value.trim();
    if (!val) {
      this.setValue(val);
    } else if (isValueNumber(val)) {
      val = Number(val);
      if ('min' in props) {
        if (val < props.min) {
          return;
        }
      }
      if ('max' in props) {
        if (val > props.max) {
          return;
        }
      }
      this.setValue(val);
    } else {
      this.setValue('');
    }
  },

  down(e) {
    this.step('down', e);
  },

  up(e) {
    this.step('up', e);
  },

  handleKeyDown(e) {
    if (e.keyCode === 38) {
      this.up(e);
    } else if (e.keyCode === 40) {
      this.down(e);
    }
  },

  handleFocus() {
    this.setState({
      focused: true
    });

  },

  handleBlur() {
    this.setState({
      focused: false
    });
  },

  render() {
    var props = this.props;
    var prefixCls = props.prefixCls;
    var classes = rcUtil.classSet({
      [prefixCls]: true,
      [props.className]: !!props.className,
      [`${prefixCls}-disabled`]: props.disabled,
      [`${prefixCls}-focused`]: this.state.focused
    });
    var upDisabledClass = '';
    var downDisabledClass = '';
    var value = this.state.value;
    if (isValueNumber(value)) {
      var val = Number(value);
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
    // ref for test
    return (
      <div className={classes} style={props.style}>
        <div className={`${prefixCls}-handler-wrap`}>
          <div unselectable="unselectable"
               ref="up"
               onClick={upDisabledClass ? noop : this.up}
               onMouseDown={preventDefault}
               className={`${prefixCls}-handler ${prefixCls}-handler-up ${upDisabledClass}`}>
            <a unselectable="unselectable" className={`${prefixCls}-handler-up-inner`} href="#"
               onClick={preventDefault}/>
          </div>
          <div unselectable="unselectable"
               ref="down"
               onMouseDown={preventDefault}
               onClick={downDisabledClass ? noop : this.down}
               className={`${prefixCls}-handler ${prefixCls}-handler-down ${downDisabledClass}`}>
            <a unselectable="unselectable" className={`${prefixCls}-handler-down-inner`} href="#"
               onClick={preventDefault}/>
          </div>
        </div>
        <div className={`${prefixCls}-input-wrap`}>
          <input className={`${prefixCls}-input`}
                 autoComplete="off"
                 onFocus={this.handleFocus}
                 onBlur={this.handleBlur}
                 onKeyDown={this.handleKeyDown}
                 autoFocus={props.autoFocus}
                 readOnly={props.readOnly}
                 disabled={props.disabled}
                 max={props.max}
                 min={props.min}
                 name={props.name}
                 onChange={this.onChange}
                 ref="input"
                 value={this.state.value}/>
        </div>
      </div>
    );
  }
});

module.exports = InputNumber;
