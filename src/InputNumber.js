const React = require('react');
const rcUtil = require('rc-util');

function noop() {
}

function isValueNumber(value) {
  return (/^-?\d+?$/).test(value + '');
}

function preventDefault(e) {
  e.preventDefault();
}

const InputNumber = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
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
      value: value,
      focused: props.autoFocus,
    };
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

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
      });
    }
  },

  onChange(event) {
    const props = this.props;
    let val = event.target.value.trim();
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
    }
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

  onBlur() {
    this.setState({
      focused: false,
    });
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
    if (isValueNumber(value)) {
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
                 value={this.state.value}/>
        </div>
      </div>
    );
  },

  setValue(v, callback) {
    this.setState({
      value: v,
    }, callback);
    this.props.onChange(v);
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
    this.setValue(val, ()=> {
      React.findDOMNode(this.refs.input).focus();
    });
  },

  down(e) {
    this.step('down', e);
  },

  up(e) {
    this.step('up', e);
  },
});

module.exports = InputNumber;
