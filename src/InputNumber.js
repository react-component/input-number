'use strict';

var React = require('react');
var rcUtil = require('rc-util');
var InputNumber = React.createClass({
  getInitialState() {
    return {
      value: 0
    };
  },
  componentDidMount() {
    if (this.props.value) {
      this.setState({value: this.props.value || 0});
    }

  },
  componentWillUnmount() {

  },
  step(type, e) {
    e.preventDefault();
    if (this.props.disabled) {
      return;
    }
    var stepNum = this.props.step || 1, val;
    if (type === 'down') {
      val = Number(this.state.value) - Number(stepNum);
    }
    if (type === 'up') {
      val = Number(this.state.value) + Number(stepNum);
    }
    if (val > Number(this.props.max) || val < Number(this.props.min)) {
      return;
    }
    this.props.value = val;
    this.setState({value: val});
  },
  onChange(event) {
    var val = event.target.value;
    if (!isNaN(parseFloat(val)) && isFinite(val)) {
      this.setState({value: event.target.value});
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
    var classes = rcUtil.classSet({
      'rc-input-num': true,
      'rc-input-num-disabled': this.props.disabled
    });
    return (
      <div className={classes}>
        <a href="#"
          ref="down"
          onClick={this.step.bind(this, 'down')}
          className="rc-input-num-handler rc-input-num-handler-down"></a>
        <input className="rc-input-num-input" type="text" autocomplete="off" ref="input" onKeyDown={this.handleKeyDown}
          autofocus={this.props.autofocus}
          required={this.props.required}
          readonly={this.props.readonly}
          disabled={this.props.disabled}
          max={this.props.max}
          min={this.props.min}
          name={this.props.name}
          onChange={this.onChange}
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
