/* eslint no-console:0 */
import React, { useEffect } from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

export default () => {
  const [value, setValue] = React.useState<string | number>(5);

  useEffect(() => {
    function keyDown(event: KeyboardEvent) {
      if ((event.ctrlKey === true || event.metaKey) && event.keyCode === 90) {
        setValue(3);
      }
    }
    document.addEventListener('keydown', keyDown);

    return () => document.removeEventListener('keydown', keyDown);
  }, []);

  return (
    <>
      <InputNumber
        style={{ width: 100 }}
        onChange={(nextValue) => {
          console.log('Change:', nextValue);
          setValue(nextValue);
        }}
        value={value}
      />
      {value}
      <button
        onClick={() => {
          setValue(99);
        }}
      >
        Change
      </button>
    </>
  );
};
