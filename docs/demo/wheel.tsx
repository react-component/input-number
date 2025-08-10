/* eslint no-console:0 */
import InputNumber from '@rc-component/input-number';
import React from 'react';
import '../../assets/index.less';

export default () => {
  return (
    <div style={{ margin: 10 }}>
      <InputNumber
        style={{ width: 100 }}
        defaultValue={10}
        changeOnBlur={false}
        changeOnWheel
      />
    </div>
  );
};
