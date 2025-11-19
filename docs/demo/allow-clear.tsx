/* eslint no-console:0 */
import InputNumber from '@rc-component/input-number';
import React from 'react';
import '../../assets/index.less';

export default () => {
  const [value, setValue] = React.useState<string | number>(100);

  const onChange = (val: number) => {
    setValue(val);
  };

  return (
    <div style={{ margin: 10 }}>
      <InputNumber
        allowClear={{ clearValue: 1 }}
        style={{ width: 200 }}
        value={value}
        onChange={onChange}
        prefix="¥"
        suffix="RMB"
      />
    </div>
  );
};
