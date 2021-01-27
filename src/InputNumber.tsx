/* eslint-disable react/prop-types */
import React from 'react';
import classNames from 'classnames';
import KeyCode from 'rc-util/lib/KeyCode';
import type { InputNumberProps, InputNumberState } from './interface';

function noop() {}

function preventDefault(e) {
  e.preventDefault();
}

const defaultParser = (input: string) => {
  return input.replace(/[^\w.-]+/g, '');
};

/**
 * When click and hold on a button - the speed of auto changin the value.
 */
const SPEED = 200;

/**
 * When click and hold on a button - the delay before auto changin the value.
 */
const DELAY = 600;

/**
 * Max Safe Integer -- on IE this is not available, so manually set the number in that case.
 * The reason this is used, instead of Infinity is because numbers above the MSI are unstable
 */
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 2 ** 53 - 1;

const isValidProps = value => value !== undefined && value !== null;

const isEqual = (oldValue, newValue) =>
  newValue === oldValue ||
  (typeof newValue === 'number' &&
    typeof oldValue === 'number' &&
    isNaN(newValue) &&
    isNaN(oldValue));

class InputNumber extends React.Component<Partial<InputNumberProps>, InputNumberState> {
  static defaultProps = {
    focusOnUpDown: true,
    useTouch: false,
    prefixCls: 'rc-input-number',
    max: MAX_SAFE_INTEGER,
    min: -MAX_SAFE_INTEGER,
    step: 1,
    style: {},
    onChange: noop,
    onKeyDown: noop,
    onPressEnter: noop,
    onFocus: noop,
    onBlur: noop,
    parser: defaultParser,
    required: false,
    autoComplete: 'off',
  };

  pressingUpOrDown: boolean;

  inputting: boolean;

  rawInput;

  cursorStart: number;

  cursorAfter: number | string;

  input: HTMLInputElement;

  lastKeyCode;

  currentValue: number | string;

  cursorEnd: number;

  cursorBefore: string;

  autoStepTimer: NodeJS.Timer;

  constructor(props: InputNumberProps) {
    super(props);
    let { value } = props;
    if (value === undefined) {
      value = props.defaultValue;
    }
    this.state = {
      focused: props.autoFocus,
    };
    const validValue = this.getValidValue(this.toNumber(value));
    this.state = {
      ...this.state,
      inputValue: this.toPrecisionAsStep(validValue),
      value: validValue,
    };
  }

  componentDidMount() {
    this.componentDidUpdate(null);
  }

