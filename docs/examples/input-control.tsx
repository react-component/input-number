/* eslint no-console:0 */
import React from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

export default () => {
  const [value, setValue] = React.useState('aaa');

  return (
    <div>
      <InputNumber
        value={value}
        onChange={(newValue) => {
          console.log('Change:', newValue);
        }}
        onInput={(text) => {
          console.log('Input:', text);
          setValue(text);
        }}
      />
    </div>
  );
};
