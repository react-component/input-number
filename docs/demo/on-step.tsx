/* eslint no-console:0 */
import InputNumber from '@rc-component/input-number';
import React, { useState } from 'react';
import '../../assets/index.less';

export default () => {
  const [emitter, setEmitter] = useState('interface buttons (up)');
  const [value, setValue] = React.useState<string | number>(0);

  const onChange = (val: number) => {
    console.warn('onChange:', val, typeof val);
    setValue(val);
  };

  const onStep = (_: number, info: { offset: number; type: 'up' | 'down', emitter: 'handler' | 'keyboard' | 'wheel' }) => {
    if (info.emitter === 'handler') {
      setEmitter(`interface buttons (${info.type})`);
    }

    if (info.emitter === 'keyboard') {
      setEmitter(`keyboard (${info.type})`);
    }

    if (info.emitter === 'wheel') {
      setEmitter(`mouse wheel (${info.type})`);
    }
  };

  return (
    <div style={{ margin: 10 }}>
      <h3>onStep callback</h3>
      <InputNumber
        aria-label="onStep callback example"
        min={0}
        max={10}
        style={{ width: 100 }}
        value={value}
        changeOnWheel
        onChange={onChange}
        onStep={onStep}
      />

      <div style={{ marginTop: 10 }}>Triggered by: {emitter}</div>
    </div>
  );
};
