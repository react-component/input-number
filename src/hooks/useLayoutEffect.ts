import * as React from 'react';

const isBrowser = typeof window !== 'undefined' && window.document && window.document.createElement;

export const useLayoutEffect = isBrowser ? React.useLayoutEffect : React.useEffect;
