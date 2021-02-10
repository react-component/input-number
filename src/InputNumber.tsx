import * as React from 'react';
import classNames from 'classnames';
import KeyCode from 'rc-util/lib/KeyCode';
import { composeRef } from 'rc-util/lib/ref';
import MiniDecimal, { DecimalClass } from './utils/MiniDecimal';
import StepHandler from './StepHandler';
import { num2str, trimNumber, validateNumber } from './utils/numberUtil';
import useCursor from './hooks/useCursor';
import useUpdateEffect from './hooks/useUpdateEffect';

/**
 * We support `stringMode` which need handle correct type when user call in onChange
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
  min?: number;
  max?: number;
  step?: number | string;
  tabIndex?: number;

  // Customize handler node
  upHandler?: React.ReactNode;
  downHandler?: React.ReactNode;
  keyboard?: boolean;

  /** Parse display value to validate number */
  parser?: (displayValue: string | undefined) => number | string;
  /** Transform `value` to display value show in input */
  formatter?: (value: string | undefined) => string;
  /** Syntactic sugar of `formatter`. Config precision of display. */
  precision?: number;
  /** Syntactic sugar of `formatter`. Config decimal separator of display. */
  decimalSeparator?: string;

  onInput?: (text: string) => void;
  onChange?: (value: number | string) => void;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;

  // focusOnUpDown: boolean;
  // useTouch: boolean;

  // size?: ISize;
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
      upHandler,
      downHandler,
      keyboard,

      stringMode,

      parser,
      formatter,
      precision,
      decimalSeparator,

      onChange,
      onInput,
      onPressEnter,

      ...inputProps
    } = props;

    const inputClassName = `${prefixCls}-input`;

    const inputRef = React.useRef<HTMLInputElement>(null);

    const [focus, setFocus] = React.useState(false);

    const userTypingRef = React.useRef(false);
    const compositionRef = React.useRef(false);

    // ====================== Parser & Formatter ======================
    // >>> Parser
    const mergedParser = React.useCallback(
      (num: string | number) => {
        const numStr = String(num);

        if (parser) {
          return parser(numStr);
        }

        let parsedStr = numStr;
        if (decimalSeparator) {
          parsedStr = parsedStr.replace(decimalSeparator, '.');
        }

        // [Legacy] We still support auto convert `$ 123,456` to `123456`
        return parsedStr.replace(/[^\w.-]+/g, '');
      },
      [parser, decimalSeparator],
    );

    // >>> Formatter
    const mergedFormatter = React.useCallback(
      (number: string) => {
        if (formatter) {
          return formatter(number);
        }

        let str = typeof number === 'number' ? num2str(number) : number;

        if (validateNumber(str) && (decimalSeparator || precision >= 0)) {
          // Separator
          const separatorStr = decimalSeparator || '.';

          // Precision
          const { negativeStr, integerStr, decimalStr } = trimNumber(str);
          let precisionDecimalStr = `${separatorStr}${decimalStr}`;

          if (precision >= 0) {
            precisionDecimalStr =
              precision > 0
                ? `${separatorStr}${decimalStr.padEnd(precision, '0').slice(0, precision)}`
                : '';
          }

          str = `${negativeStr}${integerStr}${precisionDecimalStr}`;
        }

        return str;
      },
      [formatter, precision, decimalSeparator],
    );

    // ====================== Value & InputValue ======================
    // Real value control
    const [decimalValue, setDecimalValue] = React.useState<DecimalClass>(
      () => new MiniDecimal(defaultValue),
    );

    /**
     * Input text value control
     *
     * User can not update input content directly. It update with follow rules by priority:
     *  1. `value` changed
     *  2. User typing
     *  3. Blur or Enter trigger revalidate
     */
    const [inputValue, setInternalInputValue] = React.useState<string | number>(() =>
      mergedFormatter(decimalValue.toString()),
    );

    // Should always be string
    function setInputValue(newValue: DecimalClass) {
      setInternalInputValue(mergedFormatter(newValue.toString()));
    }

    // >>> Max & Min limit
    const maxDecimal = React.useMemo(() => (max ? new MiniDecimal(max) : null), [max]);
    const minDecimal = React.useMemo(() => (min ? new MiniDecimal(min) : null), [min]);

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

    // Cursor controller
    const [recordCursor, restoreCursor] = useCursor(inputRef.current, focus);

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

        // Reformat input if value is not controlled
        if (value === undefined) {
          setInputValue(updateValue);
        }
      }
    };

    // ========================== User Input ==========================
    /**
     * Flush current input content to trigger value change & re-formatter input if needed
     */
    const flushInputValue = () => {
      const parsedValue = new MiniDecimal(mergedParser(inputValue));
      let formatValue: DecimalClass = parsedValue;

      if (!parsedValue.isNaN()) {
        // Revert value in range if needed
        const rangedValue = getRangeValue(parsedValue) || parsedValue;
        triggerValueUpdate(rangedValue);
      } else {
        formatValue = decimalValue;
      }

      // Reset input back since no validate value
      if (!formatValue.isNaN()) {
        setInputValue(formatValue);
      }
    };

    // >>> Collect input value
    const collectInputValue = (inputStr: string) => {
      recordCursor();

      // Update inputValue incase input can not parse as number
      setInternalInputValue(inputStr);

      // Parse number
      if (!compositionRef.current) {
        const finalValue = mergedParser(inputStr);
        const finalDecimal = new MiniDecimal(finalValue);
        if (!finalDecimal.isInvalidate()) {
          triggerValueUpdate(finalDecimal);
        }
      }
    };

    // >>> Composition
    const onCompositionStart = () => {
      compositionRef.current = true;
    };

    const onCompositionEnd = () => {
      compositionRef.current = false;

      collectInputValue(inputRef.current.value);
    };

    // >>> Input
    const onInternalInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const inputStr = e.target.value;

      collectInputValue(inputStr);

      // Trigger onInput later to let user customize value if they want do handle something after onChange
      onInput?.(inputStr);
    };

    // ============================= Step =============================
    // >>> Steps
    const onStep = (up: boolean) => {
      let stepDecimal = new MiniDecimal(step);
      if (!up) {
        stepDecimal = stepDecimal.negate();
      }
      const target = (decimalValue || new MiniDecimal(0)).add(stepDecimal.toString());

      const rangeValue = getRangeValue(target) || target;

      triggerValueUpdate(rangeValue);

      inputRef.current?.focus();
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
      const { which } = event;
      userTypingRef.current = true;

      if (which === KeyCode.ENTER) {
        flushInputValue();
        onPressEnter?.(event);
      }

      if (keyboard === false) {
        return;
      }

      // Do step
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
      flushInputValue();

      setFocus(false);
    };

    // ============================ Effect ============================
    // Controlled
    useUpdateEffect(() => {
      const newValue = new MiniDecimal(value);
      setDecimalValue(newValue);

      // Update value as effect
      setInputValue(newValue);
    }, [value]);

    React.useEffect(() => {
      if (formatter) {
        restoreCursor();
      }
    }, [inputValue]);

    // ============================ Render ============================
    return (
      <div
        className={classNames(prefixCls, className, {
          [`${prefixCls}-focused`]: focus,
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-readonly`]: readOnly,
          [`${prefixCls}-out-of-range`]:
            decimalValue && !decimalValue.isInvalidate() && !isInRange(decimalValue),
        })}
        style={style}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
      >
        <StepHandler
          prefixCls={prefixCls}
          upNode={upHandler}
          downNode={downHandler}
          upDisabled={upDisabled}
          downDisabled={downDisabled}
          onStep={onStep}
        />
        <div className={`${inputClassName}-wrap`}>
          <input
            autoComplete="off"
            {...inputProps}
            ref={composeRef(inputRef, ref)}
            role="spinbutton"
            aria-valuemin={min}
            aria-valuemax={max}
            className={inputClassName}
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
