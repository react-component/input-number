import { fireEvent, render } from '@testing-library/react';
import InputNumber from '../src';
import React from 'react';

describe('InputNumber.Semantic', () => {
  it('support classNames and styles', () => {
    const testClassNames = {
      prefix: 'test-prefix',
      input: 'test-input',
      suffix: 'test-suffix',
      handle: 'test-handle',
    };
    const testStyles = {
      prefix: { color: 'red' },
      input: { color: 'blue' },
      suffix: { color: 'green' },
      handle: { color: 'yellow' },
    };
    const { container } = render(
      <InputNumber
        prefixCls="rc-input-number"
        prefix="prefix"
        suffix={<div>suffix</div>}
        styles={testStyles}
        classNames={testClassNames}
      />,
    );
    const input = container.querySelector('.rc-input-number')!;
    const prefix = container.querySelector('.rc-input-number-prefix')!;
    const suffix = container.querySelector('.rc-input-number-suffix')!;
    const handle = container.querySelector('.rc-input-number-input-wrap')!;
    expect(input.className).toContain(testClassNames.input);
    expect(prefix.className).toContain(testClassNames.prefix);
    expect(suffix.className).toContain(testClassNames.suffix);
    expect(handle.className).toContain(testClassNames.handle);
    expect(prefix.style.color).toBe(testStyles.prefix.color);
    expect(input.style.color).toBe(testStyles.input.color);
    expect(suffix.style.color).toBe(testStyles.suffix.color);
    expect(handle.style.color).toBe(testStyles.handle.color);
  });
});
