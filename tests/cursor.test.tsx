import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { render, fireEvent } from './util/wrapper';
import InputNumber from '../src';

describe('InputNumber.Cursor', () => {
  function cursorInput(input: HTMLInputElement, pos?: number) {

    if (pos !== undefined) {
      input.setSelectionRange(pos, pos);
    }
    return input.selectionStart;
  }

  function changeOnPos(
    input: HTMLInputElement,
    changeValue: string,
    cursorPos: number,
    which?: number,
    key?: number|string,
  ) {
    fireEvent.focus(input)
    fireEvent.keyDown(input,{which,keyCode:which,key})
    fireEvent.change(input,{ target: { value: changeValue, selectionStart: 1 }})
    fireEvent.keyUp(input,{which,keyCode:which,key})
  }

  // https://github.com/react-component/input-number/issues/235
  // We use post update position that not record before keyDown.
  // Origin test suite:
  // https://github.com/react-component/input-number/blob/e72ee088bdc8a8df32383b8fc0de562574e8616c/tests/index.test.js#L1490
  it('DELETE (not backspace)', () => {
    const { container } = render(<InputNumber defaultValue={12} />);
    const input = container.querySelector('input');
    changeOnPos(input, '12', 1, KeyCode.DELETE);
    expect(cursorInput(input)).toEqual(1);
  });

  // https://github.com/ant-design/ant-design/issues/28366
  // Origin test suite:
  // https://github.com/react-component/input-number/blob/e72ee088bdc8a8df32383b8fc0de562574e8616c/tests/index.test.js#L1584
  describe('pre-pend string', () => {
    it('quick typing', () => {
      // `$ ` => `9$ ` => `$ 9`
      const { container } = render(<InputNumber defaultValue="$ " formatter={(val) => `$ ${val}`} />);
      const input = container.querySelector('input');
      fireEvent.focus(input)
      cursorInput(input, 0);
      changeOnPos(input, '9$ ', 1, KeyCode.NUM_ONE,'1');
      expect(cursorInput(input,3)).toEqual(3);
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

        const { container } = render(<Demo />);
        const input = container.querySelector('input');
        fireEvent.focus(input)
        for (let i = 0; i < prependValue.length; i += 1) {
          fireEvent.keyDown(input,{which: KeyCode.ONE,keyCode: KeyCode.ONE})
        }

        const finalValue = prependValue + initValue;
        cursorInput(input, prependValue.length);
        fireEvent.change(input,{ target: { value: finalValue } });

        return input;
      };

      it('should fix caret position on case 1', () => {
        // '$ 1'
        const input = setUpCursorTest('', '1');
        expect(cursorInput(input,3)).toEqual(3);
      });

      it('should fix caret position on case 2', () => {
        // '$ 111'
        const input = setUpCursorTest('', '111');
        expect(cursorInput(input,5)).toEqual(5);
      });

      it('should fix caret position on case 3', () => {
        // '$ 111'
        const input = setUpCursorTest('1', '11');
        expect(cursorInput(input,4)).toEqual(4);
      });

      it('should fix caret position on case 4', () => {
        // '$ 123,456'
        const input = setUpCursorTest('456', '123');
        expect(cursorInput(input,6)).toEqual(6);
      });
    });
  });
});
