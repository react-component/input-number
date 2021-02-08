/* eslint no-console:0 */
import React from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

export default () => {
  const [disabled, setDisabled] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState(false);
  const [keyboard, setKeyboard] = React.useState(true);
  const [value, setValue] = React.useState(5);

  const onChange = (val: number) => {
    console.log('onChange:', val);
    setValue(val);
  };

  return (
    <div style={{ margin: 10 }}>
      <InputNumber
        aria-label="Simple number input example"
        min={-8}
        max={10}
        style={{ width: 100 }}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        keyboard={keyboard}
      />
      <p>
        <button type="button" onClick={() => setDisabled(!disabled)}>
          toggle Disabled ({String(disabled)})
        </button>
        <button type="button" onClick={() => setReadOnly(!readOnly)}>
          toggle readOnly ({String(readOnly)})
        </button>
        <button type="button" onClick={() => setKeyboard(!keyboard)}>
          toggle keyboard ({String(keyboard)})
        </button>
      </p>
    </div>
  );
};
