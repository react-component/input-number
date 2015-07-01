'use strict';

// use jsx to render html, do not modify simple.html
require('rc-input-number/assets/index.css');
var InputNum = require('rc-input-number');
var React = require('react');
var Component = React.createClass({
  getInitialState() {
    return {
      disabled: false,
      readOnly:false,
      value: 8
    }
  },
  onChange(v) {
    console.log('onChange: ' + v);
    this.setState({
      value: v
    });
  },
  toggleDisabled() {
    this.setState({
      disabled: !this.state.disabled
    });
  },
  toggleReadOnly(){
    this.setState({
      readOnly: !this.state.readOnly
    });
  },
  render() {
    return (
      <div style={{margin:10}}>
        <InputNum min={1}
          max={10}
          style={{width:100}}
          readOnly={this.state.readOnly}
          value={this.state.value}
          onChange={this.onChange}
          disabled={this.state.disabled} />
        <p>
          <button onClick={this.toggleDisabled}>toggle Disabled</button>
          <button onClick={this.toggleReadOnly}>toggle readOnly</button>
        </p>
      </div>
    );
  }
});
React.render(<Component/>, document.getElementById('__react-content'));
