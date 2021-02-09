/* eslint no-console:0 */
import React from 'react';
import InputNum from 'rc-input-number';
import '../../assets/index.less';

export default () => {
  const [stringMode, setStringMode] = React.useState(false);
  const [value, setValue] = React.useState<number | string>(0.000000001);

  return (
    <div style={{ margin: 10 }}>
      <InputNum
        aria-label="Number input example of very small increments"
        min={-10}
        max={10}
        step={stringMode ? '0.000000001' : 0.000000001}
        value={value}
        style={{ width: 200 }}
        onChange={(newValue) => {
          console.log('onChange:', newValue);
          setValue(newValue);
        }}
        stringMode={stringMode}
      />

      <label>
        <input
          type="checkbox"
          checked={stringMode}
          onChange={() => {
            setStringMode(!stringMode);
          }}
        />
        String Mode
      </label>
    </div>
  );
};
