import getMiniDecimal from '@rc-component/mini-decimal';

export function getDecupleSteps(step: string | number) {
  return getMiniDecimal(step).multi(10).toString();
}
