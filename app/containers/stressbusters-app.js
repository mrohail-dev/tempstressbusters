import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, View} from 'react-native';
import {Provider} from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import store from '../reducers/store';
import App from './app';
import {SafeAreaView} from 'react-native';

const propTypes = {
  schoolId: PropTypes.string,
  interface: PropTypes.string,
};

export default class StressbustersApp extends Component {
  componentDidMount() {
    Text.allowFontScaling = false;
    Orientation.lockToPortrait();
    console.disableYellowBox = true;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <Provider store={store}>
        <View style={{flex:1}}>
          <App
            interface={this.props.interface}
            schoolId={this.props.schoolId}
          />
        </View>
      </Provider>
    );
  }
}

StressbustersApp.propTypes = propTypes;
