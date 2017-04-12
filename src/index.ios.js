import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import mixin from './mixin';

const InputNumber = createReactClass({
  propTypes: {
    styles: PropTypes.object,
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
    step: PropTypes.number,
    value: PropTypes.number,
    defaultValue: PropTypes.number,
    readOnly: PropTypes.bool,
    keyboardType: PropTypes.string,
  },

  mixins: [mixin],

  onPressIn(type) {
    if (this.props.disabled) {
      return;
    }
    const { styles } = this.props;
    this[type].setNativeProps({
      style: [styles.stepWrap, styles.highlightStepBorderColor],
    });
    this[`${type}Text`].setNativeProps({
      style: [styles.stepText, styles.highlightStepTextColor],
    });
  },

  onPressOut(type) {
    if (this.props.disabled) {
      return;
    }
    const { styles } = this.props;
    this[type].setNativeProps({
      style: [styles.stepWrap],
    });
    this[`${type}Text`].setNativeProps({
      style: [styles.stepText],
    });
  },

  onPressInDown(e) {
    this.onPressIn('_stepDown');
    this.down(e, true);
  },
  onPressOutDown() {
    this.onPressOut('_stepDown');
    this.stop();
  },
  onPressInUp(e) {
    this.onPressIn('_stepUp');
    this.up(e, true);
  },
  onPressOutUp() {
    this.onPressOut('_stepUp');
    this.stop();
  },

  getValueFromEvent(e) {
    return e.nativeEvent.text;
  },

  render() {
    const { props, state } = this;
    const { style, upStyle, downStyle, inputStyle, styles } = this.props;
    const editable = !this.props.readOnly && !this.props.disabled;

    let upDisabledStyle = null;
    let downDisabledStyle = null;
    let upDisabledTextStyle = null;
    let downDisabledTextStyle = null;
    const value = state.value;
    if (!isNaN(value)) {
      const val = Number(value);
      if (val >= props.max) {
        upDisabledStyle = styles.stepDisabled;
        upDisabledTextStyle = styles.disabledStepTextColor;
      }
      if (val <= props.min) {
        downDisabledStyle = styles.stepDisabled;
        downDisabledTextStyle = styles.disabledStepTextColor;
      }
    } else {
      upDisabledStyle = styles.stepDisabled;
      downDisabledStyle = styles.stepDisabled;
      upDisabledTextStyle = styles.disabledStepTextColor;
      downDisabledTextStyle = styles.disabledStepTextColor;
    }

    let inputDisabledStyle = null;
    if (props.disabled) {
      upDisabledStyle = styles.stepDisabled;
      downDisabledStyle = styles.stepDisabled;
      upDisabledTextStyle = styles.disabledStepTextColor;
      downDisabledTextStyle = styles.disabledStepTextColor;
      inputDisabledStyle = styles.disabledStepTextColor;
    }

    let inputDisplayValue;
    if (state.focused) {
      inputDisplayValue = `${state.inputValue}`;
    } else {
      inputDisplayValue = `${state.value}`;
    }

    if (inputDisplayValue === undefined) {
      inputDisplayValue = '';
    }

    return (
      <View style={[styles.container, style]}>
        <TouchableWithoutFeedback
          onPressIn={(editable && !downDisabledStyle) ? this.onPressInDown : undefined}
          onPressOut={(editable && !downDisabledStyle) ? this.onPressOutDown : undefined}
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
          editable={editable}
          onFocus={this.onFocus}
          onEndEditing={this.onBlur}
          onChange={this.onChange}
          underlineColorAndroid="transparent"
          keyboardType={props.keyboardType}
        />
        <TouchableWithoutFeedback
          onPressIn={(editable && !upDisabledStyle) ? this.onPressInUp : undefined}
          onPressOut={(editable && !upDisabledStyle) ? this.onPressOutUp : undefined}
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
  },
});

export default InputNumber;
