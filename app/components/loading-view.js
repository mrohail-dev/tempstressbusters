import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Animated, InteractionManager, StyleSheet, View } from 'react-native';
import sc from '../../config/styles';

const propTypes = {
};

export default class LoadingView extends Component {
	constructor(props) {
		super(props);

		this._spinnerOpacity = new Animated.Value(0);
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			Animated.timing(this._spinnerOpacity, {
				delay: sc.spinnerDelay,
				toValue: 1,
				duration: 10,
				useNativeDriver: true,
			}).start();
		});
	}

	render() {
		const styles = this.constructor.styles;
		const containerStyles = [styles.container, {opacity: this._spinnerOpacity}];

		return (
			<Animated.View style={containerStyles}>
				<ActivityIndicator
					color='white'
					size='small' />
			</Animated.View>
		);
	}
}

LoadingView.propTypes = propTypes;
LoadingView.styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 60,
	},
});
