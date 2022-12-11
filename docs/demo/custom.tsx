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
    const upHandler = <div style={{ color: 'blue' }}>x</div>;
    const downHandler = <div style={{ color: 'red' }}>V</div>;
    return (
      <div style={{ margin: 10 }}>
        <InputNumber
          aria-label="Number input example that demonstrates custom styling"
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
  }
}

export default Component;
