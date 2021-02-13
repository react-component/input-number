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

  // https://github.com/react-component/input-number/issues/235
  it('DELETE (not backspace)', () => {
    const wrapper = mount(<InputNumber defaultValue={11} />);
    wrapper.focusInput();
    cursorInput(wrapper, 1);

    wrapper.findInput().simulate('keyDown', { which: KeyCode.DELETE });
    wrapper.changeValue('1', KeyCode.DELETE);

    expect(cursorInput(wrapper)).toEqual(233);
  });

  // TODO: handle this
  describe('cursor position', () => {
    //   const setUpCursorTest = (
    //     initialValue,
    //     changedValue,
    //     keyCodeValue,
    //     selectionStart,
    //     selectionEnd,
    //   ) => {
    //     class Demo extends React.Component {
    //       onChange = (value) => {
    //         this.setState({ value });
    //       };
    //       render() {
    //         return <InputNumber ref="inputNum" value={initialValue} onChange={this.onChange} />;
    //       }
    //     }
    //     example = ReactDOM.render(<Demo />, container);
    //     inputNumber = example.refs.inputNum;
    //     inputNumber.input.selectionStart = selectionStart;
    //     inputNumber.input.selectionEnd = selectionEnd || selectionStart;
    //     inputElement = ReactDOM.findDOMNode(inputNumber.input);
    //     Simulate.focus(inputElement);
    //     Simulate.keyDown(inputElement, { keyCode: keyCodeValue });
    //     Simulate.change(inputElement, { target: { value: changedValue } });
    // };
    //   it('should be maintained on delete with identical consecutive digits', () => {
    //     setUpCursorTest(99999, '9999', keyCode.DELETE, 3);
    //     expect(inputNumber.input.selectionStart).to.be(3);
    //   });
    //   it('should be maintained on delete with unidentical consecutive digits', () => {
    //     setUpCursorTest(12345, '1235', keyCode.DELETE, 3);
    //     expect(inputNumber.input.selectionStart).to.be(3);
    //   });
    //   it('should be one step earlier on backspace with identical consecutive digits', () => {
    //     setUpCursorTest(99999, '9999', keyCode.BACKSPACE, 3);
    //     expect(inputNumber.input.selectionStart).to.be(2);
    //   });
    //   it('should be one step earlier on backspace with unidentical consecutive digits', () => {
    //     setUpCursorTest(12345, '1245', keyCode.BACKSPACE, 3);
    //     expect(inputNumber.input.selectionStart).to.be(2);
    //   });
    //   it('should be at the start of selection on delete with identical consecutive digits', () => {
    //     setUpCursorTest(99999, '999', keyCode.DELETE, 1, 3);
    //     expect(inputNumber.input.selectionStart).to.be(1);
    //   });
    //   it('should be at the start of selection on delete with unidentical consecutive digits', () => {
    //     // eslint-disable-line
    //     setUpCursorTest(12345, '145', keyCode.DELETE, 1, 3);
    //     expect(inputNumber.input.selectionStart).to.be(1);
    //   });
    //   it('should be at the start of selection on backspace with identical consecutive digits', () => {
    //     // eslint-disable-line
    //     setUpCursorTest(99999, '999', keyCode.BACKSPACE, 1, 3);
    //     expect(inputNumber.input.selectionStart).to.be(1);
    //   });
    //   it('should be at the start of selection on backspace with unidentical consecutive digits', () => {
    //     // eslint-disable-line
    //     setUpCursorTest(12345, '145', keyCode.BACKSPACE, 1, 3);
    //     expect(inputNumber.input.selectionStart).to.be(1);
    //   });
    //   it('should be one step later on new digit with identical consecutive digits', () => {
    //     setUpCursorTest(99999, '999999', keyCode.NINE, 3);
    //     expect(inputNumber.input.selectionStart).to.be(4);
    //   });
    //   it('should be one step later on new digit with unidentical consecutive digits', () => {
    //     setUpCursorTest(12345, '123945', keyCode.NINE, 3);
    //     expect(inputNumber.input.selectionStart).to.be(4);
    //   });
    //   it('should be one step later than the start of selection on new digit with identical consecutive digits', () => {
    //     // eslint-disable-line
    //     setUpCursorTest(99999, '9999', keyCode.NINE, 1, 3);
    //     expect(inputNumber.input.selectionStart).to.be(2);
    //   });
    //   it('should be one step later than the start of selection on new digit with unidentical consecutive digits', () => {
    //     // eslint-disable-line
    //     setUpCursorTest(12345, '1945', keyCode.NINE, 1, 3);
    //     expect(inputNumber.input.selectionStart).to.be(2);
    //   });
  });

  // https://github.com/ant-design/ant-design/issues/28366
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
