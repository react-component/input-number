import InputNumber from '@rc-component/input-number';
import React from 'react';
import '../../assets/index.less';

export default () => (
  <div style={{ display: 'flex', gap: 12, margin: 10 }}>
    <InputNumber allowClear defaultValue={100} />
    <InputNumber allowClear={{ clearIcon: '⌫' }} defaultValue={0} />
    <InputNumber allowClear={{ disabled: true }} defaultValue={100} />
  </div>
);
