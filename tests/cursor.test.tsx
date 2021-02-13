import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { mount, ReactWrapper } from './util/wrapper';
import InputNumber from '../src';

describe('InputNumber.Cursor', () => {
  function cursorInput(wrapper: ReactWrapper, pos?: number) {
    const input = (wrapper.findInput().instance() as any) as HTMLInputElement;

    if (pos !== undefined) {
      input.setSelectionRange(pos, pos);
    }

    return input.selectionStart;
  }

  function changeOnPos(
    wrapper: ReactWrapper,
    changeValue: string,
    cursorPos: number,
    which?: number,
  ) {
    wrapper.focusInput();
    wrapper.findInput().simulate('keyDown', { which });

    // eslint-disable-next-line no-param-reassign
    (wrapper.findInput().instance() as any).value = changeValue;
    cursorInput(wrapper, cursorPos);
    wrapper.findInput().simulate('change', { target: { value: changeValue } });

    wrapper.findInput().simulate('keyUp', { which });
  }

  // https://github.com/react-component/input-number/issues/235
  // We use post update position that not record before keyDown.
  // Origin test suite:
  // https://github.com/react-component/input-number/blob/e72ee088bdc8a8df32383b8fc0de562574e8616c/tests/index.test.js#L1490
  it('DELETE (not backspace)', () => {
    const wrapper = mount(<InputNumber defaultValue={12} />);
    changeOnPos(wrapper, '12', 1, KeyCode.DELETE);
    expect(cursorInput(wrapper)).toEqual(1);
  });

  // https://github.com/ant-design/ant-design/issues/28366
  // Origin test suite:
  // https://github.com/react-component/input-number/blob/e72ee088bdc8a8df32383b8fc0de562574e8616c/tests/index.test.js#L1584
  describe('pre-pend string', () => {
    it('quick typing', () => {
      // `$ ` => `9$ ` => `$ 9`
      const wrapper = mount(<InputNumber defaultValue="$ " formatter={(val) => `$ ${val}`} />);
      wrapper.focusInput();
      cursorInput(wrapper, 0);
      changeOnPos(wrapper, '9$ ', 1, KeyCode.NUM_ONE);

      expect(cursorInput(wrapper)).toEqual(3);
    });

    describe('[LEGACY]', () => {
      const setUpCursorTest = (initValue: string, prependValue: string) => {
        const Demo = () => {
          const [value, setValue] = React.useState(initValue);

          return (
            <InputNumber<string>
              stringMode
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              formatter={(val) => `$ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(val) => val.replace(/\$\s?|(,*)/g, '')}
            />
          );
        };

        const wrapper = mount(<Demo />);
        wrapper.focusInput();

        for (let i = 0; i < prependValue.length; i += 1) {
          wrapper.findInput().simulate('keyDown', { which: KeyCode.ONE });
        }

        const finalValue = prependValue + initValue;
        // eslint-disable-next-line no-param-reassign
        (wrapper.findInput().instance() as any).value = finalValue;
        cursorInput(wrapper, prependValue.length);
        wrapper.findInput().simulate('change', { target: { value: finalValue } });

        return wrapper;
      };

      it('should fix caret position on case 1', () => {
        // '$ 1'
        const wrapper = setUpCursorTest('', '1');
        expect(cursorInput(wrapper)).toEqual(3);
      });

      it('should fix caret position on case 2', () => {
        // '$ 111'
        const wrapper = setUpCursorTest('', '111');
        expect(cursorInput(wrapper)).toEqual(5);
      });

      it('should fix caret position on case 3', () => {
        // '$ 111'
        const wrapper = setUpCursorTest('1', '11');
        expect(cursorInput(wrapper)).toEqual(4);
      });

      it('should fix caret position on case 4', () => {
        // '$ 123,456'
        const wrapper = setUpCursorTest('456', '123');
        expect(cursorInput(wrapper)).toEqual(6);
      });
    });
  });
});
