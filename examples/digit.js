'use strict';

// use jsx to render html, do not modify simple.html
require('rc-input-number/assets/index.css');
var InputNum = require('rc-input-number');
var React = require('react');
var ReactDOM = require('react-dom');
var Component = React.createClass({
  getInitialState() {
    return {
      disabled: false,
      readOnly: false,
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
        <InputNum min={-8}
                  max={10}
                  step={0.1}
                  value={this.state.value}
                  style={{width:100}}
                  readOnly={this.state.readOnly}
                  onChange={this.onChange}
                  disabled={this.state.disabled}/>

        <p>
          <button onClick={this.toggleDisabled}>toggle Disabled</button>
          <button onClick={this.toggleReadOnly}>toggle readOnly</button>
        </p>
      </div>
    );
  }
});
ReactDOM.render(<Component/>, document.getElementById('__react-content'));

