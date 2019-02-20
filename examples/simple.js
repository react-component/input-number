/* eslint no-console:0 */
import 'rc-input-number/assets/index.less';
import InputNumber from 'rc-input-number';
import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  state = {
    disabled: false,
    readOnly: false,
    value: 5,
  };
  onChange = (value) => {
    console.log('onChange:', value, typeof value);
    this.setState({ value });
  }
  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  }
  toggleReadOnly = () => {
    this.setState({
      readOnly: !this.state.readOnly,
    });
  }
  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputNumber
          min={-8}
          max={10}
          style={{ width: 100 }}
          value={this.state.value}
          onChange={this.onChange}
          readOnly={this.state.readOnly}
          disabled={this.state.disabled}
        />
        <p>
          <button onClick={this.toggleDisabled}>toggle Disabled</button>
          <button onClick={this.toggleReadOnly}>toggle readOnly</button>
        </p>
      </div>
    );
  }
}

ReactDOM.render(<Component/>, document.getElementById('__react-content'));
