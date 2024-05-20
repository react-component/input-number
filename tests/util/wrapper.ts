import type { RenderOptions } from '@testing-library/react';
import { act, render } from '@testing-library/react';
import type { ReactElement } from 'react';

const globalTimeout = global.setTimeout;

export const sleep = async (timeout = 0) => {
  await act(async () => {
    await new Promise((resolve) => {
      globalTimeout(resolve, timeout);
    });
  });
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { ...options });

export * from '@testing-library/react';
export { customRender as render };
