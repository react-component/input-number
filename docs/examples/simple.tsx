/* eslint no-console:0 */
import React from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

class Component extends React.Component {
  state = {
    disabled: false,
    readOnly: false,
    value: 5,
    keyboard: true
  };

  onChange = value => {
    console.log('onChange:', value);
    this.setState({ value });
  };

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  };

  toggleReadOnly = () => {
    this.setState({
      readOnly: !this.state.readOnly,
    });
  };

  toggleKeyboard = () => {
    this.setState({
      keyboard: !this.state.keyboard,
    });
  };

  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputNumber
          aria-label="Simple number input example"
          min={-8}
          max={10}
          style={{ width: 100 }}
          value={this.state.value}
          onChange={this.onChange}
          readOnly={this.state.readOnly}
          disabled={this.state.disabled}
          keyboard={this.state.keyboard}
        />
        <p>
          <button type="button" onClick={this.toggleDisabled}>
            toggle Disabled
          </button>
          <button type="button" onClick={this.toggleReadOnly}>
            toggle readOnly
          </button>
          <button type="button" onClick={this.toggleKeyboard}>
            toggle keyboard
          </button>
        </p>
      </div>
    );
  }
}

export default Component;
