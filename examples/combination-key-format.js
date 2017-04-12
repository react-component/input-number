/* eslint no-console:0 */
import 'rc-input-number/assets/index.less';
import InputNumber from 'rc-input-number';
import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  state = {
    disabled: false,
    readOnly: false,
    value: 50000,
  };
  onChange = (value) => {
    console.log('onChange:', value);
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
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  format(num) {
    return `$ ${this.numberWithCommas(num)} boeing737`;
  }
  parser(num) {
    return num.toString().split(' ')[1].replace(/,*/g, '');
  }
  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputNumber
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
          <button onClick={this.toggleDisabled}>toggle Disabled</button>
          <button onClick={this.toggleReadOnly}>toggle readOnly</button>
        </p>
      </div>
    );
  }
}

ReactDOM.render(<Component/>, document.getElementById('__react-content'));
