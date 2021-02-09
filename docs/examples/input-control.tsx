/* eslint no-console:0 */
import React from 'react';
import InputNumber from 'rc-input-number';
import '../../assets/index.less';

export default () => {
  const [value, setValue] = React.useState('aaa');

  return <InputNumber value={value} onInput={setValue} />;
};
