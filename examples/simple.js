/* eslint no-console:0 */

require('rc-input-number/assets/index.less');
const InputNumber = require('rc-input-number');
const React = require('react');
const ReactDOM = require('react-dom');

const Component = React.createClass({
  getInitialState() {
    return {
      disabled: false,
      readOnly: false,
      value: 1,
    };
  },
  onChange(v) {
    console.log('onChange:', v);
    this.setState({
      value: v,
    });
  },
  toggleDisabled() {
    this.setState({
      disabled: !this.state.disabled,
    });
  },
  toggleReadOnly() {
    this.setState({
      readOnly: !this.state.readOnly,
    });
  },
  render() {
    return (
      <div style={{margin: 10}}>
        <InputNumber
          min={-8}
          max={100}
          value={this.state.value}
          style={{width: 100}}
          readOnly={this.state.readOnly}
          onChange={this.onChange}
          disabled={this.state.disabled} />
        <p>
          <button onClick={this.toggleDisabled}>toggle Disabled</button>
          <button onClick={this.toggleReadOnly}>toggle readOnly</button>
        </p>
      </div>
    );
  },
});

ReactDOM.render(<Component/>, document.getElementById('__react-content'));
