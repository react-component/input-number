import { renderToString } from 'react-dom/server';
import InputNumber from '../src';
import { render } from './util/wrapper';

jest.mock('@rc-component/util/lib/isMobile', () => () => true);

// Mobile touch experience is not user-friendly which not apply in antd.
// Let's hide operator instead.

describe('InputNumber.Mobile', () => {
  it('not show steps when mobile', () => {
    const { container } = render(<InputNumber />);
    expect(container.querySelector('.rc-input-number-handler-wrap')).toBeFalsy();
  });

  it('should render in server side', () => {
    const serverHTML = renderToString(<InputNumber />);
    expect(serverHTML).toContain('rc-input-number-handler-wrap');
  });

  it('can show steps when set controls to true', () => {
    const { container } = render(<InputNumber controls />);
    expect(container.querySelector('.rc-input-number-handler-wrap')).toBeTruthy();
  });
});
