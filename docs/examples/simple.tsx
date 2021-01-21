/* eslint no-console:0 */
import React from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

class Component extends React.Component {
  state = {
    disabled: false,
    readOnly: false,
    value: 5,
    preventDefault: false
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

  togglePreventDefault = () => {
    this.setState({
      preventDefault: !this.state.preventDefault,
    });
  };

  onKeyDown = (e: any, preventDefault: any) => {
    if (this.state.preventDefault) {
      preventDefault();
    }
  }

  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputNumber
          onKeyDown={this.onKeyDown}
          aria-label="Simple number input example"
          min={-8}
          max={10}
          style={{ width: 100 }}
          value={this.state.value}
          onChange={this.onChange}
          readOnly={this.state.readOnly}
          disabled={this.state.disabled}
        />
        <p>
          <button type="button" onClick={this.toggleDisabled}>
            toggle Disabled
          </button>
          <button type="button" onClick={this.toggleReadOnly}>
            toggle readOnly
          </button>
          <button type="button" onClick={this.togglePreventDefault}>
            toggle preventDefault when pressing keyboard
          </button>
        </p>
      </div>
    );
  }
}

export default Component;
