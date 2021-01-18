/* eslint no-console:0 */
import React from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

class Component extends React.Component {
  state = {
    precision: 2,
  };

  onChange = value => {
    console.log('onChange:', value);
    this.setState({ value });
  };

  changeprecision = e => {
    this.setState({
      precision: parseInt(e.target.value, 10),
    });
  };

  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputNumber
          aria-label="Number input example to demonstration custom precision value"
          style={{ width: 100 }}
          value={this.state.value}
          onChange={this.onChange}
          precision={this.state.precision}
        />
        <p>
          precision:
          <input type="number" onChange={this.changeprecision} value={this.state.precision} />
        </p>
      </div>
    );
  }
}

export default Component;
