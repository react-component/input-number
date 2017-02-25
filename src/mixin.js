function noop() {
}

/**
 * When click and hold on a button - the speed of auto changin the value.
 */
const SPEED = 200;

/**
 * When click and hold on a button - the delay before auto changin the value.
 */
const DELAY = 600;

export default {
  getDefaultProps() {
    return {
      max: Infinity,
      min: -Infinity,
      step: 1,
      style: {},
      defaultValue: '',
      onChange: noop,
      onKeyDown: noop,
      onFocus: noop,
      onBlur: noop,
    };
  },

  getInitialState() {
    let value;
    const props = this.props;
    if ('value' in props) {
      value = props.value;
    } else {
      value = props.defaultValue;
    }
    value = this.toNumber(value);
    return {
      inputValue: this.toPrecisionAsStep(value),
      value,
      focused: props.autoFocus,
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = this.toNumber(nextProps.value);
      this.setState({
        inputValue: nextProps.value,
        value,
      });
    }
  },

  componentWillUnmount() {
    this.stop();
  },

  onChange(e) {
    const input = this.getValueFromEvent(e).trim();
    this.setState({ inputValue: input });
    this.props.onChange(this.toNumber(input)); // valid number or invalid string
  },

  onFocus(...args) {
    this.setState({
      focused: true,
    });
    this.props.onFocus(...args);
  },

  onBlur(e, ...args) {
    this.setState({
      focused: false,
    });
    const value = this.getCurrentValidValue(this.getValueFromEvent(e).trim());
    this.setValue(value, () => {
      this.props.onBlur(e, ...args);
    });
  },

  getCurrentValidValue(value) {
    let val = value;
    const props = this.props;
    if (val === '') {
      val = '';
    } else if (!this.isNotCompleteNumber(val)) {
      val = Number(val);
      if (val < props.min) {
        val = props.min;
      }
      if (val > props.max) {
        val = props.max;
      }
    } else {
      val = this.state.value;
    }
    return this.toNumber(val);
  },

  setValue(v, callback) {
    // trigger onChange
    const newValue = this.isNotCompleteNumber(parseFloat(v, 10)) ? undefined : parseFloat(v, 10);
    const changed = newValue !== this.state.value;
    if (!('value' in this.props)) {
      this.setState({
        value: v,
        inputValue: this.toPrecisionAsStep(v),
      }, callback);
    } else {
      // always set input value same as value
      this.setState({
        inputValue: this.toPrecisionAsStep(this.state.value),
      }, callback);
    }
    if (changed) {
      this.props.onChange(newValue);
    }
  },

  getPrecision(value) {
    const valueString = value.toString();
    console.log('get precision:', value)
    if (valueString.indexOf('e-') >= 0) {
      return parseInt(valueString.slice(valueString.indexOf('e-') + 1), 10);
    }
    let precision = 0;
    if (valueString.indexOf('.') >= 0) {
      precision = valueString.length - valueString.indexOf('.') - 1;
    }
    return precision;
  },

  // step={1.0} value={1.51}
  // press +
  // then value should be 2.51, rather than 2.5
  // https://github.com/react-component/input-number/issues/39
  getMaxPrecision(currentValue, ratio = 1) {
    const { step } = this.props;
    const ratioPrecision = this.getPrecision(ratio);
    const stepPrecision = this.getPrecision(step);
    const currentValuePrecision = this.getPrecision(currentValue);
    console.log('max precision:', currentValue, stepPrecision, ratioPrecision, stepPrecision * ratioPrecision, currentValuePrecision);
    if (!currentValue) {
      return ratioPrecision * stepPrecision;
    }
    return Math.max(currentValuePrecision, ratioPrecision * stepPrecision);
  },

  getPrecisionFactor(currentValue, ratio = 1) {
    const precision = this.getMaxPrecision(currentValue, ratio);
    return Math.pow(10, precision);
  },

  toPrecisionAsStep(num) {
    if (this.isNotCompleteNumber(num) || num === '') {
      return num;
    }
    const precision = Math.abs(this.getMaxPrecision(num));
    if (precision) {
      return Number(num).toFixed(precision);
    }
    return num.toString();
  },

  // '1.' '1x' 'xx' ''  => are not complete numbers
  isNotCompleteNumber(num) {
    return (
      isNaN(num) ||
      num === '' ||
      num.toString().indexOf('.') === num.toString().length - 1
    );
  },

  toNumber(num) {
    if (this.isNotCompleteNumber(num)) {
      return 0; // Maybe 0 will be better for the invalid none-numbers
    }
    return Number(num);
  },

  upStep(val, rat) {
    const { step, min } = this.props;
    const precisionFactor = this.getPrecisionFactor(val, rat);
    const precision = Math.abs(this.getMaxPrecision(val, rat));
    let result;
    if (typeof val === 'number') {
      result =
        ((precisionFactor * val + precisionFactor * step * rat) / precisionFactor);//.toFixed(precision);
    } else {
      result = min === -Infinity ? step : min;
    }
    return this.toNumber(result);
  },

  downStep(val, rat) {
    const { step, min } = this.props;
    const precisionFactor = this.getPrecisionFactor(val, rat);
    const precision = Math.abs(this.getMaxPrecision(val, rat));
    console.log('precision:', val, rat, step, precisionFactor, precision)
    let result;
    if (typeof val === 'number') {
      result =
        ((precisionFactor * val - precisionFactor * step * rat) / precisionFactor).toFixed(precision);
    } else {
      result = min === -Infinity ? -step : min;
    }
    return this.toNumber(result);
  },

  step(type, e, ratio) {
    if (e) {
      e.preventDefault();
    }
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const value = this.getCurrentValidValue(this.state.inputValue);
    if (this.isNotCompleteNumber(value)) {
      return;
    }
    const val = this[`${type}Step`](value, ratio);
    if (val > props.max || val < props.min) {
      return;
    }
    this.setValue(val);
    this.setState({
      focused: true,
    });
  },

  stop() {
    if (this.autoStepTimer) {
      clearTimeout(this.autoStepTimer);
    }
  },

  down(e, ratio, recursive) {
    if (e.persist) {
      e.persist();
    }
    this.stop();
    this.step('down', e, (ratio) ? ratio : 1);
    this.autoStepTimer = setTimeout(() => {
      this.down(e, ratio, true);
    }, recursive ? SPEED : DELAY);
  },

  up(e, ratio, recursive) {
    if (e.persist) {
      e.persist();
    }
    this.stop();
    this.step('up', e, (ratio) ? ratio : 1);
    this.autoStepTimer = setTimeout(() => {
      this.up(e, ratio, true);
    }, recursive ? SPEED : DELAY);
  },
};
