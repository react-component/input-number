import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import InputNumber from '../src';

describe('InputNumber.Props', () => {

  it('max', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber max={10} onChange={onChange} />);
    for (let i = 0; i < 100; i += 1) {
      fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    }

    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0]).toEqual(10);

    expect(container.querySelector('input')).toHaveAttribute('aria-valuemax', '10');
    expect(container.querySelector('input')).toHaveAttribute('aria-valuenow', '10');
  });

  it('min', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber min={-10} onChange={onChange} />);
    for (let i = 0; i < 100; i += 1) {
      fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
    }

    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0]).toEqual(-10);

    expect(container.querySelector('input')).toHaveAttribute('aria-valuemin', '-10');
    expect(container.querySelector('input')).toHaveAttribute('aria-valuenow', '-10');
  });

  it('disabled', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber onChange={onChange} disabled />);
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
    expect(container.querySelector('.rc-input-number-disabled')).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('readOnly', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber onChange={onChange} readOnly />);
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
    fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
    fireEvent.keyDown(container.querySelector('input'), { which: KeyCode.UP });
    fireEvent.keyDown(container.querySelector('input'), { which: KeyCode.DOWN });
    expect(container.querySelector('.rc-input-number-readonly')).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('autofocus', (done) => {
    const onFocus = jest.fn();
    const { container } = render(<InputNumber autoFocus onFocus={onFocus} />);
    const input = container.querySelector('input');
    setTimeout(() => {
      expect(input).toHaveFocus();
      done();
    }, 500);

  });

  describe('step', () => {
    it('basic', () => {
      const onChange = jest.fn();

      const { container } = render(<InputNumber onChange={onChange} step={5} />);
      for (let i = 0; i < 3; i += 1) {
        fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
        expect(onChange).toHaveBeenCalledWith(-5 * (i + 1));
      }
      expect(container.querySelector('input')).toHaveAttribute('step', '5');
    });

    it('basic with pressing shift key', () => {
      const onChange = jest.fn();
      const { container } = render(<InputNumber onChange={onChange} step={5} />);

      for (let i = 0; i < 3; i += 1) {
        fireEvent.keyDown(container.querySelector('.rc-input-number-handler-down'), {
          shiftKey: true,
        });
        fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));

        expect(onChange).toHaveBeenCalledWith(-5 * (i + 1) * 10);
      }
    });

    it('stringMode', () => {
      const onChange = jest.fn();
      const { container } = render(
        <InputNumber
          stringMode
          onChange={onChange}
          step='0.000000001'
          defaultValue='0.000000001'
        />,
      );

      for (let i = 0; i < 11; i += 1) {
        fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
      }

      expect(onChange).toHaveBeenCalledWith('-0.00000001');
    });

    it('stringMode with pressing shift key', () => {
      const onChange = jest.fn();
      const { container } = render(
        <InputNumber
          stringMode
          onChange={onChange}
          step='0.0000000001' // 1e-10
          defaultValue='0.000000001' // 1e-9
        />,
      );

      for (let i = 0; i < 11; i += 1) {
        fireEvent.keyDown(container.querySelector('.rc-input-number-handler-down'), {
          shiftKey: true,
        });
        fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
      }

      expect(onChange).toHaveBeenCalledWith('-0.00000001'); // -1e-8
    });

    it('decimal', () => {
      const onChange = jest.fn();
      const { container } = render(
        <InputNumber onChange={onChange} step={0.1} defaultValue={0.9} />,
      );
      for (let i = 0; i < 3; i += 1) {
        fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
      }
      expect(onChange).toHaveBeenCalledWith(1.2);
    });

    it('decimal with pressing shift key', () => {
      const onChange = jest.fn();
      const { container } = render(
        <InputNumber onChange={onChange} step={0.1} defaultValue={0.9} />,
      );
      for (let i = 0; i < 3; i += 1) {
        fireEvent.keyDown(container.querySelector('input'), {
          shiftKey: true,
          which: KeyCode.UP,
          key: 'ArrowUp',
          code: 'ArrowUp',
          keyCode: KeyCode.UP,
        });
      }
      expect(onChange).toHaveBeenCalledWith(3.9);
    });
  });

  describe('controlled', () => {
    it('restore when blur input', () => {
      const { container } = render(<InputNumber value={9} />);
      const input = container.querySelector('input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '3' } });
      expect(input.value).toEqual('3');

      fireEvent.blur(input);
      expect(input.value).toEqual('9');
    });

    it('dynamic change value', () => {
      const { container, rerender } = render(<InputNumber value={9} />);
      const input = container.querySelector('input');
      rerender(<InputNumber value={3} />);
      expect(input.value).toEqual('3');
    });

    // Origin https://github.com/ant-design/ant-design/issues/7334
    // zombieJ: We should error this instead of auto change back to a normal value since it makes un-controlled
    it('show limited value when input is not focused', () => {
      const Demo = () => {
        const [value, setValue] = React.useState<string | number>(2);

        return (
          <div>
            <button
              type='button'
              onClick={() => {
                setValue('103aa');
              }}
            >
              change value
            </button>
            <InputNumber min={1} max={10} value={value} />
          </div>
        );
      };

      const { container } = render(<Demo />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('2');

      fireEvent.click(container.querySelector('button'));
      expect(input.value).toEqual('103aa');
      expect(container.querySelector('.rc-input-number-not-a-number')).toBeTruthy();
    });

    // https://github.com/ant-design/ant-design/issues/7358
    it('controlled component should accept undefined value', () => {
      const Demo = () => {
        const [value, setValue] = React.useState<string | number>(2);

        return (
          <div>
            <button
              type='button'
              onClick={() => {
                setValue(undefined);
              }}
            >
              change value
            </button>
            <InputNumber min={1} max={10} value={value} />
          </div>
        );
      };

      const { container } = render(<Demo />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('2');

      fireEvent.click(container.querySelector('button'));
      expect(input.value).toEqual('');
    });
  });

  describe('defaultValue', () => {
    it('default value should be empty', () => {
      const { container } = render(<InputNumber />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('');
    });

    it('default value should be empty when step is decimal', () => {
      const { container } = render(<InputNumber step={0.1} />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('');
    });

    it('default value should be 1', () => {
      const { container } = render(<InputNumber defaultValue={1} />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('1');
    });

    it('default value could be null', () => {
      const { container } = render(<InputNumber defaultValue={null} />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('');
    });

    it('warning when defaultValue higher than max', () => {
      const { container } = render(<InputNumber min={0} max={10} defaultValue={13} />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('13');
      expect(container.querySelector('.rc-input-number-out-of-range')).toBeTruthy();
    });

    it('warning when defaultValue lower than min', () => {
      const { container } = render(<InputNumber min={0} max={10} defaultValue={-1} />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('-1');
      expect(container.querySelector('.rc-input-number-out-of-range')).toBeTruthy();
    });

    it('default value can be a string greater than 16 characters', () => {
      const { container } = render(<InputNumber max={10} defaultValue='-3.637978807091713e-12' />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('-0.000000000003637978807091713');
    });

    it('invalidate defaultValue', () => {
      const { container } = render(<InputNumber defaultValue='light' />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('light');
    });
  });

  describe('value', () => {
    it('value shouldn\'t higher than max', () => {
      const { container } = render(<InputNumber min={0} max={10} value={13} />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('13');
      expect(container.querySelector('.rc-input-number-out-of-range')).toBeTruthy();
    });

    it('value shouldn\'t lower than min', () => {
      const { container } = render(<InputNumber min={0} max={10} value={-1} />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('-1');
      expect(container.querySelector('.rc-input-number-out-of-range')).toBeTruthy();
    });

    it('value can be a string greater than 16 characters', () => {
      const { container } = render(<InputNumber max={10} value='-3.637978807091713e-12' />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('-0.000000000003637978807091713');
    });

    it('value decimal over six decimal not be scientific notation', () => {
      const onChange = jest.fn();
      const { container } = render(
        <InputNumber precision={7} step={0.0000001} onChange={onChange} />,
      );
      const input = container.querySelector('input');
      for (let i = 1; i <= 9; i += 1) {
        fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-up'));
        expect(input.value).toEqual(`0.000000${i}`);
        expect(onChange).toHaveBeenCalledWith(0.0000001 * i);
      }

      for (let i = 8; i >= 1; i -= 1) {
        fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
        expect(input.value).toEqual(`0.000000${i}`);
        expect(onChange).toHaveBeenCalledWith(0.0000001 * i);
      }

      fireEvent.mouseDown(container.querySelector('.rc-input-number-handler-down'));
      expect(input.value).toEqual(`0.0000000`);
      expect(onChange).toHaveBeenCalledWith(0);
    });

    it('value can be changed when dynamic setting max', () => {
      const { container, rerender } = render(<InputNumber value={11} max={10} />);
      const input = container.querySelector('input');

      // Origin logic shows `10` as `max`. But it breaks form logic.
      expect(input.value).toEqual('11');
      expect(container.querySelector('.rc-input-number-out-of-range')).toBeTruthy();

      rerender(<InputNumber value={11} max={20} />);
      expect(input.value).toEqual('11');
      expect(container.querySelector('.rc-input-number-out-of-range')).toBeFalsy();
    });

    it('value can be changed when dynamic setting min', () => {
      const { container, rerender } = render(<InputNumber value={9} min={10} />);
      const input = container.querySelector('input');

      // Origin logic shows `10` as `max`. But it breaks form logic.
      expect(input.value).toEqual('9');
      expect(container.querySelector('.rc-input-number-out-of-range')).toBeTruthy();

      rerender(<InputNumber value={9} min={0} />);
      expect(input.value).toEqual('9');
      expect(container.querySelector('.rc-input-number-out-of-range')).toBeFalsy();
    });

    it('value can override given defaultValue', () => {
      const { container } = render(<InputNumber value={2} defaultValue={1} />);
      const input = container.querySelector('input');
      expect(input.value).toEqual('2');
    });
  });

  describe(`required prop`, () => {
    it(`should add required attr to the input tag when get passed as true`, () => {
      const { container } = render(<InputNumber required />);
      expect(container.querySelector('input')).toHaveAttribute('required');
    });

    it(`should not add required attr to the input as default props when not being supplied`, () => {
      const { container } = render(<InputNumber />);
      expect(container.querySelector('input')).not.toHaveAttribute('required');
    });

    it(`should not add required attr to the input tag when get passed as false`, () => {
      const { container } = render(<InputNumber required={false} />);
      expect(container.querySelector('input')).not.toHaveAttribute('required');
    });
  });

  describe('Pattern prop', () => {
    it(`should render with a pattern attribute if the pattern prop is supplied`, () => {
      const { container } = render(<InputNumber pattern='\d*' />);
      expect(container.querySelector('input')).toHaveAttribute('pattern', '\\d*');
    });

    it(`should render with no pattern attribute if the pattern prop is not supplied`, () => {
      const { container } = render(<InputNumber />);
      expect(container.querySelector('input')).not.toHaveAttribute('pattern', '\\d*');

    });
  });

  describe('onPaste props', () => {
    it('passes onPaste event handler', () => {
      const onPaste = jest.fn();
      const { container } = render(<InputNumber value={1} onPaste={onPaste} />);
      const input = container.querySelector('input');
      fireEvent.paste(input);
      // wrapper.findInput().simulate('paste');
      expect(onPaste).toHaveBeenCalled();
    });
  });

  describe('aria and data props', () => {
    it('passes data-* attributes', () => {
      const { container } = render(<InputNumber value={1} data-test='test-id' data-id='12345' />);
      const input = container.querySelector('input');

      expect(input).toHaveAttribute('data-test', 'test-id');
      expect(input).toHaveAttribute('data-id', '12345');
    });

    it('passes aria-* attributes', () => {
      const { container } = render(
        <InputNumber value={1} aria-labelledby='test-id' aria-label='some-label' />,
      );
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('aria-labelledby', 'test-id');
      expect(input).toHaveAttribute('aria-label', 'some-label');

    });

    it('passes role attribute', () => {
      const { container } = render(<InputNumber value={1} role='searchbox' />);
      expect(container.querySelector('input')).toHaveAttribute('role', 'searchbox');

    });
  });
});
