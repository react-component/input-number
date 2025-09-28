/* eslint-disable react/no-unknown-property */
import * as React from 'react';
import { clsx } from 'clsx';
import raf from '@rc-component/util/lib/raf';
import SemanticContext from './SemanticContext';

/**
 * When click and hold on a button - the speed of auto changing the value.
 */
const STEP_INTERVAL = 200;

/**
 * When click and hold on a button - the delay before auto changing the value.
 */
const STEP_DELAY = 600;

export interface StepHandlerProps {
  prefixCls: string;
  upNode?: React.ReactNode;
  downNode?: React.ReactNode;
  upDisabled?: boolean;
  downDisabled?: boolean;
  onStep: (up: boolean, emitter: 'handler' | 'keyboard' | 'wheel') => void;
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
  const stepTimeoutRef = React.useRef<any>();
  const frameIds = React.useRef<number[]>([]);

  const onStepRef = React.useRef<StepHandlerProps['onStep']>();
  onStepRef.current = onStep;

  const { classNames, styles } = React.useContext(SemanticContext) || {};

  const onStopStep = () => {
    clearTimeout(stepTimeoutRef.current);
  };

  // We will interval update step when hold mouse down
  const onStepMouseDown = (e: React.MouseEvent, up: boolean) => {
    e.preventDefault();
    onStopStep();

    onStepRef.current(up, 'handler');

    // Loop step for interval
    function loopStep() {
      onStepRef.current(up, 'handler');

      stepTimeoutRef.current = setTimeout(loopStep, STEP_INTERVAL);
    }

    // First time press will wait some time to trigger loop step update
    stepTimeoutRef.current = setTimeout(loopStep, STEP_DELAY);
  };

  React.useEffect(
    () => () => {
      onStopStep();
      frameIds.current.forEach((id) => {
        raf.cancel(id);
      });
    },
    [],
  );

  // ======================= Render =======================
  const handlerClassName = `${prefixCls}-handler`;

  const upClassName = clsx(handlerClassName, `${handlerClassName}-up`, {
    [`${handlerClassName}-up-disabled`]: upDisabled,
  });
  const downClassName = clsx(handlerClassName, `${handlerClassName}-down`, {
    [`${handlerClassName}-down-disabled`]: downDisabled,
  });

  // fix: https://github.com/ant-design/ant-design/issues/43088
  // In Safari, When we fire onmousedown and onmouseup events in quick succession,
  // there may be a problem that the onmouseup events are executed first,
  // resulting in a disordered program execution.
  // So, we need to use requestAnimationFrame to ensure that the onmouseup event is executed after the onmousedown event.
  const safeOnStopStep = () => frameIds.current.push(raf(onStopStep));

  const sharedHandlerProps = {
    unselectable: 'on' as const,
    role: 'button',
    onMouseUp: safeOnStopStep,
    onMouseLeave: safeOnStopStep,
  };

  return (
    <div className={clsx(`${handlerClassName}-wrap`, classNames?.actions)} style={styles?.actions}>
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
