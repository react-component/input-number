/* eslint no-console:0 */
import React from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

export default class Demo extends React.Component {
  state = {
    disabled: false,
    readOnly: false,
    value: 99,
  };

  onChange = v => {
    console.log('onChange:', v);
    this.setState({
      value: v,
    });
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
        <p>Value Range is [-8, 10], initialValue is out of range.</p>
        <InputNumber
          aria-label="Number input example that demonstrates using decimal values"
          min={-8}
          max={10}
          step={0.1}
          value={this.state.value}
          style={{ width: 100 }}
          readOnly={this.state.readOnly}
          onChange={this.onChange}
          disabled={this.state.disabled}
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
