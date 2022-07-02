import React from 'react';
import { render, fireEvent } from './util/wrapper';
import KeyCode from 'rc-util/lib/KeyCode';
import InputNumber, { InputNumberProps } from '../src';

describe('InputNumber.Input',  () => {
   function prepareWrapper(text: string, props?: Partial<InputNumberProps>, skipInputCheck = false) {
    const { container } = render(<InputNumber {...props} />);
    const input = container.querySelector('input')
    fireEvent.focus(input)
    for (let i = 0; i < text.length; i += 1) {
      const inputTxt = text.slice(0, i + 1);
      fireEvent.change(input, { target: { value: inputTxt } });
    }

    if (!skipInputCheck) {
      expect(input.value).toEqual(text);
    }
     fireEvent.blur(input)
    return input
  }

  it('input valid number', () => {
    const wrapper = prepareWrapper('6');

    expect(wrapper.value).toEqual('6');
  });

  it('input invalid number', () => {
    const wrapper = prepareWrapper('xx');

    expect(wrapper.value).toEqual('');
  });

  it('input invalid string with number', () => {
    const wrapper = prepareWrapper('2x');

    expect(wrapper.value).toEqual('2');
  });

  it('input invalid decimal point with max number', () => {
    const wrapper = prepareWrapper('15.', { max: 10 });
    expect(wrapper.value).toEqual('10');
  });

  it('input invalid decimal point with min number', () => {
    const wrapper = prepareWrapper('3.', { min: 5 });
    expect(wrapper.value).toEqual('5');
  });

  it('input negative symbol', () => {
    const wrapper = prepareWrapper('-');
    expect(wrapper.value).toEqual('');
  });

  it('input negative number', () => {
    const wrapper = prepareWrapper('-98');
    expect(wrapper.value).toEqual('-98');
  });

  it('negative min with higher precision', () => {
    const wrapper = prepareWrapper('-4', {min: -3.5, precision: 0});
    expect(wrapper.value).toEqual('-3');
  });

  it('positive min with higher precision', () => {
    const wrapper = prepareWrapper('4', {min: 3.5, precision: 0});
    expect(wrapper.value).toEqual('4');
  });

  it('negative max with higher precision', () => {
    const wrapper = prepareWrapper('-4', {max: -3.5, precision: 0});
    expect(wrapper.value).toEqual('-4');
  });

  it('positive max with higher precision', () => {
    const wrapper = prepareWrapper('4', {max: 3.5, precision: 0});
    expect(wrapper.value).toEqual('3');
  });

  // https://github.com/ant-design/ant-design/issues/9439
  it('input negative zero', async () => {
    const wrapper = await  prepareWrapper('-0', {}, true);
    expect(wrapper.value).toEqual('0');
  });

  it('input decimal number with integer step', () => {
    const wrapper = prepareWrapper('1.2', { step: 1.2 });
    expect(wrapper.value).toEqual('1.2');
  });

  it('input decimal number with decimal step', () => {
    const wrapper = prepareWrapper('1.2', { step: 0.1 });
    expect(wrapper.value).toEqual('1.2');
  });

  it('input empty text and blur', () => {
    const wrapper = prepareWrapper('');
    expect(wrapper.value).toEqual('');
  });

  it('blur on default input', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber onChange={onChange} />);
    fireEvent.blur(container.querySelector('input'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('pressEnter works', () => {
    const onPressEnter = jest.fn();
    const { container } = render(<InputNumber onPressEnter={onPressEnter} defaultValue={'5'}/>);
    fireEvent.keyDown(container.querySelector('.rc-input-number'), { key: "Enter", keyCode: KeyCode.ENTER ,which:KeyCode.ENTER})
    expect(onPressEnter).toHaveBeenCalled();
    expect(onPressEnter).toHaveBeenCalledTimes(1);
  });

  it('pressEnter value should be ok', () => {
    const Demo = () => {
      const [value, setValue] = React.useState(1);
      const inputRef = React.useRef<HTMLInputElement>(null);
      return (
        <InputNumber
          ref={inputRef}
          value={value}
          onPressEnter={() => {
            setValue(Number(inputRef.current.value));
          }}
        />
      );
    };

    const { container } = render(<Demo />);
    const input = container.querySelector('input')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '3' } });
    fireEvent.keyDown(input,{ which: KeyCode.ENTER })
    expect(input.value).toEqual('3');
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.keyDown(input,{ which: KeyCode.ENTER })
    expect(input.value).toEqual('5');
  });

  it('keydown Tab, after change value should be ok', () => {
    let outSetValue;

    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(1);
      outSetValue = setValue;
      return <InputNumber autoFocus value={value} onChange={val => setValue(val)} />;
    };

    const { container } = render(<Demo />);
    const input = container.querySelector('input')
    fireEvent.keyDown(input,{ which: KeyCode.TAB })
    fireEvent.blur(input)
    expect(input.value).toEqual('1');
    outSetValue(5);
    fireEvent.focus(input)
    expect(input.value).toEqual('5');
  });

  describe('empty on blur should trigger null', () => {
    it('basic', () => {
      const onChange = jest.fn();
      const { container } = render(<InputNumber defaultValue="1" onChange={onChange} />);
      const input = container.querySelector('input')
      fireEvent.change(input, { target: { value: '' } });
      expect(onChange).toHaveBeenCalledWith(null);

      fireEvent.blur(input)
      expect(onChange).toHaveBeenLastCalledWith(null);
    });

    it('min range', () => {
      const onChange = jest.fn();
      const { container } = render(<InputNumber min="1" defaultValue="11" onChange={onChange} />);
      const input = container.querySelector('input')
      fireEvent.change(input, { target: { value: '' } });
      expect(onChange).toHaveBeenCalled();

      fireEvent.blur(input)
      expect(onChange).toHaveBeenLastCalledWith(null);
    });
  });
});
