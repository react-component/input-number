import { render } from '@testing-library/react';
import InputNumber from '../src';

describe('InputNumber.Semantic', () => {
  it('support classNames and styles', () => {
    const testClassNames = {
      root: 'test-root',
      prefix: 'test-prefix',
      input: 'test-input',
      suffix: 'test-suffix',
      clear: 'test-clear',
      actions: 'test-actions',
      action: 'test-action',
    };
    const testStyles = {
      root: { color: 'rgb(255, 165, 0)' },
      prefix: { color: 'rgb(255, 0, 0)' },
      input: { color: 'rgb(0, 0, 255)' },
      suffix: { color: 'rgb(0, 128, 0)' },
      clear: { color: 'rgb(128, 0, 128)' },
      actions: { color: 'rgb(255, 255, 0)' },
      action: { color: 'rgb(255, 192, 203)' },
    };
    const { container } = render(
      <InputNumber
        prefixCls="rc-input-number"
        prefix="prefix"
        suffix={<div>suffix</div>}
        allowClear
        defaultValue={1}
        styles={testStyles}
        classNames={testClassNames}
      />,
    );

    const root = container.querySelector('.rc-input-number')!;
    const input = container.querySelector('input')!;
    const prefix = container.querySelector('.rc-input-number-prefix')!;
    const suffix = container.querySelector('.rc-input-number-suffix')!;
    const clear = container.querySelector('.rc-input-number-clear-icon')!;
    const actions = container.querySelector('.rc-input-number-actions')!;
    const action = container.querySelector('.rc-input-number-action')!;
    expect(root).toHaveClass(testClassNames.root);
    expect(input).toHaveClass(testClassNames.input);
    expect(prefix).toHaveClass(testClassNames.prefix);
    expect(suffix).toHaveClass(testClassNames.suffix);
    expect(clear).toHaveClass(testClassNames.clear);
    expect(actions).toHaveClass(testClassNames.actions);
    expect(action).toHaveClass(testClassNames.action);
    expect(root).toHaveStyle(testStyles.root);
    expect(prefix).toHaveStyle(testStyles.prefix);
    expect(input).toHaveStyle(testStyles.input);
    expect(suffix).toHaveStyle(testStyles.suffix);
    expect(clear).toHaveStyle(testStyles.clear);
    expect(actions).toHaveStyle(testStyles.actions);
    expect(action).toHaveStyle(testStyles.action);
  });
});