  componentDidUpdate(prevProps) {
    const { value, onChange, max, min } = this.props;
    const { focused } = this.state;

    // Don't trigger in componentDidMount
    if (prevProps) {
      if (
        !isEqual(prevProps.value, value) ||
        !isEqual(prevProps.max, max) ||
        !isEqual(prevProps.min, min)
      ) {
        const validValue = focused ? value : this.getValidValue(value);
        let nextInputValue;
        if (this.pressingUpOrDown) {
          nextInputValue = validValue;
        } else if (this.inputting) {
          nextInputValue = this.rawInput;
        } else {
          nextInputValue = this.toPrecisionAsStep(validValue);
        }
        this.setState({
          // eslint-disable-line
          value: validValue,
          inputValue: nextInputValue,
        });
      }

      // Trigger onChange when max or min change
      // https://github.com/ant-design/ant-design/issues/11574
      const nextValue = 'value' in this.props ? value : this.state.value;
      // ref: null < 20 === true
      // https://github.com/ant-design/ant-design/issues/14277
      if (
        'max' in this.props &&
        prevProps.max !== max &&
        typeof nextValue === 'number' &&
        nextValue > max &&
        onChange
      ) {
        onChange(max);
      }
      if (
        'min' in this.props &&
        prevProps.min !== min &&
        typeof nextValue === 'number' &&
        nextValue < min &&
        onChange
      ) {
        onChange(min);
      }
    }

    // Restore cursor
    try {
      // Firefox set the input cursor after it get focused.
      // This caused that if an input didn't init with the selection,
      // set will cause cursor not correct when first focus.
      // Safari will focus input if set selection. We need skip this.
      if (this.cursorStart !== undefined && this.state.focused) {
        // In most cases, the string after cursor is stable.
        // We can move the cursor before it

        if (
          // If not match full str, try to match part of str
          !this.partRestoreByAfter(this.cursorAfter) &&
          this.state.value !== this.props.value
        ) {
          // If not match any of then, let's just keep the position
          // TODO: Logic should not reach here, need check if happens
          let pos = this.getInputDisplayValue(this.state).length;

          // If not have last string, just position to the end
          if (!this.cursorAfter) {
            pos = this.input.value.length;
          } else if (this.lastKeyCode === KeyCode.BACKSPACE) {
            pos = this.cursorStart - 1;
          } else if (this.lastKeyCode === KeyCode.DELETE) {
            pos = this.cursorStart;
          }
          this.fixCaret(pos, pos);
        } else if (this.currentValue === this.input.value) {
          // Handle some special key code
          switch (this.lastKeyCode) {
            case KeyCode.BACKSPACE:
              this.fixCaret(this.cursorStart - 1, this.cursorStart - 1);
              break;
            case KeyCode.DELETE:
              this.fixCaret(this.cursorStart + 1, this.cursorStart + 1);
              break;
            default:
            // Do nothing
          }
        }
      }
    } catch (e) {
      // Do nothing
    }

    // Reset last key
    this.lastKeyCode = null;

    // pressingUpOrDown is true means that someone just click up or down button
    if (!this.pressingUpOrDown) {
      return;
    }
    if (this.props.focusOnUpDown && this.state.focused) {
      if (document.activeElement !== this.input) {
        this.focus();
      }
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { onKeyDown, onPressEnter, keyboard } = this.props;

    const supportKeyCodes = [ KeyCode.UP, KeyCode.DOWN ];

    if (keyboard !== false && supportKeyCodes.includes(e.keyCode)) {
      // eslint-disable-next-line default-case
      switch(e.keyCode) {
        case KeyCode.UP: {
          const ratio = this.getRatio(e);
          this.up(e, ratio, null);
          this.stop();
          break;
        }
        case KeyCode.DOWN: {
          const ratio = this.getRatio(e);
          this.down(e, ratio, null);
          this.stop();
          break;
        }
      }
    }

    if (e.keyCode === KeyCode.ENTER) {
      onPressEnter?.(e);
    }

    // Trigger user key down
    this.recordCursorPosition();
    this.lastKeyCode = e.keyCode;
    onKeyDown?.(e);
  };

  onKeyUp = (e, ...args) => {
    const { onKeyUp } = this.props;

    this.stop();

    this.recordCursorPosition();

    // Trigger user key up
    if (onKeyUp) {
      onKeyUp(e, ...args);
    }
  };

  onChange = e => {
    const { onChange } = this.props;

    if (this.state.focused) {
      this.inputting = true;
    }
    this.rawInput = this.props.parser(this.getValueFromEvent(e));
    this.setState({ inputValue: this.rawInput });
    onChange(this.toNumber(this.rawInput)); // valid number or invalid string
  };

  onMouseUp = (...args) => {
    const { onMouseUp } = this.props;

    this.recordCursorPosition();

    if (onMouseUp) {
      onMouseUp(...args);
    }
  };

  onFocus = (...args) => {
    this.setState({
      focused: true,
    });
    this.props.onFocus(...args);
  };

  onBlur = (...args) => {
    const { onBlur } = this.props;
    this.inputting = false;
    this.setState({
      focused: false,
    });
    const value = this.getCurrentValidValue(this.state.inputValue);
    const newValue = this.setValue(value, noop);

    if (onBlur) {
      const originValue = this.input.value;
      const displayValue = this.getInputDisplayValue({ focus: false, value: newValue });
      this.input.value = displayValue;
      onBlur(...args);
      this.input.value = originValue;
    }
  };

  getCurrentValidValue(value) {
    let val = value;
    if (val === '') {
      val = '';
    } else if (!this.isNotCompleteNumber(parseFloat(val))) {
      val = this.getValidValue(val);
    } else {
      val = this.state.value;
    }
    return this.toNumber(val);
  }

  getRatio = e => {
    let ratio = 1;
    if (e.metaKey || e.ctrlKey) {
      ratio = 0.1;
    } else if (e.shiftKey) {
      ratio = 10;
    }
    return ratio;
  };

  getValueFromEvent(e) {
    // optimize for chinese input expierence
    // https://github.com/ant-design/ant-design/issues/8196
    let value = e.target.value.trim().replace(/。/g, '.');

    if (isValidProps(this.props.decimalSeparator)) {
      value = value.replace(this.props.decimalSeparator, '.');
    }

    return value;
  }

  getValidValue(value) {
    const { min, max } = this.props;
    let val = parseFloat(value);
    // https://github.com/ant-design/ant-design/issues/7358
    if (isNaN(val)) {
      return value;
    }
    if (val < min) {
      val = min;
    }
    if (val > max) {
      val = max;
    }
    return val;
  }

  setValue(v, callback) {
    // trigger onChange
    const { precision } = this.props;
    const newValue = this.isNotCompleteNumber(parseFloat(v)) ? null : parseFloat(v);
    const { value = null } = this.state;
    let { inputValue = null } = this.state;
    // https://github.com/ant-design/ant-design/issues/7363
    // https://github.com/ant-design/ant-design/issues/16622
    const newValueInString =
      typeof newValue === 'number' ? newValue.toFixed(precision) : `${newValue}`;
    const changed = newValue !== value || newValueInString !== `${inputValue}`;
    if (!('value' in this.props)) {
      this.setState(
        {
          value: newValue,
          inputValue: this.toPrecisionAsStep(v),
        },
        callback,
      );
    } else {
      // always set input value same as value
      inputValue = this.toPrecisionAsStep(this.state.value);
      this.setState(
        {
          inputValue,
        },
        callback,
      );
    }
    if (changed) {
      this.props.onChange(newValue);
    }

    return newValue;
  }

  getFullNum = num => {
    if (isNaN(num)) {
      return num;
    }
    if (!/e/i.test(String(num))) {
      return num;
    }
    return Number(num)
      .toFixed(18)
      .replace(/\.?0+$/, '');
  };

  getPrecision = value => {
    if (isValidProps(this.props.precision)) {
      return this.props.precision;
    }
    const valueString = String(value);
    if (valueString.indexOf('e-') >= 0) {
      return parseInt(valueString.slice(valueString.indexOf('e-') + 2), 10);
    }
    let precision = 0;
    if (valueString.indexOf('.') >= 0) {
      precision = valueString.length - valueString.indexOf('.') - 1;
    }
    return precision;
  };

  // step={1.0} value={1.51}
  // press +
  // then value should be 2.51, rather than 2.5
  // if this.props.precision is undefined
  // https://github.com/react-component/input-number/issues/39
  getMaxPrecision(currentValue, ratio = 1) {
    const { precision, step } = this.props;
    if (isValidProps(precision)) {
      return precision;
    }
    const ratioPrecision = this.getPrecision(ratio);
    const stepPrecision = this.getPrecision(step);
    const currentValuePrecision = this.getPrecision(currentValue);
    if (!currentValue) {
      return ratioPrecision + stepPrecision;
    }
    return Math.max(currentValuePrecision, ratioPrecision + stepPrecision);
  }

  getPrecisionFactor(currentValue, ratio = 1) {
    const precision = this.getMaxPrecision(currentValue, ratio);
    return 10 ** precision;
  }

  getInputDisplayValue = state => {
    const { focused, inputValue, value } = state || this.state;
    let inputDisplayValue;
    if (focused) {
      inputDisplayValue = inputValue;
    } else {
      inputDisplayValue = this.toPrecisionAsStep(value);
    }

    if (inputDisplayValue === undefined || inputDisplayValue === null) {
      inputDisplayValue = '';
    }

    let inputDisplayValueFormat = this.formatWrapper(inputDisplayValue);
    if (isValidProps(this.props.decimalSeparator)) {
      inputDisplayValueFormat = inputDisplayValueFormat
        .toString()
        .replace('.', this.props.decimalSeparator);
    }

    return inputDisplayValueFormat;
  };

  recordCursorPosition = () => {
    // Record position
    try {
      this.cursorStart = this.input.selectionStart;
      this.cursorEnd = this.input.selectionEnd;
      this.currentValue = this.input.value;
      this.cursorBefore = this.input.value.substring(0, this.cursorStart);
      this.cursorAfter = this.input.value.substring(this.cursorEnd);
    } catch (e) {
      // Fix error in Chrome:
      // Failed to read the 'selectionStart' property from 'HTMLInputElement'
      // http://stackoverflow.com/q/21177489/3040605
    }
  };

  restoreByAfter = str => {
    if (str === undefined) return false;

    const fullStr = this.input.value;
    const index = fullStr.lastIndexOf(str);

    if (index === -1) return false;

    const prevCursorPos = this.cursorBefore.length;
    if (
      this.lastKeyCode === KeyCode.DELETE &&
      this.cursorBefore.charAt(prevCursorPos - 1) === str[0]
    ) {
      this.fixCaret(prevCursorPos, prevCursorPos);
      return true;
    }

    if (index + str.length === fullStr.length) {
      this.fixCaret(index, index);

      return true;
    }
    return false;
  };

  partRestoreByAfter = str => {
    if (str === undefined) return false;

    // For loop from full str to the str with last char to map. e.g. 123
    // -> 123
    // -> 23
    // -> 3
    return Array.prototype.some.call(str, (_, start) => {
      const partStr = str.substring(start);

      return this.restoreByAfter(partStr);
    });
  };

  focus() {
    this.input.focus();
    this.recordCursorPosition();
  }

  blur() {
    this.input.blur();
  }

  select() {
    this.input.select();
  }

  formatWrapper(num) {
    // http://2ality.com/2012/03/signedzero.html
    // https://github.com/ant-design/ant-design/issues/9439
    if (this.props.formatter) {
      return this.props.formatter(num);
    }
    return num;
  }

  toPrecisionAsStep(num) {
    if (this.isNotCompleteNumber(num) || num === '') {
      return num;
    }
    const precision = Math.abs(this.getMaxPrecision(num));
    if (!isNaN(precision)) {
      return Number(num).toFixed(precision);
    }
    return num.toString();
  }

  // '1.' '1x' 'xx' '' => are not complete numbers
  isNotCompleteNumber = num => {
    return (
      isNaN(num) ||
      num === '' ||
      num === null ||
      (num && num.toString().indexOf('.') === num.toString().length - 1)
    );
  };

  toNumber(num) {
    const { precision } = this.props;
    const { focused } = this.state;
    // num.length > 16 => This is to prevent input of large numbers
    const numberIsTooLarge = num && num.length > 16 && focused;
    if (this.isNotCompleteNumber(num) || numberIsTooLarge) {
      return num;
    }
    if (isValidProps(precision)) {
      return Math.round(num * 10 ** precision) / 10 ** precision;
    }
    return Number(num);
  }

  upStep(val, rat) {
    const { step } = this.props;
    const precisionFactor = this.getPrecisionFactor(val, rat);
    const precision = Math.abs(this.getMaxPrecision(val, rat));
    const result = (
      (precisionFactor * val + precisionFactor * (Number(step)) * rat) /
      precisionFactor
    ).toFixed(precision);
    return this.toNumber(result);
  }

  downStep(val, rat) {
    const { step } = this.props;
    const precisionFactor = this.getPrecisionFactor(val, rat);
    const precision = Math.abs(this.getMaxPrecision(val, rat));
    const result = (
      (precisionFactor * val - precisionFactor * (Number(step)) * rat) /
      precisionFactor
    ).toFixed(precision);
    return this.toNumber(result);
  }

  step(type, e, ratio = 1, recursive) {
    this.stop();
    this.recordCursorPosition();
    if (e) {
      e.persist();
      e.preventDefault();
    }
    const { props } = this;
    if (props.disabled) {
      return;
    }
    const value = this.getCurrentValidValue(this.state.inputValue) || 0;
    if (this.isNotCompleteNumber(value)) {
      return;
    }
    let val = this[`${type}Step`](value, ratio);
    const outOfRange = val > props.max || val < props.min;
    if (val > props.max) {
      val = props.max;
    } else if (val < props.min) {
      val = props.min;
    }
    this.setValue(val, null);
    if (props.onStep) props.onStep(val, { offset: ratio, type });
    this.setState(
      {
        focused: true,
      },
      () => {
        this.pressingUpOrDown = false;
      },
    );
    if (outOfRange) {
      return;
    }
    this.autoStepTimer = setTimeout(
      () => {
        this[type](e, ratio, true);
      },
      recursive ? SPEED : DELAY,
    );
  }

  stop = () => {
    if (this.autoStepTimer) {
      clearTimeout(this.autoStepTimer);
    }
  };

  down = (e, ratio, recursive) => {
    this.pressingUpOrDown = true;
    this.step('down', e, ratio, recursive);
  };

  up = (e, ratio, recursive) => {
    this.pressingUpOrDown = true;
    this.step('up', e, ratio, recursive);
  };

  saveInput = node => {
    this.input = node;
  };

  fixCaret(start, end) {
    if (start === undefined || end === undefined || !this.input || !this.input.value) {
      return;
    }

    try {
      const currentStart = this.input.selectionStart;
      const currentEnd = this.input.selectionEnd;

      if (start !== currentStart || end !== currentEnd) {
        this.input.setSelectionRange(start, end);
      }
    } catch (e) {
      // Fix error in Chrome:
      // Failed to read the 'selectionStart' property from 'HTMLInputElement'
      // http://stackoverflow.com/q/21177489/3040605
    }
  }

  render() {
    const {
      prefixCls,
      disabled,
      readOnly,
      useTouch,
      autoComplete,
      upHandler,
      downHandler,
      className,
      max,
      min,
      style,
      title,
      onMouseEnter,
      onMouseLeave,
      onMouseOver,
      onMouseOut,
      required,
      onClick,
      tabIndex,
      type,
      placeholder,
      id,
      inputMode,
      pattern,
      step,
      maxLength,
      autoFocus,
      name,
      onPaste,
      onInput,
      ...rest
    } = this.props;
    const { value, focused } = this.state;
    const classes = classNames(prefixCls, {
      [className]: !!className,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-focused`]: focused,
    });

    const dataOrAriaAttributeProps = {};
    Object.keys(rest).forEach(key => {
      if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role') {
        dataOrAriaAttributeProps[key] = rest[key];
      }
    });

    const editable = !readOnly && !disabled;

    // focus state, show input value
    // unfocus state, show valid value
    const inputDisplayValue = this.getInputDisplayValue(null);

    const upDisabled = (value || value === 0) && (isNaN(value) || Number(value) >= max);
    const downDisabled = (value || value === 0) && (isNaN(value) || Number(value) <= min);
    const isUpDisabled = upDisabled || disabled || readOnly;
    const isDownDisabled = downDisabled || disabled || readOnly;
    const upClassName = classNames(`${prefixCls}-handler`, `${prefixCls}-handler-up`, {
      [`${prefixCls}-handler-up-disabled`]: isUpDisabled,
    });
    const downClassName = classNames(`${prefixCls}-handler`, `${prefixCls}-handler-down`, {
      [`${prefixCls}-handler-down-disabled`]: isDownDisabled,
    });

    const upEvents: any = useTouch
      ? {
          onTouchStart: isUpDisabled ? noop : this.up,
          onTouchEnd: this.stop,
        }
      : {
          onMouseDown: isUpDisabled ? noop : this.up,
          onMouseUp: this.stop,
          onMouseLeave: this.stop,
        };
    const downEvents: any = useTouch
      ? {
          onTouchStart: isDownDisabled ? noop : this.down,
          onTouchEnd: this.stop,
        }
      : {
          onMouseDown: isDownDisabled ? noop : this.down,
          onMouseUp: this.stop,
          onMouseLeave: this.stop,
        };

    return (
      <div
        className={classes}
        style={style}
        title={title}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onFocus={() => null}
        onBlur={() => null}
      >
        <div className={`${prefixCls}-handler-wrap`}>
          <span
            unselectable="on"
            {...upEvents}
            role="button"
            aria-label="Increase Value"
            aria-disabled={isUpDisabled}
            className={upClassName}
          >
            {upHandler || (
              <span
                unselectable="on"
                className={`${prefixCls}-handler-up-inner`}
                onClick={preventDefault}
              />
            )}
          </span>
          <span
            unselectable="on"
            {...downEvents}
            role="button"
            aria-label="Decrease Value"
            aria-disabled={isDownDisabled}
            className={downClassName}
          >
            {downHandler || (
              <span
                unselectable="on"
                className={`${prefixCls}-handler-down-inner`}
                onClick={preventDefault}
              />
            )}
          </span>
        </div>
        <div className={`${prefixCls}-input-wrap`}>
          <input
            role="spinbutton"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            required={required}
            type={type}
            placeholder={placeholder}
            onPaste={onPaste}
            onClick={onClick}
            onMouseUp={this.onMouseUp}
            className={`${prefixCls}-input`}
            tabIndex={tabIndex}
            autoComplete={autoComplete}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyDown={editable ? this.onKeyDown : noop}
            onKeyUp={editable ? this.onKeyUp : noop}
            autoFocus={autoFocus}
            maxLength={maxLength}
            readOnly={readOnly}
            disabled={disabled}
            max={max}
            min={min}
            step={step}
            name={name}
            title={title}
            id={id}
            onChange={this.onChange}
            ref={this.saveInput}
            value={this.getFullNum(inputDisplayValue)}
            pattern={pattern}
            inputMode={inputMode}
            onInput={onInput}
            {...dataOrAriaAttributeProps}
          />
        </div>
      </div>
    );
  }
}

export default InputNumber;
