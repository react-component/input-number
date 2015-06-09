'use strict';

// use jsx to render html, do not modify simple.html
require('rc-input-number/assets/index.css');
var InputNum = require('rc-input-number');
var React = require('react');
var Component = React.createClass({
  getInitialState() {
    return {
      disabled: false,
      value: 8
    }
  },
  onChange(v) {
    console.log('onChange: ' + v);
    this.setState({
      value: v
    });
  },
  triggerDisabled() {
    this.setState({disabled: !this.state.disabled});
  },
  render() {
    return (
      <div>
        <InputNum min="1" max="10" value={this.state.value} onChange={this.onChange} disabled={this.state.disabled} />
        <p>
          <button onClick={this.triggerDisabled}>Trigger Disabled</button>
        </p>
      </div>
    );
  }
});
React.render(<Component/>, document.getElementById('__react-content'));
