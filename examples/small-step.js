/* eslint no-console:0 */
import 'rc-input-number/assets/index.less';
import InputNum from'rc-input-number';
import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  state = {
    value: 0.000000001,
  };
  onChange = (v) => {
    console.log('onChange:', v);
    this.setState({
      value: v,
    });
  }
  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputNum
          aria-label="Number input example of very small increments"
          min={-10}
          max={10}
          step={0.000000001}
          value={this.state.value}
          style={{ width: 100 }}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

ReactDOM.render(<Component/>, document.getElementById('__react-content'));
