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
    const upHandler = (<div style={{ color: 'blue' }}>x</div>);
    const downHandler = (<div style={{ color: 'red' }}>V</div>);
    return (
      <div style={{ margin: 10 }}>
        <InputNumber
          min={-8}
          max={10}
          value={this.state.value}
          style={{ width: 100 }}
          readOnly={this.state.readOnly}
          onChange={this.onChange}
          disabled={this.state.disabled}
          upHandler={upHandler}
          downHandler={downHandler}
        />
      </div>
    );
  },
});

ReactDOM.render(<Component/>, document.getElementById('__react-content'));
