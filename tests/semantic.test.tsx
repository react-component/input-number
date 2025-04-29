import { render } from '@testing-library/react';
import InputNumber from '../src';
import React from 'react';

describe('InputNumber.Semantic', () => {
  it('support classNames and styles', () => {
    const testClassNames = {
      prefix: 'test-prefix',
      input: 'test-input',
      suffix: 'test-suffix',
      actions: 'test-handle',
    };
    const testStyles = {
      prefix: { color: 'red' },
      input: { color: 'blue' },
      suffix: { color: 'green' },
      actions: { color: 'yellow' },
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
    const actions = container.querySelector('.rc-input-number-input-wrap')!;
    expect(input.className).toContain(testClassNames.input);
    expect(prefix.className).toContain(testClassNames.prefix);
    expect(suffix.className).toContain(testClassNames.suffix);
    expect(actions.className).toContain(testClassNames.actions);
    expect(prefix.style.color).toBe(testStyles.prefix.color);
    expect(input.style.color).toBe(testStyles.input.color);
    expect(suffix.style.color).toBe(testStyles.suffix.color);
    expect(actions.style.color).toBe(testStyles.actions.color);
  });
});
