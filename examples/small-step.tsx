/* eslint no-console:0 */
import React from 'react';
import InputNum from '../src';
import '../assets/index.less';

class Component extends React.Component {
  state = {
    value: 0.000000001,
  };

  onChange = v => {
    console.log('onChange:', v);
    this.setState({
      value: v,
    });
  };

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

export default Component;
