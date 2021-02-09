import * as React from 'react';
import classNames from 'classnames';
import KeyCode from 'rc-util/lib/KeyCode';
import { composeRef } from 'rc-util/lib/ref';
import MiniDecimal, { DecimalClass, ValueType } from './utils/MiniDecimal';
import StepHandler from './StepHandler';
import { num2str, trimNumber, validateNumber } from './utils/numberUtil';

const defaultParser = (value: ValueType = 0): number | string => value;

/**
 * We support `stringMode` which need handle correct type when user call in formatter
 */
const getDecimalValue = (stringMode: boolean, decimalValue: DecimalClass) => {
  if (stringMode || decimalValue.isEmpty()) {
    return decimalValue.toString();
  }

  return decimalValue.toNumber();
};

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
  keyboard?: boolean;

  /** Parse display value to validate number */
  parser?: (displayValue: string | undefined) => number | string;
  /** Transform `value` to display value show in input */
  formatter?: (value: number | string | undefined) => string;
  /** Syntactic sugar of `formatter`. Config precision of display. */
  precision?: number;

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
      readOnly,
      upNode,
      downNode,
      keyboard,

      stringMode,

      parser = defaultParser,
      formatter,
      precision,

      onChange,
      onInput,
      ...inputProps
    } = props;

    const inputClassName = `${prefixCls}-input`;

    const inputRef = React.useRef<HTMLInputElement>(null);

    const [focus, setFocus] = React.useState(false);

    // Input text value control
    const [inputValue, setInputValue] = React.useState('');

    // Real value control
    const [decimalValue, setDecimalValue] = React.useState<DecimalClass>(null);

    // >>> Max & Min limit
    const maxDecimal = React.useMemo(() => (max ? new MiniDecimal(max) : null), [max]);
    const minDecimal = React.useMemo(() => (max ? new MiniDecimal(min) : null), [min]);

    const upDisabled = React.useMemo(() => {
      if (max === undefined || !decimalValue) {
        return false;
      }

      return maxDecimal.lessEquals(decimalValue);
    }, [maxDecimal, decimalValue]);

    const downDisabled = React.useMemo(() => {
      if (min === undefined || !decimalValue) {
        return false;
      }

      return decimalValue.lessEquals(minDecimal);
    }, [minDecimal, decimalValue]);

    // ============================= Data =============================
    /**
     * Find target value closet within range.
     * e.g. [11, 28]:
     *    3  => 11
     *    23 => 23
     *    99 => 28
     */
    const getRangeValue = (target: DecimalClass) => {
      // target > max
      if (max && !target.lessEquals(maxDecimal)) {
        return maxDecimal;
      }

      // target < min
      if (min && !minDecimal.lessEquals(target)) {
        return minDecimal;
      }

      return null;
    };

    /**
     * Check value is in [min, max] range
     */
    const isInRange = (target: DecimalClass) => !getRangeValue(target);

    const triggerValueUpdate = (newValue: DecimalClass) => {
      let updateValue = newValue;

      if (isInRange(updateValue) && !readOnly && !disabled) {
        if (precision >= 0) {
          const { negativeStr, integerStr, decimalStr } = trimNumber(updateValue.toString());
          updateValue = new MiniDecimal(
            `${negativeStr}${integerStr}.${decimalStr.padEnd(precision, '0').slice(0, precision)}0`,
          );
        }

        // Trigger event
        if (!updateValue.equals(decimalValue)) {
          setDecimalValue(updateValue);
          onChange?.(getDecimalValue(stringMode, updateValue));
        }
      }
    };

    // ====================== Parser & Formatter ======================
    const mergedFormatter = React.useCallback(
      (number: number | string) => {
        if (formatter) {
          return formatter(number);
        }

        let str = typeof number === 'number' ? num2str(number) : number;

        if (precision >= 0 && validateNumber(str)) {
          const { negativeStr, integerStr, decimalStr } = trimNumber(str);
          const precisionDecimalStr =
            precision > 0 ? `.${decimalStr.padEnd(precision, '0').slice(0, precision)}` : '';
          str = `${negativeStr}${integerStr}${precisionDecimalStr}`;
        }

        return str;
      },
      [formatter, precision],
    );

    // ============================ Events ============================
    const userTypingRef = React.useRef(false);

    // >>> Input
    const onInternalInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const inputStr = e.target.value;

      setInputValue(inputStr);

      // Parse number
      const finalValue = parser(inputStr);
      const finalDecimal = new MiniDecimal(finalValue);
      if (!finalDecimal.isNaN() && !finalDecimal.isEmpty()) {
        triggerValueUpdate(finalDecimal);
      }

      // Trigger onInput later to let user customize value if they want do handle something after onChange
      onInput?.(inputStr);
    };

    // >>> Steps
    const onStep = (up: boolean) => {
      let stepDecimal = new MiniDecimal(step);
      if (!up) {
        stepDecimal = stepDecimal.negate();
      }
      const target = decimalValue.add(stepDecimal.toString());

      const rangeValue = getRangeValue(target) || target;

      triggerValueUpdate(rangeValue);

      inputRef.current?.focus();
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
      userTypingRef.current = true;

      if (keyboard === false) {
        return;
      }

      // Do step
      const { which } = event;

      if ([KeyCode.UP, KeyCode.DOWN].includes(which)) {
        onStep(KeyCode.UP === which);
        event.preventDefault();
      }
    };

    const onKeyUp = () => {
      userTypingRef.current = false;
    };

    // >>> Focus & Blur
    const onBlur = () => {
      const parsedValue = new MiniDecimal(parser(inputValue));
      let formatValue: DecimalClass = parsedValue;

      if (!parsedValue.isNaN()) {
        // Revert value in range if needed
        const rangedValue = getRangeValue(parsedValue) || parsedValue;
        triggerValueUpdate(rangedValue);
      } else {
        formatValue = decimalValue;
      }

      // Reset input back since no validate value
      setInputValue(mergedFormatter(getDecimalValue(stringMode, formatValue)));

      setFocus(false);
    };

    // ============================ Effect ============================
    // Controlled
    React.useEffect(() => {
      if (defaultValue !== undefined) {
        setDecimalValue(new MiniDecimal(defaultValue));
      }
    }, []);

    React.useEffect(() => {
      setDecimalValue(new MiniDecimal(value));
    }, [value]);

    // Format to inputValue
    React.useEffect(() => {
      if (decimalValue && !userTypingRef.current) {
        setInputValue(mergedFormatter(getDecimalValue(stringMode, decimalValue)));
      }
    }, [decimalValue && decimalValue.toString(), stringMode]);

    // ============================ Render ============================
    return (
      <div
        className={classNames(prefixCls, className, {
          [`${prefixCls}-focused`]: focus,
          [`${prefixCls}-disabled`]: disabled,
        })}
        style={style}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      >
        <StepHandler
          prefixCls={prefixCls}
          upNode={upNode}
          downNode={downNode}
          upDisabled={upDisabled}
          downDisabled={downDisabled}
          onStep={onStep}
        />
        <div className={`${inputClassName}-wrap`}>
          <input
            {...inputProps}
            ref={composeRef(inputRef, ref)}
            role="spinbutton"
            aria-valuemin={min}
            aria-valuemax={max}
            className={inputClassName}
            autoComplete="off"
            value={inputValue}
            onChange={onInternalInput}
            disabled={disabled}
            readOnly={readOnly}
          />
        </div>
      </div>
    );
  },
);

InputNumber.displayName = 'InputNumber';

export default InputNumber;
