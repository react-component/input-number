/* eslint no-console:0 */
import React from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

export default () => {
  const [value, setValue] = React.useState('aaa');
  const [lock, setLock] = React.useState(false);

  return (
    <div>
      <InputNumber
        value={value}
        max={999}
        onChange={(newValue) => {
          console.log('Change:', newValue);
        }}
        onInput={(text) => {
          console.log('Input:', text);
          if (!lock) {
            setValue(text);
          }
        }}
      />

      <button onClick={() => setLock(!lock)}>Lock Value ({String(lock)})</button>
      <button onClick={() => setValue('93')}>Change Value</button>
    </div>
  );
};
