import { trimNumber, num2str } from '@rc-component/mini-decimal';

export function getDecupleSteps(step: string | number) {
  // Normalize to a plain decimal string first (`1e-7` -> `0.0000001`),
  // so the digit shifting below always means multiply by 10.
  let stepStr = typeof step === 'number' ? num2str(step) : trimNumber(step).fullStr;
  if (/e/i.test(stepStr)) {
    stepStr = num2str(Number(stepStr));
  }
  const hasPoint = stepStr.includes('.');
  if (!hasPoint) {
    return trimNumber(`${stepStr}0`).fullStr;
  }
  return trimNumber(stepStr.replace(/(\d)\.(\d)/g, '$1$2.')).fullStr;
}
