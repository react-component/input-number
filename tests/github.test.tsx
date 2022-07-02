import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, screen, waitFor } from './util/wrapper';
import InputNumber from '../src';
import KeyCode from 'rc-util/lib/KeyCode';

// Github issues
describe('InputNumber.Github', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  // https://github.com/react-component/input-number/issues/32
  it('issue 32', () => {
    const { container } = render(<InputNumber step={0.1} />);
    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '2' } });
    expect(input.value).toEqual('2');

    fireEvent.blur(input);
    expect(input.value).toEqual('2.0');
  });

  // https://github.com/react-component/input-number/issues/197
  it('issue 197', () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(NaN);

      return (
        <InputNumber
          step={1}
          value={value}
          onChange={newValue => {
            setValue(newValue);
          }}
        />
      );
    };
    const { container } = render(<Demo />);
    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'foo' } });
  });

  // https://github.com/react-component/input-number/issues/222
  it('issue 222', () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(1);

      return (
        <InputNumber
          step={1}
          max={NaN}
          value={value}
          onChange={newValue => {
            setValue(newValue);
          }}
        />
      );
    };
    const { container } = render(<Demo />);
    const input = container.querySelector('input');
    fireEvent.focus(input);

    fireEvent.change(input, { target: { value: 'foo' } });
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));

    expect(input.value).toEqual('2');
  });

  // https://github.com/react-component/input-number/issues/35
  it('issue 35', () => {
    let num: string | number;

    const { container } = render(
      <InputNumber
        step={0.01}
        defaultValue={2}
        onChange={value => {
          num = value;
        }}
      />,
    );

    for (let i = 1; i <= 400; i += 1) {
      fireEvent.keyDown(container.querySelector('input'), {
        key: 'ArrowDown',
        keyCode: KeyCode.DOWN,
        which: KeyCode.DOWN,
      });
      const input = container.querySelector('input');
      // no number like 1.5499999999999999
      expect((num.toString().split('.')[1] || '').length < 3).toBeTruthy();
      const expectedValue = Number(((200 - i) / 100).toFixed(2));
      expect(input.value).toEqual(String(expectedValue.toFixed(2)));
      expect(num).toEqual(expectedValue);
    }

    for (let i = 1; i <= 300; i += 1) {
      fireEvent.keyDown(container.querySelector('input'), {
        key: 'ArrowUp',
        keyCode: KeyCode.UP,
        which: KeyCode.UP,
        code: 'ArrowUp',
      });
      const input = container.querySelector('input');
      // no number like 1.5499999999999999
      expect((num.toString().split('.')[1] || '').length < 3).toBeTruthy();
      const expectedValue = Number(((i - 200) / 100).toFixed(2));
      expect(input.value).toEqual(String(expectedValue.toFixed(2)));
      expect(num).toEqual(expectedValue);
    }
  });

  // https://github.com/ant-design/ant-design/issues/4229
  it('long press not trigger onChange in uncontrolled component', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber defaultValue={0} onChange={onChange} />);
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(onChange).toHaveBeenCalledWith(1);

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  // https://github.com/ant-design/ant-design/issues/4757
  it('should allow to input text like "1."', () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(1.1);
      return (
        <InputNumber
          value={value}
          onChange={newValue => {
            setValue(newValue);
          }}
        />
      );
    };

    const { container } = render(<Demo />);

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { which: KeyCode.ONE });
    fireEvent.keyDown(input, { which: KeyCode.PERIOD });
    fireEvent.change(input, { target: { value: '1.' } });
    expect(input.value).toEqual('1.');

    fireEvent.blur(input);
    expect(input.value).toEqual('1');
  });

  // https://github.com/ant-design/ant-design/issues/5012
  // https://github.com/react-component/input-number/issues/64
  it('controller InputNumber should be able to input number like 1.00* and 1.10*', () => {
    let num;

    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(2);

      return (
        <InputNumber
          value={value}
          onChange={newValue => {
            num = newValue;
            setValue(newValue);
          }}
        />
      );
    };

    const { container, rerender } = render(<Demo />);

    const input = container.querySelector('input');
    fireEvent.focus(input);
    // keydown => 6.0
    fireEvent.keyDown(input, { keyCode: KeyCode.SIX });
    fireEvent.keyDown(input, { which: KeyCode.PERIOD });
    fireEvent.keyDown(input, { which: KeyCode.ZERO });
    fireEvent.change(input, { target: { value: '6.0' } });
    expect(input.value).toEqual('6.0');
    expect(num).toEqual(6);

    fireEvent.blur(input);
    expect(input.value).toEqual('6');
    expect(num).toEqual(6);

    rerender(<Demo />);
    fireEvent.focus(input);
    fireEvent.keyDown(input, { which: KeyCode.SIX });
    fireEvent.keyDown(input, { which: KeyCode.PERIOD });
    fireEvent.keyDown(input, { which: KeyCode.ONE });
    fireEvent.keyDown(input, { which: KeyCode.ZERO });
    fireEvent.change(input, { target: { value: '6.10' } });
    expect(input.value).toEqual('6.10');
    expect(num).toEqual(6.1);

    fireEvent.blur(input);
    expect(input.value).toEqual('6.1');
    expect(num).toEqual(6.1);
  });

  it('onChange should not be called when input is not changed', () => {
    const onChange = jest.fn();
    const onInput = jest.fn();

    const { container } = render(<InputNumber onChange={onChange} onInput={onInput} />);

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '1' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(1);
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledWith('1');

    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(1);

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onInput).toHaveBeenCalledTimes(2);
    expect(onInput).toHaveBeenCalledWith('');

    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onInput).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(null);

    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onInput).toHaveBeenCalledTimes(2);
  });

  // https://github.com/ant-design/ant-design/issues/5235
  it('input long number', () => {
    const { container } = render(<InputNumber />);
    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '111111111111111111111' } });
    expect(input.value).toEqual('111111111111111111111');
    fireEvent.change(input, { target: { value: '11111111111111111111111111111' } });
    expect(input.value).toEqual('11111111111111111111111111111');
  });

  // https://github.com/ant-design/ant-design/issues/7363
  it('uncontrolled input should trigger onChange always when blur it', () => {
    const onChange = jest.fn();
    const onInput = jest.fn();
    const { container } = render(
      <InputNumber min={1} max={10} onChange={onChange} onInput={onInput} />,
    );

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '123' } });
    expect(onChange).toHaveBeenCalledTimes(0);
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledWith('123');

    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(10);
    expect(onInput).toHaveBeenCalledTimes(1);

    // repeat it, it should works in same way
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '123' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(2);
    expect(onInput).toHaveBeenCalledWith('123');

    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(2);
  });

  // https://github.com/ant-design/ant-design/issues/30465
  it('not block user input with min & max', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber min={1900} onChange={onChange} />);

    const input = container.querySelector('input');
    fireEvent.focus(input);

    fireEvent.change(input, { target: { value: '2' } });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '20' } });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '200' } });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '2000' } });
    expect(onChange).toHaveBeenCalledWith(2000);
    onChange.mockRestore();

    fireEvent.change(input, { target: { value: '1' } });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(1900);
  });

  // https://github.com/ant-design/ant-design/issues/7867
  it('focus should not cut precision of input value', () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(2);
      return (
        <InputNumber
          value={value}
          step={0.1}
          onBlur={() => {
            setValue(2);
          }}
        />
      );
    };

    const { container } = render(<Demo />);

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(input.value).toEqual('2.0');

    fireEvent.focus(input);
    expect(input.value).toEqual('2.0');
  });

  // https://github.com/ant-design/ant-design/issues/7940
  it('should not format during input', () => {
    let num;
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>('');
      return (
        <InputNumber
          value={value}
          step={0.1}
          onChange={newValue => {
            setValue(newValue);
            num = newValue;
          }}
        />
      );
    };

    const { container } = render(<Demo />);

    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '1' } });

    fireEvent.blur(input);
    expect(input.value).toEqual('1.0');
    expect(num).toEqual(1);
  });

  // https://github.com/ant-design/ant-design/issues/8196
  it('Allow input 。', async () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber min={1} onChange={onChange} />);
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '8。1' } });
    fireEvent.blur(input);

    await waitFor(() => expect(input.value).toEqual('8.1'));
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(8.1));
  });

  // https://github.com/ant-design/ant-design/issues/25614
  it("focus value should be '' when clear the input", () => {
    let targetValue: string;

    const { container } = render(
      <InputNumber
        min={1}
        max={10}
        onBlur={e => {
          targetValue = e.target.value;
        }}
        value={1}
      />,
    );
    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(targetValue).toEqual('');
  });

  it('should set input value as formatted when blur', () => {
    let valueOnBlur: string;

    const { container } = render(
      <InputNumber
        onBlur={e => {
          valueOnBlur = e.target.value;
        }}
        formatter={value => `${Number(value) * 100}%`}
        value={1}
      />,
    );
    const input = container.querySelector('input');
    fireEvent.blur(input);
    expect(input.value).toEqual('100%');
    expect(valueOnBlur).toEqual('100%');
  });

  // https://github.com/ant-design/ant-design/issues/11574
  // Origin: should trigger onChange when max or min change
  it('warning UI when max or min change', () => {
    const onChange = jest.fn();
    const { container, rerender } = render(
      <InputNumber min={0} max={20} value={10} onChange={onChange} />,
    );
    const input = container.querySelector('input');
    expect(container.querySelector('.rc-input-number-out-of-range')).toBe(null);
    rerender(<InputNumber min={11} max={20} value={10} onChange={onChange} />);
    expect(input.value).toEqual('10');
    expect(container.querySelector('.rc-input-number-out-of-range')).toBeTruthy();
    expect(onChange).toHaveBeenCalledTimes(0);

    rerender(<InputNumber min={11} max={14} value={15} onChange={onChange} />);
    // wrapper.update();

    expect(input.value).toEqual('15');
    expect(container.querySelector('.rc-input-number-out-of-range')).toBeTruthy();
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  // https://github.com/react-component/input-number/issues/120
  it('should not reset value when parent re-render with the same `value` prop', () => {
    const Demo = () => {
      const [, forceUpdate] = React.useState({});

      return (
        <InputNumber
          value={40}
          onChange={() => {
            forceUpdate({});
          }}
        />
      );
    };

    const { container } = render(<Demo />);
    const input = container.querySelector('input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '401' } });

    // Demo re-render and the `value` prop is still 40, but the user input should be retained
    expect(input.value).toEqual('401');
  });

  // https://github.com/ant-design/ant-design/issues/16710
  it('should use correct precision when change it to 0', () => {
    const Demo = () => {
      const [precision, setPrecision] = React.useState(2);

      return (
        <div>
          <InputNumber
            onChange={(newPrecision: number) => {
              setPrecision(newPrecision);
            }}
            data-testid="first"
          />
          <InputNumber precision={precision} defaultValue={1.23} data-testid="last" />
        </div>
      );
    };

    render(<Demo />);
    fireEvent.change(screen.getByTestId('last'), { target: { value: '1.23' } });
    fireEvent.change(screen.getByTestId('first'), { target: { value: '0' } });

    expect(screen.getByTestId('last').value).toEqual('1');
  });

  // https://github.com/ant-design/ant-design/issues/30478
  it('-0 should input able', () => {
    const { container } = render(<InputNumber />);
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '-' } });
    fireEvent.change(input, { target: { value: '-0' } });
    expect(input.value).toEqual('-0');
  });

  // https://github.com/ant-design/ant-design/issues/32274
  it('global modify when typing', () => {
    const Demo = ({ value }: { value?: number }) => {
      const [val, setVal] = React.useState<string | number>(7);

      React.useEffect(() => {
        if (value) {
          setVal(value);
        }
      }, [value]);

      return <InputNumber value={val} onChange={setVal} />;
    };
    const { container, rerender } = render(<Demo />);
    const input = container.querySelector('input');
    // Click
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    expect(input.value).toEqual('8');

    // Keyboard change
    rerender(<Demo value={3} />);
    expect(input.value).toEqual('3');
  });
});
