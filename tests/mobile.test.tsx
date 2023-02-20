import * as React from 'react';
import { render } from './util/wrapper';
import InputNumber from '../src';
import { renderToString } from 'react-dom/server';

jest.mock('rc-util/lib/isMobile', () => () => true);

// Mobile touch experience is not user-friendly which not apply in antd.
// Let's hide operator instead.

describe('InputNumber.Mobile', () => {
  it('not show steps when mobile', () => {
    const {container} = render(<InputNumber />);
    expect(container.querySelector('.rc-input-number-handler-wrap')).toBeFalsy();
  });

  it('should render in server side', () => {
    const serverHTML = renderToString(<InputNumber />);
    expect(serverHTML).toContain('rc-input-number-handler-wrap');
  })
});
