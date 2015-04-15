/** @jsx React.DOM */
var React = require('react');
var InputNumber = React.createClass({
  getInitialState: function(){
    return {
      value: 0
    };
  },
  componentDidMount: function(){
    if(this.props.value){
      this.setState({value: this.props.value||0});
    }
  },
  componentWillUnmount: function(){

  },
  step: function(type){
    if(this.props.disabled) return;
    var stepNum = this.props.step || 1, val;
    if(type === 'down'){
      val = Number(this.state.value) - Number(stepNum);
    }
    if(type === 'up'){
      val = Number(this.state.value) + Number(stepNum);
    }
    if(val > Number(this.props.max) || val < Number(this.props.min)) return;
    this.props.value = val;
    this.setState({value: val});
  },
  onChange: function(event){
    var val = event.target.value;
    if(!isNaN(parseFloat(val)) && isFinite(val)){
      this.setState({value: event.target.value});
    }
  },
  render: function () {
    var cx = React.addons.classSet;
    var classes = cx({
      'rc-input-num': true,
      'rc-input-num-disabled': this.props.disabled
    })
    return (
      <div className={classes}>
        <a href="javascript:;" onClick={this.step.bind(this, 'down')} className="rc-input-num-handler rc-input-num-handler-down"></a>
        <input className="rc-input-num-input" type="text" autocomplete="off"
        autofocus={this.props.autofocus}
        required={this.props.required}
        readonly={this.props.readonly}
        disabled={this.props.disabled}
        max={this.props.max}
        min={this.props.min}
        name={this.props.name}
        onChange={this.onChange}
        value={this.state.value} />
        <a href="javascript:;" onClick={this.step.bind(this, 'up')} className="rc-input-num-handler rc-input-num-handler-up"></a>
      </div>
      );
  }
});
module.exports = InputNumber;