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
  it('quick typing', () => {
    const wrapper = mount(<InputNumber defaultValue="$ " formatter={(val) => `$ ${val}`} />);
    wrapper.focusInput();
    cursorInput(wrapper, 0);
    changeOnPos(wrapper, '9$ ', 1, KeyCode.NUM_ONE);

    expect(cursorInput(wrapper)).toEqual(3);
  });
  // describe('cursor position when last string exists', () => {
  //   // const setUpCursorTest = (initValue, prependValue) => {
  //   //   class Demo extends React.Component {
  //   //     state = {
  //   //       value: initValue,
  //   //     };

  //   //     onChange = value => {
  //   //       this.setState({ value });
  //   //     };

  //   //     render() {
  //   //       return (
  //   //         <InputNumber
  //   //           ref="inputNum"
  //   //           value={this.state.value}
  //   //           onChange={this.onChange}
  //   //           formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
  //   //           parser={value => value.replace(/\$\s?|(,*)/g, '')}
  //   //         />
  //   //       );
  //   //     }
  //   //   }
  //   //   example = ReactDOM.render(<Demo />, container);
  //   //   inputNumber = example.refs.inputNum;
  //   //   inputNumber.input.selectionStart = 0;
  //   //   inputNumber.input.selectionEnd = 0;
  //   //   inputElement = ReactDOM.findDOMNode(inputNumber.input);
  //   //   Simulate.focus(inputElement);
  //   //   for (let i = 0; i < prependValue.length; i += 1) {
  //   //     Simulate.keyDown(inputElement, { keyCode: keyCode.ONE });
  //   //   }
  //   //   Simulate.change(inputElement, { target: { value: prependValue + initValue } });
  //   // };

  //   // it('shold fix caret position on case 1', () => {
  //   //   // '$ 1'
  //   //   setUpCursorTest('', '1');
  //   //   expect(inputNumber.input.selectionStart).to.be(3);
  //   // });
  //   // it('shold fix caret position on case 2', () => {
  //   //   // '$ 111'
  //   //   setUpCursorTest('', '111');
  //   //   expect(inputNumber.input.selectionStart).to.be(5);
  //   // });
  //   // it('shold fix caret position on case 3', () => {
  //   //   // '$ 111'
  //   //   setUpCursorTest('1', '11');
  //   //   expect(inputNumber.input.selectionStart).to.be(4);
  //   // });
  //   // it('shold fix caret position on case 4', () => {
  //   //   // '$ 123,456'
  //   //   setUpCursorTest('456', '123');
  //   //   expect(inputNumber.input.selectionStart).to.be(6);
  //   // });
  // });
});
