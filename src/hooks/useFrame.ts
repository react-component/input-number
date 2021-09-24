import { useRef, useEffect } from 'react';
import raf from 'rc-util/lib/raf';

/**
 * Always trigger latest once when call multiple time
 */
export default () => {
  const idRef = useRef(0);

  const cleanUp = () => {
    raf.cancel(idRef.current);
  };

  useEffect(() => cleanUp, []);

  return (callback: () => void) => {
    cleanUp();

    idRef.current = raf(() => {
      callback();
    });
  };
};
