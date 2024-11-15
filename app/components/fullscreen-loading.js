import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	ActivityIndicator,
	Animated,
	InteractionManager,
	StyleSheet,
	View,
} from 'react-native';

const propTypes = {
};

export default class FullscreenLoadingView extends Component {

	render() {
		const styles = this.constructor.styles;

		return (
			<Animated.View style={styles.container}>
				<ActivityIndicator
					color='white'
					size='large' />
			</Animated.View>
		);
  }
}

FullscreenLoadingView.propTypes = propTypes;
FullscreenLoadingView.styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
