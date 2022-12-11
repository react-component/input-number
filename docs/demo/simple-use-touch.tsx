/* eslint no-console:0 */
import React from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

class Component extends React.Component {
  state = {
    disabled: false,
    readOnly: false,
    value: 5,
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

  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputNumber
          aria-label="Simple use touch number input example"
          min={-8}
          max={10}
          value={this.state.value}
          style={{ width: 100 }}
          readOnly={this.state.readOnly}
          onChange={this.onChange}
          disabled={this.state.disabled}
          useTouch
        />
        <p>
          <button type="button" onClick={this.toggleDisabled}>
            toggle Disabled
          </button>
          <button type="button" onClick={this.toggleReadOnly}>
            toggle readOnly
          </button>
        </p>
      </div>
    );
  }
}

export default Component;
