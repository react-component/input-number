'use strict';

var React = require('react');
var rcUtil = require('rc-util');

function noop() {
}

var InputNumber = React.createClass({
  getInitialState() {
    return {
      value: this.props.value
    };
  },
  getDefaultProps() {
    return {
      value: 0,
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
  step(type, e) {
    e.preventDefault();
    if (this.props.disabled) {
      return;
    }
    var value = Number(this.state.value);
    var stepNum = Number(this.props.step) || 1;
    var val;
    if (type === 'down') {
      val = value - stepNum;
    }
    if (type === 'up') {
      val = value + stepNum;
    }
    if (val > Number(this.props.max) || val < Number(this.props.min)) {
      return;
    }
    this.props.value = val;
    this.setState({
      value: val
    });
    this.props.onChange(val);
  },
  onChange(event) {
    var val = event.target.value;
    if (!isNaN(parseFloat(val)) && isFinite(val)) {
      val = Number(val);
      if ('min' in this.props) {
        if (val < Number(this.props.min)) {
          return;
        }
      }
      if ('max' in this.props) {
        if (val > Number(this.props.max)) {
          return;
        }
      }
      this.setState({
        value: val
      });
      this.props.onChange(val);
    }
  },
  handleKeyDown(e) {
    if (e.keyCode === 38) {
      this.step('up', e);
    }
    if (e.keyCode === 40) {
      this.step('down', e);
    }
  },
  render() {
    var props = this.props;
    var classes = rcUtil.classSet({
      'rc-input-num': true,
      'rc-input-num-disabled': this.props.disabled
    });
    // ref for test
    return (
      <div className={classes}>
        <a href="#"
          ref="down"
          onClick={this.step.bind(this, 'down')}
          className="rc-input-num-handler rc-input-num-handler-down"></a>
        <input className="rc-input-num-input" autoComplete="off"  onKeyDown={this.handleKeyDown}
          autoFocus={props.autoFocus}
          required={props.required}
          readonly={props.readonly}
          disabled={props.disabled}
          max={props.max}
          min={props.min}
          name={props.name}
          onChange={this.onChange}
          ref="input"
          value={this.state.value} />
        <a href="#"
          ref="up"
          onClick={this.step.bind(this, 'up')}
          className="rc-input-num-handler rc-input-num-handler-up"></a>
      </div>
    );
  }
});

module.exports = InputNumber;
