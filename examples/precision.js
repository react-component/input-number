/* eslint no-console:0 */
import 'rc-input-number/assets/index.less';
import InputNumber from 'rc-input-number';
import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  state = {
    precision: 2,
  };
  onChange = (value) => {
    console.log('onChange:', value);
    this.setState({ value });
  }
  changeprecision = (e) => {
    this.setState({
      precision: parseInt(e.target.value, 10),
    });
  }
  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputNumber
          aria-label="Number input example to demonstration custom precision value"
          style={{ width: 100 }}
          defaultValue={1}
          onChange={this.onChange}
          precision={this.state.precision}
        />
        <p>
          precision:
          <input
            type="number"
            onChange={this.changeprecision}
            value={this.state.precision}
          />
        </p>
      </div>
    );
  }
}

ReactDOM.render(<Component/>, document.getElementById('__react-content'));
