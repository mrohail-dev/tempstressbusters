import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	Text,
} from 'react-native';
import sc from '../../../config/styles';

const propTypes = {
  textColor       : PropTypes.string,
};

export default class TextButton extends Component {

	render() {
		const styles = this.constructor.styles;

    const propStyles = this.props.textColor
      ? { color: this.props.textColor }
      : {};

		return (
      <Text style={[styles.text, propStyles]}>
        {this.props.children}
      </Text>
    );
  }
}

TextButton.propTypes = propTypes;
TextButton.styles = StyleSheet.create({
  text: {
		fontFamily: sc.fontFamily.bold,
		fontSize: sc.isShortScreen ? 14 : 18,
    color: sc.colors.black,
  },
});
