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
  fontSize        : PropTypes.number,
  onPress         : PropTypes.func.isRequired,
};

export default class LinkButton extends Component {

	render() {
		const styles = this.constructor.styles;

		return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={this.props.onPress}>
        <Text style={[styles.text, {
          fontSize: this.props.fontSize
        }]}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

LinkButton.propTypes = propTypes;
LinkButton.styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    color: 'rgba(65, 105, 225, 0.9)',
		fontFamily: sc.fontFamily.normal,
		fontSize: sc.isShortScreen ? 14 : 18,
    textDecorationLine: 'underline',
  },
  button: {
    flexDirection:'row',
  },
});
