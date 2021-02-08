import * as React from 'react';
import classNames from 'classnames';
import MiniDecimal, { DecimalClass, ValueType } from './utils/MiniDecimal';
import StepHandler from './StepHandler';

const defaultParser = (value: ValueType = 0): number | string => value;
const defaultFormatter = (value: ValueType) => String(value);

export interface InputNumberProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onInput' | 'onChange'
  > {
  /** value will show as string */
  stringMode?: boolean;

  defaultValue?: string | number;
  value?: string | number;

  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
  decimalSeparator?: string;
  min?: number;
  max?: number;
  tabIndex?: number;

  // Customize handler node
  upNode?: React.ReactNode;
  downNode?: React.ReactNode;

  /** Parse display value to validate number */
  parser?: (displayValue: string | undefined) => number | string;
  /** Transform `value` to display value show in input */
  formatter?: (value: number | string | undefined) => string;

  onInput?: (text: string) => void;
  onChange?: (value: number | string) => void;

  // focusOnUpDown: boolean;
  // useTouch: boolean;
  // onKeyUp: (e, ...arg) => void;
  // onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  // onMouseUp: (...arg) => void;
  // onFocus: (...arg) => void;
  // onBlur: (...arg) => void;
  // required: boolean;
  // autoComplete: string;
  // autoFocus?: boolean;
  // defaultValue?: number;
  // disabled?: boolean;
  // precision?: number;
  // decimalSeparator?: string;
  // size?: ISize;
  // step?: number | string;
  // value?: number;
  // onChange?: (value: number | string | undefined) => void;
  // onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  // id?: string;
  // name?: string;
  // placeholder?: string;
  // title?: string;
  // upHandler: React.ReactElement;
  // downHandler: React.ReactElement;
  // keyboard?: boolean;
}

const InputNumber = React.forwardRef(
  (props: InputNumberProps, ref: React.Ref<HTMLInputElement>) => {
    const {
      prefixCls = 'rc-input-number',
      className,
      style,
      min,
      max,
      step = 1,
      defaultValue,
      value,
      disabled,
      upNode,
      downNode,

      stringMode,

      parser = defaultParser,
      formatter = defaultFormatter,

      onChange,
      onInput,
      ...inputProps
    } = props;

    const inputClassName = `${prefixCls}-input`;

    // Input text value control
    const [inputValue, setInputValue] = React.useState('');

    // Real value control
    const [decimalValue, setDecimalValue] = React.useState<DecimalClass>(null);

    // Max & Min limit
    const upDisabled = React.useMemo(() => {
      if (max === undefined || !decimalValue) {
        return false;
      }

      const maxDecimal = new MiniDecimal(max);
      return maxDecimal.add(decimalValue.negate().toString()).toNumber() <= 0;
    }, [max, decimalValue]);

    const downDisabled = React.useMemo(() => {
      if (min === undefined || !decimalValue) {
        return false;
      }

      const minDecimal = new MiniDecimal(min);
      return decimalValue.add(minDecimal.negate().toString()).toNumber() <= 0;
    }, [min, decimalValue]);

    // ============================= Data =============================
    // Ref here in case interval update in closure
    const originValueRef = React.useRef<DecimalClass>();
    originValueRef.current = decimalValue;

    const triggerValueUpdate = (
      updateValue: DecimalClass | ((originValue: DecimalClass) => DecimalClass),
    ) => {
      const originValue = originValueRef.current;
      const newValue = typeof updateValue === 'function' ? updateValue(originValue) : originValue;

      setDecimalValue(newValue);

      // Trigger event
      onChange(stringMode ? newValue.toString() : newValue.toNumber());
    };

    // ============================ Events ============================
    const onInternalInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const inputStr = e.target.value;

      setInputValue(inputStr);

      // Parse number
      const finalValue = parser(inputStr);
      const finalDecimal = new MiniDecimal(finalValue);
      if (!finalDecimal.isNaN() && !finalDecimal.equals(decimalValue)) {
        triggerValueUpdate(finalDecimal);
      }

      // Trigger onInput later to let user customize value if they want do handle something after onChange
      onInput?.(inputStr);
    };

    // >>> Steps
    // Record in ref since its in closure
    const upDownDisabledRef = React.useRef<{ up?: boolean; down?: boolean }>({});
    upDownDisabledRef.current.up = upDisabled;
    upDownDisabledRef.current.down = downDisabled;

    // Interval update by stepF
    const stepIntervalRef = React.useRef<number>(null);
    const onStartStep = (up: boolean) => {
      let stepDecimal = new MiniDecimal(step);
      if (!up) {
        stepDecimal = stepDecimal.negate();
      }
      const stepValue = stepDecimal.toString();

      function updateStep() {
        if (up ? upDownDisabledRef.current.up : upDownDisabledRef.current.down) {
          return;
        }

        triggerValueUpdate((ori) => ori.add(stepValue));
      }

      // Trigger at once
      updateStep();

      // Interval update
      stepIntervalRef.current = setInterval(updateStep, 200) as any;
    };

    const onStopStep = () => {
      clearInterval(stepIntervalRef.current);
    };

    // ============================ Effect ============================
    // Controlled
    React.useEffect(() => {
      if (defaultValue !== undefined) {
        setDecimalValue(new MiniDecimal(defaultValue));
      }

      return onStopStep;
    }, []);

    React.useEffect(() => {
      setDecimalValue(new MiniDecimal(value));
    }, [value]);

    // Format to inputValue
    React.useEffect(() => {
      if (decimalValue) {
        const passFormatterValue = stringMode ? decimalValue.toString() : decimalValue.toNumber();

        setInputValue(formatter(passFormatterValue));
      }
    }, [decimalValue, stringMode]);

    // ============================ Render ============================
    return (
      <div
        className={classNames(prefixCls, className, {
          [`${prefixCls}-disabled`]: disabled,
        })}
        style={style}
      >
        <StepHandler
          prefixCls={prefixCls}
          upNode={upNode}
          downNode={downNode}
          upDisabled={upDisabled}
          downDisabled={downDisabled}
          onStartStep={onStartStep}
          onStopStep={onStopStep}
        />
        <div className={`${inputClassName}-wrap`}>
          <input
            {...inputProps}
            ref={ref}
            role="spinbutton"
            aria-valuemin={min}
            aria-valuemax={max}
            className={inputClassName}
            autoComplete="off"
            value={inputValue}
            onChange={onInternalInput}
            disabled={disabled}
          />
        </div>
      </div>
    );
  },
);

InputNumber.displayName = 'InputNumber';

export default InputNumber;
