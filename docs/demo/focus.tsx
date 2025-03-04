/* eslint no-console:0 */
import InputNumber, { InputNumberRef } from '@rc-component/input-number';
import React from 'react';
import '../../assets/index.less';

export default () => {
  const inputRef = React.useRef<InputNumberRef>(null);

  return (
    <div style={{ margin: 10 }}>
      <InputNumber aria-label="focus example" value={10} style={{ width: 100 }} ref={inputRef} />
      <div style={{ marginTop: 10 }}>
        <button type="button" onClick={() => inputRef.current?.focus({ cursor: 'start' })}>
          focus at start
        </button>
        <button type="button" onClick={() => inputRef.current?.focus({ cursor: 'end' })}>
          focus at end
        </button>
        <button type="button" onClick={() => inputRef.current?.focus({ cursor: 'all' })}>
          focus to select all
        </button>
        <button type="button" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
          focus prevent scroll
        </button>
      </div>
    </div>
  );
};
