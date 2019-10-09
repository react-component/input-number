/* eslint no-console:0 */
import 'rc-input-number/assets/index.less';
import InputNumber from 'rc-input-number';
import React from 'react';
import ReactDOM from 'react-dom';

function getSum(str) {
  let total = 0;
  str.split('').forEach((c) => {
    const num = Number(c);

    if (!isNaN(num)) {
      total += num;
    }
  });

  return total;
}

class App extends React.Component {
  state = {
    value: 1000,
  };

  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputNumber
          aria-label="Controlled number input demonstrating a custom currency format"
          defaultValue={1000}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
        <InputNumber
          aria-label="Controlled number input demonstrating a custom percentage format"
          defaultValue={100}
          formatter={value => `${value}%`}
          parser={value => value.replace('%', '')}
        />
        <InputNumber
          aria-label="Controlled number input demonstrating a custom format to add commas"
          style={{ width: 100 }}
          formatter={value =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
        />

        <div>
          <h1>In Control</h1>
          <InputNumber
            aria-label="Controlled number input demonstrating a custom format"
            value={this.state.value}
            onChange={(value) => { this.setState({ value }); }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </div>

        <div>
          <h1>Strange Format</h1>
          <InputNumber
            aria-label="Number input example demonstrating a strange custom format"
            defaultValue={1000}
            formatter={value => `$ ${value} - ${getSum(value)}`}
            parser={value => (value.match(/^\$ ([\d\.]*) .*$/) || [])[1]}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('__react-content'));
