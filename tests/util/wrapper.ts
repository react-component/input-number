import { ReactWrapper, mount } from 'enzyme';

type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (
  ...a: Parameters<T>
) => TNewReturn;

interface Wrapper extends ReactWrapper {
  findInput: () => Wrapper;
  changeValue: (value: string) => Wrapper;
}

const wrapperMount = (mount as any) as ReplaceReturnType<typeof mount, Wrapper>;

export { wrapperMount as mount, Wrapper as ReactWrapper };
