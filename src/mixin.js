function noop() {
}

/**
 * When click and hold on a button - the speed of auto changin the value.
 */
const SPEED = 50;

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
      inputValue: value,
      value,
      focused: props.autoFocus,
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = this.toNumber(nextProps.value);
      this.setState({
        inputValue: value,
        value,
      });
    }
  },

  componentWillUnmount() {
    this.stop();
  },

  onChange(e) {
    this.setState({ inputValue: this.getValueFromEvent(e).trim() });
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
    this.setValue(value);
    this.props.onBlur(e, ...args);
  },

  getCurrentValidValue(value) {
    let val = value;
    const props = this.props;
    if (val === '') {
      val = '';
    } else if (!isNaN(val)) {
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

  setValue(v) {
    if (!('value' in this.props)) {
      this.setState({
        value: v,
        inputValue: v,
      });
    }
    const newValue = isNaN(v) || v === '' ? undefined : v;
    if (newValue !== this.state.value) {
      this.props.onChange(newValue);
    } else {
      // revert input value
      this.setState({ inputValue: this.state.value });
    }
  },

  getPrecision() {
    const { step } = this.props;
    const stepString = step.toString();
    if (stepString.indexOf('e-') >= 0) {
      return parseInt(stepString.slice(stepString.indexOf('e-') + 1), 10);
    }
    let precision = 0;
    if (stepString.indexOf('.') >= 0) {
      precision = stepString.length - stepString.indexOf('.') - 1;
    }
    return precision;
  },

  getPrecisionFactor() {
    const precision = this.getPrecision();
    return Math.pow(10, precision);
  },

  toPrecisionAsStep(num) {
    if (isNaN(num) || num === '') {
      return num;
    }
    const precision = Math.abs(this.getPrecision());
    if (precision) {
      return Number(num).toFixed(precision);
    }
    return num;
  },

  toNumber(num) {
    if (isNaN(num) || num === '') {
      return num;
    }
    return Number(num);
  },

  upStep(val) {
    const { step, min } = this.props;
    const precisionFactor = this.getPrecisionFactor();
    let result;
    if (typeof val === 'number') {
      result = (precisionFactor * val + precisionFactor * step) / precisionFactor;
    } else {
      result = min === -Infinity ? step : min;
    }
    return this.toNumber(result);
  },

  downStep(val) {
    const { step, min } = this.props;
    const precisionFactor = this.getPrecisionFactor();
    let result;
    if (typeof val === 'number') {
      result = (precisionFactor * val - precisionFactor * step) / precisionFactor;
    } else {
      result = min === -Infinity ? -step : min;
    }
    return this.toNumber(result);
  },

  step(type, e) {
    if (e) {
      e.preventDefault();
    }
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const value = this.getCurrentValidValue(this.state.inputValue);
    this.setState({ value });
    if (isNaN(value)) {
      return;
    }
    const val = this[`${type}Step`](value);
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

  down(e, recursive) {
    if (e.persist) {
      e.persist();
    }
    this.stop();
    this.step('down', e);
    this.autoStepTimer = setTimeout(() => {
      this.down(e, true);
    }, recursive ? SPEED : DELAY);
  },

  up(e, recursive) {
    if (e.persist) {
      e.persist();
    }
    this.stop();
    this.step('up', e);
    this.autoStepTimer = setTimeout(() => {
      this.up(e, true);
    }, recursive ? SPEED : DELAY);
  },
};
