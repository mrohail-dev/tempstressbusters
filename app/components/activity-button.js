import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Image,
	StyleSheet,
	TouchableHighlight,
} from 'react-native';

const propTypes = {
	source				: PropTypes.number.isRequired,
	onPress				: PropTypes.func.isRequired,
};

export default class ActivityButton extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const styles = this.constructor.styles;
		const { source, onPress } = this.props;

		return (
			<TouchableHighlight
				underlayColor={'transparent'}
				onPress={onPress}>
				<Image
					style={styles.icon}
					source={source} />
			</TouchableHighlight>
		);
	}
}

ActivityButton.propTypes = propTypes;
ActivityButton.styles = StyleSheet.create({
	icon: {
		width: 48,
		height: 48,
		marginLeft: 20,
		marginBottom: 20,
	},
});
