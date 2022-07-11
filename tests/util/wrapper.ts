import type { ReactElement } from 'react';
import { act } from 'react-dom/test-utils';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';

const globalTimeout = global.setTimeout;

export const sleep = async (timeout = 0) => {
  await act(async () => {
    await new Promise(resolve => {
      globalTimeout(resolve, timeout);
    });
  });
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { ...options });

export { customRender as render };

export * from '@testing-library/react';
