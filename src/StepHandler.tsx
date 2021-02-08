import * as React from 'react';
import classNames from 'classnames';

function preventDefault(e: React.SyntheticEvent) {
  e.preventDefault();
}

export interface StepHandlerProps {
  prefixCls: string;
  upNode?: React.ReactNode;
  downNode?: React.ReactNode;
  upDisabled?: boolean;
  downDisabled?: boolean;
  onStartStep: (up: boolean) => void;
  onStopStep: () => void;
}

export default function StepHandler({
  prefixCls,
  upNode,
  downNode,
  upDisabled,
  downDisabled,
  onStartStep,
  onStopStep,
}: StepHandlerProps) {
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
    onMouseMove: onStopStep,
    onMouseLeave: onStopStep,
  };

  return (
    <div className={`${handlerClassName}-wrap`}>
      <span
        {...sharedHandlerProps}
        onMouseDown={() => {
          onStartStep(true);
        }}
        aria-label="Increase Value"
        aria-disabled={upDisabled}
        className={upClassName}
      >
        {upNode || (
          <span
            unselectable="on"
            className={`${prefixCls}-handler-up-inner`}
            onClick={preventDefault}
          />
        )}
      </span>
      <span
        {...sharedHandlerProps}
        onMouseDown={() => {
          onStartStep(false);
        }}
        aria-label="Decrease Value"
        aria-disabled={downDisabled}
        className={downClassName}
      >
        {downNode || (
          <span
            unselectable="on"
            className={`${prefixCls}-handler-down-inner`}
            onClick={preventDefault}
          />
        )}
      </span>
    </div>
  );
}
