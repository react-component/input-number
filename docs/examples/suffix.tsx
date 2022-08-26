/* eslint no-console:0 */
import React from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

export default () => {
  const [value, setValue] = React.useState<string | number>(93);

  const onChange = (val: number) => {
    console.warn('onChange:', val, typeof val);
    setValue(val);
  };

  return (
    <div style={{ margin: 10 }}>
      <h3>suffix</h3>
      <InputNumber
        aria-label="Simple number input example"
        value={value}
        onChange={onChange}
        suffix="$"
      />
    </div>
  );
};
