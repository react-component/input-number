export function noop() {
}

export function preventDefault(e) {
  e.preventDefault();
}

export function defaultParser(input) {
  return input.replace(/[^\w\.-]+/g, '');
}

export function getValidValue(value, min, max) {
  let val = parseFloat(value, 10);
  // https://github.com/ant-design/ant-design/issues/7358
  if (isNaN(val)) {
    return value;
  }
  if (val < min) {
    val = min;
  }
  if (val > max) {
    val = max;
  }
  return val;
}

// '1.' '1x' 'xx' '' => are not complete numbers
export function isNotCompleteNumber(num) {
  return (
    isNaN(num) ||
    num === '' ||
    num === null ||
    (num && num.toString().indexOf('.') === num.toString().length - 1)
  );
}

function getPrecision(value, precision) {
  if (!!precision) {
    return precision;
  }
  const valueString = value.toString();
  if (valueString.indexOf('e-') >= 0) {
    return parseInt(valueString.slice(valueString.indexOf('e-') + 2), 10);
  }
  let newPrecision = 0;
  if (valueString.indexOf('.') >= 0) {
    newPrecision = valueString.length - valueString.indexOf('.') - 1;
  }
  return newPrecision;
}

// step={1.0} value={1.51}
// press +
// then value should be 2.51, rather than 2.5
// if this.props.precision is undefined
// https://github.com/react-component/input-number/issues/39
export function getMaxPrecision({
  currentValue,
  ratio = 1,
  precision,
  step,
}) {
  if (!!precision) {
    return precision;
  }
  const ratioPrecision = getPrecision(ratio, precision);
  const stepPrecision = getPrecision(step, precision);
  const currentValuePrecision = getPrecision(currentValue, precision);
  if (!currentValue) {
    return ratioPrecision + stepPrecision;
  }
  return Math.max(currentValuePrecision, ratioPrecision + stepPrecision);
}

export function toPrecisionAsStep(num, step, precision) {
  if (isNotCompleteNumber(num) || num === '') {
    return num;
  }
  const newPrecision = Math.abs(getMaxPrecision({ currentValue: num, step, precision }));
  if (newPrecision === 0) {
    return num.toString();
  }
  if (!isNaN(newPrecision)) {
    return Number(num).toFixed(newPrecision);
  }
  return num.toString();
}
