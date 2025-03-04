/* eslint no-console:0 */
import InputNumber from '@rc-component/input-number';
import React from 'react';
import '../../assets/index.less';

export default () => {
  const [disabled, setDisabled] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState(false);
  const [keyboard, setKeyboard] = React.useState(true);
  const [wheel, setWheel] = React.useState(true);
  const [stringMode, setStringMode] = React.useState(false);
  const [value, setValue] = React.useState<string | number>(93);

  const onChange = (val: number) => {
    console.warn('onChange:', val, typeof val);
    setValue(val);
  };

  return (
    <div style={{ margin: 10 }}>
      <h3>Controlled</h3>
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
        changeOnWheel={wheel}
        stringMode={stringMode}
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
        <button type="button" onClick={() => setStringMode(!stringMode)}>
          toggle stringMode ({String(stringMode)})
        </button>
        <button type="button" onClick={() => setWheel(!wheel)}>
          toggle wheel ({String(wheel)})
        </button>
      </p>

      <hr />
      <h3>Uncontrolled</h3>
      <InputNumber
        style={{ width: 100 }}
        onChange={onChange}
        min={-99}
        max={99}
        defaultValue={33}
      />

      <hr />
      <h3>!changeOnBlur</h3>
      <InputNumber
        style={{ width: 100 }}
        min={-9}
        max={9}
        defaultValue={10}
        onChange={onChange}
        changeOnBlur={false}
      />
    </div>
  );
};
