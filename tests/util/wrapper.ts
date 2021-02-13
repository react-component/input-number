import * as React from 'react';
import { ReactWrapper, mount } from 'enzyme';

type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (
  ...a: Parameters<T>
) => TNewReturn;

interface Wrapper<P = {}, S = {}, C = React.Component<{}, {}, any>> extends ReactWrapper<P, S, C> {
  findInput: () => Wrapper<React.InputHTMLAttributes<HTMLInputElement>>;
  focusInput: () => Wrapper;
  blurInput: () => Wrapper;
  changeValue: (value: string, which?: number) => Wrapper;
  getInputValue: () => string;
}

const wrapperMount = (mount as any) as ReplaceReturnType<typeof mount, Wrapper>;

export { wrapperMount as mount, Wrapper as ReactWrapper };
