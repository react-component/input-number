import * as React from 'react';

/**
 * Work as `componentDidUpdate`
 */
export default function useUpdateEffect(callback: () => void | (() => void), condition: any[]) {
  const initRef = React.useRef(false);

  React.useLayoutEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      return undefined;
    }

    return callback();
  }, condition);
}
