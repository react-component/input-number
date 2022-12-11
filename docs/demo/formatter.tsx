/* eslint no-console:0 */
import React from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

function getSum(str) {
  let total = 0;
  str.split('').forEach((c) => {
    const num = Number(c);

    if (!Number.isNaN(num)) {
      total += num;
    }
  });

  return total;
}

const CHINESE_NUMBERS = '零一二三四五六七八九';

function chineseParser(text: string) {
  const parsed = [...text]
    .map((cell) => {
      const index = CHINESE_NUMBERS.indexOf(cell);
      if (index !== -1) {
        return index;
      }

      return cell;
    })
    .join('');

  if (Number.isNaN(Number(parsed))) {
    return text;
  }

  return parsed;
}

function chineseFormatter(value: string) {
  return [...value]
    .map((cell) => {
      const index = Number(cell);
      if (!Number.isNaN(index)) {
        return CHINESE_NUMBERS[index];
      }

      return cell;
    })
    .join('');
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
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          onChange={console.log}
        />
        <InputNumber
          aria-label="Controlled number input demonstrating a custom percentage format"
          defaultValue={100}
          formatter={(value) => `${value}%`}
          parser={(value) => value.replace('%', '')}
          onChange={console.log}
        />
        <InputNumber
          aria-label="Controlled number input demonstrating a custom format to add commas"
          style={{ width: 100 }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          onChange={console.log}
        />

        <div>
          <h1>In Control</h1>
          <InputNumber
            aria-label="Controlled number input demonstrating a custom format"
            value={this.state.value}
            onChange={(value) => {
              // console.log(value);
              this.setState({ value });
            }}
            formatter={(value, { userTyping, input }) => {
              if (userTyping) {
                return input;
              }
              return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }}
          />

          <InputNumber<string | number>
            aria-label="Controlled number input demonstrating a custom format"
            value={this.state.value}
            onChange={(value) => {
              console.log(value);
              this.setState({ value });
            }}
            parser={chineseParser}
            formatter={chineseFormatter}
          />
        </div>

        <div>
          <h1>Strange Format</h1>
          <InputNumber
            aria-label="Number input example demonstrating a strange custom format"
            defaultValue={1000}
            formatter={(value) => `$ ${value} - ${getSum(value)}`}
            parser={(value) => (value.match(/^\$ ([\d.]*) .*$/) || [])[1]}
            onChange={console.log}
          />
        </div>
      </div>
    );
  }
}

export default App;
