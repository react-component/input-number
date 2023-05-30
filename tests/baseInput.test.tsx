import { render } from '@testing-library/react';
import InputNumber from '../src';

describe('baseInput', () => {
  it('prefix should render properly', () => {
    const prefix = <span>Prefix</span>;

    const { container } = render(<InputNumber prefixCls="rc-input" prefix={prefix} />);
    expect(container).toMatchSnapshot();
  });

  it('addon should render properly', () => {
    const addonBefore = <span>Addon Before</span>;
    const addonAfter = <span>Addon After</span>;

    const { container } = render(
      <div>
        <InputNumber prefixCls="rc-input" addonBefore={addonBefore} />
        <br />
        <br />
        <InputNumber prefixCls="rc-input" addonAfter={addonAfter} />
      </div>,
    );
    expect(container).toMatchSnapshot();
  });
});
