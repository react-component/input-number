import type React from 'react';

type ISize = 'large' | 'middle' | 'small';

export type InputNumberProps = {
  focusOnUpDown: boolean;
  useTouch: boolean;
  prefixCls?: string;
  style: React.CSSProperties;
  className?: string;
  onKeyUp: (e, ...arg) => void;
  onKeyDown: (e, ...arg) => void;
  onMouseUp: (...arg) => void;
  onFocus: (...arg) => void;
  onBlur: (...arg) => void;
  required: boolean;
  autoComplete: string;
  autoFocus?: boolean;
  defaultValue?: number;
  disabled?: boolean;
  formatter?: (value: number | string | undefined) => string;
  max?: number;
  min?: number;
  parser?: (displayValue: string | undefined) => number | string;
  precision?: number;
  decimalSeparator?: string;
  size?: ISize;
  step?: number | string;
  value?: number;
  onChange?: (value: number | string | undefined) => void;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  id?: string;
  name?: string;
  placeholder?: string;
  title?: string;
  upHandler: React.ReactElement;
  downHandler: React.ReactElement;
  tabIndex?: number;
  [key: string]: any;
}

export type InputNumberState = {
  inputValue?: string;
  value?: number;
  focused?: boolean;
}
