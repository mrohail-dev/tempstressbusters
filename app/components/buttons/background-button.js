import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
} from 'react-native';
import sc from '../../../config/styles';

const propTypes = {
	onPress: PropTypes.func.isRequired,
};

export default class BackgroundButton extends Component {
	render() {
		return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: sc.colors.backgroundBlack,
        }}
        onPress={this.props.onPress}>
      </TouchableOpacity>
		);
	}

}

BackgroundButton.propTypes = propTypes;
