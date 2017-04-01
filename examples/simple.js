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
      value: 5,
    };
  },
  onChange(value) {
    console.log('onChange:', value);
    this.setState({ value });
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
      <div style={{ margin: 10 }}>
        <InputNumber defaultValue={3} id="x1" />
        <InputNumber defaultValue={4} id="x2" />
        <InputNumber defaultValue={5} id="x3" />
      </div>
    );
  },
});

ReactDOM.render(<Component/>, document.getElementById('__react-content'));
