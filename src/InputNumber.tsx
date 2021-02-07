import * as React from 'react';
import classNames from 'classnames';

export interface BasicInputNumberProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
  decimalSeparator?: string;
  min?: number;
  max?: number;
}

export interface NumberInputNumberProps extends BasicInputNumberProps {
  defaultValue?: number;
  value?: number;
}

export interface StringInputNumberProps extends BasicInputNumberProps {
  /** value will show as string */
  stringMode: true;

  defaultValue?: string;
  value?: string;
}

export type InputNumberProps = BasicInputNumberProps | StringInputNumberProps;

const InputNumber = React.forwardRef(
  (props: InputNumberProps, ref: React.Ref<HTMLInputElement>) => {
    const { prefixCls = 'rc-input-number', className, style, autoFocus, min, max } = props;

    return (
      <div className={classNames(prefixCls, className)} style={style}>
        <div className={`${prefixCls}-input-wrap`}>
          <input
            ref={ref}
            role="spinbutton"
            aria-valuemin={min}
            aria-valuemax={max}
            autoFocus={autoFocus}
          />
        </div>
      </div>
    );
  },
);

InputNumber.displayName = 'InputNumber';

export default InputNumber;
