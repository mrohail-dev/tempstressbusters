import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, View } from 'react-native';
import sc from '../../config/styles';

const propTypes = {
	message				: PropTypes.string.isRequired,
};

export default class SignView extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const styles = this.constructor.styles;

		return (
			<View style={styles.container}>
				<Text style={styles.text}>{this.props.message}</Text>
			</View>
		);
	}
}

SignView.propTypes = propTypes;
SignView.styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 60,
	},
	text: {
		...sc.textBold,
	},
});
