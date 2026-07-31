/* eslint no-console:0 */
import InputNumber from '@rc-component/input-number';
import React from 'react';
import '../../assets/index.less';

export default () => {
  const [value, setValue] = React.useState<string | number>(100);

  const onChange = (val: number) => {
    console.log('onChange:', val, typeof val);
    setValue(val);
  };

  return (
    <div style={{ margin: 10 }}>
      <InputNumber style={{ width: 200 }} value={value} onChange={onChange} allowClear={true} />

      <hr />
      <h3>with suffix</h3>

      <InputNumber
        style={{ width: 200 }}
        value={value}
        onChange={onChange}
        prefix="¥"
        suffix="RMB"
        allowClear={true}
      />

      <hr />
      <h3>with custom clear value</h3>

      <InputNumber
        style={{ width: 200 }}
        value={value}
        onChange={onChange}
        prefix="¥"
        suffix="RMB"
        allowClear={{ clearValue: 1 }}
      />

      <hr />
      <h3>with custom clear icon</h3>

      <InputNumber
        style={{ width: 200 }}
        value={value}
        onChange={onChange}
        prefix="¥"
        suffix="RMB"
        allowClear={{ clearIcon: <span style={{ color: 'red' }}>clear</span> }}
      />
    </div>
  );
};
