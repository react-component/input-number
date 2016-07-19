/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import InputNumber from './src/';

class examples extends Component {
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
  }

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  }

  toggleReadOnly = () => {
    this.setState({
      readOnly: !this.state.readOnly,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.stepper}>
          <InputNumber
          min={-8}
          max={10}
          value={this.state.value}
          style={{ backgroundColor: 'white', paddingHorizontal: 10  }}
          readOnly={this.state.readOnly}
          onChange={this.onChange}
          disabled={this.state.disabled} />
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={this.toggleDisabled}>
            <View style={styles.buttonWrap}>
              <Text>toggle Disabled</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleReadOnly} style={{marginLeft: 20}}>
            <View style={styles.buttonWrap}>
              <Text>toggle readOnly</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  stepper: {
    height: 44,
    marginTop: 100,
    paddingHorizontal: 10
  },
  buttons: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8
  },
});

AppRegistry.registerComponent('examples', () => examples);
