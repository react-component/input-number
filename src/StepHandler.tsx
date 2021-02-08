import * as React from 'react';
import classNames from 'classnames';

export interface StepHandlerProps {
  prefixCls: string;
  upNode?: React.ReactNode;
  downNode?: React.ReactNode;
  upDisabled?: boolean;
  downDisabled?: boolean;
  onStep: (up: boolean) => void;
}

export default function StepHandler({
  prefixCls,
  upNode,
  downNode,
  upDisabled,
  downDisabled,
  onStep,
}: StepHandlerProps) {
  // ======================== Step ========================
  const stepIntervalRef = React.useRef<number>();

  const onStepRef = React.useRef<StepHandlerProps['onStep']>();
  onStepRef.current = onStep;

  // We will interval update step when hold mouse down
  const onStepMouseDown = (e: React.MouseEvent, up: boolean) => {
    e.preventDefault();

    onStepRef.current(up);

    stepIntervalRef.current = setInterval(() => {
      onStepRef.current(up);
    }, 200) as any;
  };

  const onStopStep = () => {
    clearInterval(stepIntervalRef.current);
  };

  React.useEffect(() => onStopStep, []);

  // ======================= Render =======================
  const handlerClassName = `${prefixCls}-handler`;

  const upClassName = classNames(handlerClassName, `${handlerClassName}-up`, {
    [`${handlerClassName}-up-disabled`]: upDisabled,
  });
  const downClassName = classNames(handlerClassName, `${handlerClassName}-down`, {
    [`${handlerClassName}-down-disabled`]: downDisabled,
  });

  const sharedHandlerProps = {
    unselectable: 'on' as const,
    role: 'button',
    onMouseUp: onStopStep,
    onMouseLeave: onStopStep,
  };

  return (
    <div className={`${handlerClassName}-wrap`}>
      <span
        {...sharedHandlerProps}
        onMouseDown={(e) => {
          onStepMouseDown(e, true);
        }}
        aria-label="Increase Value"
        aria-disabled={upDisabled}
        className={upClassName}
      >
        {upNode || <span unselectable="on" className={`${prefixCls}-handler-up-inner`} />}
      </span>
      <span
        {...sharedHandlerProps}
        onMouseDown={(e) => {
          onStepMouseDown(e, false);
        }}
        aria-label="Decrease Value"
        aria-disabled={downDisabled}
        className={downClassName}
      >
        {downNode || <span unselectable="on" className={`${prefixCls}-handler-down-inner`} />}
      </span>
    </div>
  );
}
