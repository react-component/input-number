/* eslint no-console:0 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import InputNumber from '../../src/';
import inputNumberStyles from '../../src/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  stepper: {
    height: 44,
    marginTop: 100,
    paddingHorizontal: 10,
  },
  buttons: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
});

class InputNumberDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      readOnly: false,
      value: 5,
    };
  }

  onChange = (v) => {
    console.log('onChange:', v);
    this.setState({
      value: v,
    });
  };

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  };

  toggleReadOnly = () => {
    this.setState({
      readOnly: !this.state.readOnly,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.stepper}>
          <InputNumber
            styles={inputNumberStyles}
            min={-8}
            max={10}
            value={this.state.value}
            style={{ backgroundColor: 'white', paddingHorizontal: 10 }}
            readOnly={this.state.readOnly}
            onChange={this.onChange}
            disabled={this.state.disabled}
            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          />
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={this.toggleDisabled}>
            <View style={styles.buttonWrap}>
              <Text>toggle Disabled</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleReadOnly} style={{ marginLeft: 20 }}>
            <View style={styles.buttonWrap}>
              <Text>toggle readOnly</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TextInput style={{ flex: 1, fontSize: 16, height: 44, borderWidth: 1 }} />
        </View>
      </View>
    );
  }
}

export const title = 'input-number';
export const Demo = InputNumberDemo;
