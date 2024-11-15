import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	Dimensions,
	Image,
	InteractionManager,
	StatusBar,
	StyleSheet,
	TouchableHighlight,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const propTypes = {
};

class FullscreenImageView extends Component {
	constructor(props) {
		super(props);

		this._chromeOpacity = new Animated.Value(0);

		this.onPressClose = this.onPressClose.bind(this);
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			Animated.timing( this._chromeOpacity, {
				delay: 0,
				toValue: 1,
				duration: 600,
				useNativeDriver: true,
			}).start();
		});
	}

	render() {
		const styles = this.constructor.styles;
		const chromeAnimatedStyles = [styles.container, {opacity: this._chromeOpacity}];
		const { object } = this.props;
    const displayFullscreen = object.type === 'photo';
		const { width, height } = Dimensions.get('window');
		let imageW = object.image_width;
		let imageH = object.image_height;

		let w, h, left, top, rotate;
    // rotate
		if (imageW > imageH) {
			rotate = '90deg';
      const imageWOld = imageW;
      imageW = imageH;
      imageH = imageWOld;
    }
    else {
			rotate = '0deg';
    }

    // calculate dimension
    if (displayFullscreen) {
      h = height;
      w = h / imageH * imageW;
    }
    else {
      w = width;
      h = w / imageW * imageH;
    }
    left = (width - w) / 2;
    top = (height - h) / 2;

		return (
			<Animated.View style={chromeAnimatedStyles}>
				<StatusBar hidden={true} />
				<TouchableHighlight
					style={styles.backgroundButton}
					activeOpacity={1}
					underlayColor={'transparent'}
					onPress={this.onPressClose}>

					<Image
						style={{left:left, top:top, width:w, height:h, transform:[{rotate:rotate}]}}
						source={{uri:object.image_link}} />
				</TouchableHighlight>
			</Animated.View>
		);
	}

	////////////////////
	// Event Callback //
	////////////////////

	onPressClose() {
		this._chromeOpacity.setValue(1);

		InteractionManager.runAfterInteractions(() => {
			Animated.timing( this._chromeOpacity, {
				delay: 0,
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			});
		});
	}

}

FullscreenImageView.propTypes = propTypes;
FullscreenImageView.styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: 'black',
	},
	backgroundButton: {
		flex:1,
	},
});

export default connect(state => ({
		object			: state.selectedPhoto.object,
	}),
	dispatch => ({
	})
)(FullscreenImageView);
