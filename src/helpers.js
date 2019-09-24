export const getClasses = (prefixCls, suffix = '') => {
  const prefixClasses = prefixCls.split(/\s+/);
  return prefixClasses.map((cls) => `${cls}${suffix}`);
};

export const getClassString = (prefixCls, suffix) => getClasses(prefixCls, suffix).join(' ');
