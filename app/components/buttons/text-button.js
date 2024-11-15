import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
} from 'react-native';
import sc from '../../../config/styles';

const propTypes = {
  text            : PropTypes.string.isRequired,
  textColor       : PropTypes.string.isRequired,
  backgroundColor : PropTypes.string.isRequired,
  onPress         : PropTypes.func.isRequired,
};

export default class TextButton extends Component {

	render() {
		const styles = this.constructor.styles;

		return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.button, {
          backgroundColor:this.props.backgroundColor,
          borderColor:this.props.backgroundColor,
        }]}
        onPress={this.props.onPress}>
        <Text style={[styles.text, {
          color:this.props.textColor,
        }]}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

TextButton.propTypes = propTypes;
TextButton.styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
		fontFamily: sc.fontFamily.normal,
		fontSize: sc.isShortScreen ? 14 : 18,
  },
  button: {
    height: sc.dimension.hp(7),
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
  },
});
