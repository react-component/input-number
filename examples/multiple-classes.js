/* eslint no-console:0 */
import 'rc-input-number/assets/index.less';
import InputNumber from 'rc-input-number';
import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  state = {
    value: 5,
  };
  onChange = (value) => {
    console.log('onChange:', value);
    this.setState({ value });
  }
  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputNumber
          prefixCls="custom-prefix rc-input-number"
          style={{ width: 100 }}
          defaultValue={1}
          onChange={this.onChange}
          precision={2}
        />
      </div>
    );
  }
}

ReactDOM.render(<Component/>, document.getElementById('__react-content'));
