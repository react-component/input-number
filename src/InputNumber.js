import React, { PropTypes } from 'react';
import { View, TextInput, Text, TouchableWithoutFeedback } from 'react-native';
import styles from './styles';

export default class InputNumber extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    upStyle: PropTypes.object,
    downStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    max: PropTypes.number,
    min: PropTypes.number,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    step: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    defaultValue: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  };

  static defaultProps = {
    max: Infinity,
    min: -Infinity,
    step: 1,
    style: {},
    defaultValue: '',
    onChange() {},
    onFocus() {},
    onBlur() {},
  }

  constructor(props) {
    super(props);
    let value;
    if ('value' in props) {
      value = props.value;
    } else {
      value = props.defaultValue;
    }
    value = this.toPrecisionAsStep(value);
    this.state = {
      inputValue: value,
      value,
      focused: props.autoFocus,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = this.toPrecisionAsStep(nextProps.value);
      this.setState({
        inputValue: value,
        value,
      });
    }
  }

  onStep(type) {
    const props = this.props;
    if (props.disabled) {
      return;
    }

    const value = this.state.value;
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
  }

  onChange = (event) => {
    this.setState({
      inputValue: event.nativeEvent.text.trim(),
    });
  }

  onFocus = (event) => {
    this.setState({
      focused: true,
    });
    this.props.onFocus(event);
  }

  onBlur = (event) => {
    this.setState({
      focused: false,
    });
    const value = this.getCurrentValidValue(event.nativeEvent.text.trim());
    this.setValue(value);
    this.props.onBlur(event);
  }

  onPressIn(type, disabled) {
    if (this.props.disabled || disabled) {
      return;
    }
    this[type].setNativeProps({
      style: [styles.stepWrap, { borderColor: '#2DB7F5' }],
    });
    this[`${type}Text`].setNativeProps({
      style: [styles.stepText, { color: '#2DB7F5' }],
    });
  }

  onPressOut(type, disabled) {
    if (this.props.disabled || disabled) {
      return;
    }
    this[type].setNativeProps({
      style: [styles.stepWrap],
    });
    this[`${type}Text`].setNativeProps({
      style: [styles.stepText],
    });
  }

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
    return this.toPrecisionAsStep(val);
  }

  setValue(v) {
    if (!('value' in this.props)) {
      this.setState({
        value: v,
        inputValue: v,
      });
    }
    this.props.onChange(isNaN(v) || v === '' ? undefined : v);
  }

  getPrecision() {
    const props = this.props;
    const stepString = props.step.toString();
    if (stepString.indexOf('e-') >= 0) {
      return parseInt(stepString.slice(stepString.indexOf('e-') + 1), 10);
    }
    let precision = 0;
    if (stepString.indexOf('.') >= 0) {
      precision = stepString.length - stepString.indexOf('.') - 1;
    }
    return precision;
  }

  getPrecisionFactor() {
    const precision = this.getPrecision();
    return Math.pow(10, precision);
  }

  toPrecisionAsStep(num) {
    if (isNaN(num) || num === '') {
      return num;
    }
    const precision = this.getPrecision();
    return Number(Number(num).toFixed(Math.abs(precision)));
  }

  upStep(val) {
    const { step, min } = this.props;
    const precisionFactor = this.getPrecisionFactor();
    let result;
    if (typeof val === 'number') {
      result = (precisionFactor * val + precisionFactor * step) / precisionFactor;
    } else {
      result = min === -Infinity ? step : min;
    }
    return this.toPrecisionAsStep(result);
  }

  downStep(val) {
    const { step, min } = this.props;
    const precisionFactor = this.getPrecisionFactor();
    let result;
    if (typeof val === 'number') {
      result = (precisionFactor * val - precisionFactor * step) / precisionFactor;
    } else {
      result = min === -Infinity ? -step : min;
    }
    return this.toPrecisionAsStep(result);
  }

  render() {
    const props = this.props;
    const { style, upStyle, downStyle, inputStyle } = this.props;

    let upDisabledStyle = null;
    let downDisabledStyle = null;
    let upDisabledTextStyle = null;
    let downDisabledTextStyle = null;
    const value = this.state.value;
    if (!isNaN(value)) {
      const val = Number(value);
      if (val >= props.max) {
        upDisabledStyle = styles.stepDisabled;
        upDisabledTextStyle = styles.textDisabled;
      }
      if (val <= props.min) {
        downDisabledStyle = styles.stepDisabled;
        downDisabledTextStyle = styles.textDisabled;
      }
    } else {
      upDisabledStyle = styles.stepDisabled;
      downDisabledStyle = styles.stepDisabled;
      upDisabledTextStyle = styles.textDisabled;
      downDisabledTextStyle = styles.textDisabled;
    }

    let inputDisabledStyle = null;
    if (props.disabled) {
      upDisabledStyle = styles.stepDisabled;
      downDisabledStyle = styles.stepDisabled;
      upDisabledTextStyle = styles.textDisabled;
      downDisabledTextStyle = styles.textDisabled;
      inputDisabledStyle = styles.textDisabled;
    }

    let inputDisplayValue;
    if (this.state.focused) {
      inputDisplayValue = `${this.state.inputValue}`;
    } else {
      inputDisplayValue = `${this.state.value}`;
    }

    if (inputDisplayValue === undefined) {
      inputDisplayValue = '';
    }

    return (
      <View style={[styles.container, style]}>
        <TouchableWithoutFeedback
          onPress={() => {this.onStep('down');}}
          onPressIn={() => {this.onPressIn('_stepDown', downDisabledStyle);}}
          onPressOut={() => {this.onPressOut('_stepDown', downDisabledStyle);}}
        >
          <View
            ref={component => this._stepDown = component}
            style={[styles.stepWrap, downDisabledStyle, downStyle]}
          >
            <Text
              ref={component => this._stepDownText = component}
              style={[styles.stepText, downDisabledTextStyle]}
            >-</Text>
          </View>
        </TouchableWithoutFeedback>
        <TextInput
          style={[styles.input, inputDisabledStyle, inputStyle]}
          ref="input"
          value={inputDisplayValue}
          autoFocus={props.autoFocus}
          editable={!props.readOnly && !props.disabled}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          underlineColorAndroid="transparent"
        />
        <TouchableWithoutFeedback
          onPress={() => this.onStep('up')}
          onPressIn={() => {this.onPressIn('_stepUp', upDisabledStyle);}}
          onPressOut={() => {this.onPressOut('_stepUp', upDisabledStyle);}}
        >
          <View
            ref={component => this._stepUp = component}
            style={[styles.stepWrap, upDisabledStyle, upStyle]}
          >
            <Text
              ref={component => this._stepUpText = component}
              style={[styles.stepText, upDisabledTextStyle]}
            >+</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
