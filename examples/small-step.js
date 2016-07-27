/* eslint no-console:0 */
require('rc-input-number/assets/index.less');
const InputNum = require('rc-input-number');
const React = require('react');
const ReactDOM = require('react-dom');
const Component = React.createClass({
  getInitialState() {
    return {
      value: 0.000000001,
    };
  },
  onChange(v) {
    console.log('onChange:', v);
    this.setState({
      value: v,
    });
  },
  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputNum
          min={-10}
          max={10}
          step={0.000000001}
          value={this.state.value}
          style={{ width: 100 }}
          onChange={this.onChange}
        />
      </div>
    );
  },
});
ReactDOM.render(<Component/>, document.getElementById('__react-content'));
