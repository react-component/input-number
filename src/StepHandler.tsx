/* eslint-disable react/no-unknown-property */
import raf from '@rc-component/util/lib/raf';
import { clsx } from 'clsx';
import * as React from 'react';

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
  action: 'up' | 'down';
  children?: React.ReactNode;
  disabled?: boolean;
  onStep: (up: boolean, emitter: 'handler' | 'keyboard' | 'wheel') => void;
}

export default function StepHandler({
  prefixCls,
  action,
  children,
  disabled,
  onStep,
}: StepHandlerProps) {
  // ======================== MISC ========================
  const isUpAction = action === 'up';

  // ======================== Step ========================
  const stepTimeoutRef = React.useRef<any>();
  const frameIds = React.useRef<number[]>([]);

  const onStopStep = () => {
    clearTimeout(stepTimeoutRef.current);
  };

  // We will interval update step when hold mouse down
  const onStepMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onStopStep();

    onStep(isUpAction, 'handler');

    // Loop step for interval
    function loopStep() {
      onStep(isUpAction, 'handler');

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

  const className = clsx(handlerClassName, `${handlerClassName}-${action}`, {
    [`${handlerClassName}-${action}-disabled`]: disabled,
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
    <span
      {...sharedHandlerProps}
      onMouseDown={(e) => {
        onStepMouseDown(e);
      }}
      aria-label={isUpAction ? 'Increase Value' : 'Decrease Value'}
      aria-disabled={disabled}
      className={className}
    >
      {children || <span unselectable="on" className={`${prefixCls}-handler-${action}-inner`} />}
    </span>
  );
}
