/* eslint no-console:0 */
import React from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

class Component extends React.Component {
  state = {
    disabled: false,
    readOnly: false,
    value: 50000,
  };

  onChange = (value) => {
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

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  format = (num) => {
    return `$ ${this.numberWithCommas(num)} boeing737`;
  };

  parser = (num: string) => {
    const cells = num.toString().split(' ');
    if (!cells[1]) {
      return num;
    }

    const parsed = cells[1].replace(/,*/g, '');

    return parsed;
  };

  render() {
    return (
      <div style={{ margin: 10 }}>
        <p>
          When number is validate in range, keep formatting.
          Else will flush when blur.
        </p>

        <InputNumber
          aria-label="Number input example that demonstrates combination key format"
          min={-8000}
          max={10000000}
          value={this.state.value}
          style={{ width: 200 }}
          readOnly={this.state.readOnly}
          onChange={this.onChange}
          disabled={this.state.disabled}
          autoFocus={false}
          step={100}
          formatter={this.format}
          parser={this.parser}
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
