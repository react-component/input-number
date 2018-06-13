/* eslint no-console:0 */
import 'rc-input-number/assets/index.less';
import InputNumber from 'rc-input-number';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputNumber
          defaultValue={1000}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('__react-content'));
