import React, {Component} from 'react';
import {
	Animated,
	Image,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as strings from '../../../config/strings';
import * as activityActions from '../../actions/activity-actions';
import * as submitResourceActions from '../../actions/submit-resource-actions';
import sc from '../../../config/styles';


const propTypes = {
};

class SubmitResource extends Component {
	constructor(props) {
		super(props);

		this._overlayOpacity = new Animated.Value(0);
		this._dialogOpacity = new Animated.Value(0);
		this._dialogScale = new Animated.Value(0.5);

		this.onPressSend = this.onPressSend.bind(this);
		this.onPressClose = this.onPressClose.bind(this);
	}

	componentDidMount() {
		Animated.timing( this._overlayOpacity, {
			delay: 10,
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();

		Animated.sequence([
			Animated.timing(this._dialogOpacity, {
				delay: 0.1,
				toValue: 1,
				duration: 10,
				useNativeDriver: true,
			}),
			Animated.spring(this._dialogScale, {
				toValue: 1,
				friction: 6,
				tension: 100,
				useNativeDriver: true,
			}),
		]).start();
	}

	render() {
		const styles = this.constructor.styles;
		const overlayStyles = [styles.overlay, {opacity: this._overlayOpacity}];
		const dialogStyles = [styles.dialog, {
			opacity: this._dialogOpacity,
			transform: [{scale: this._dialogScale}]
		}];
		const { selectedSubmitObject } = this.props;
		const title = (selectedSubmitObject.type == strings.OBJECT_TYPE_PHOTO)
			? strings.SUBMIT_RESOURCE_PHOTO_TITLE
			: strings.SUBMIT_RESOURCE_VIDEO_TITLE;
		const content = (selectedSubmitObject.type == strings.OBJECT_TYPE_PHOTO)
			? strings.SUBMIT_RESOURCE_PHOTO_CONTENT
			: strings.SUBMIT_RESOURCE_VIDEO_CONTENT;

		return (
			<View style={styles.container}>
				<Animated.View style={overlayStyles} />
				<Animated.View style={dialogStyles}>
					<View style={styles.inner}>

						<TouchableHighlight
							style={styles.iconButton}
							underlayColor={'transparent'}
							onPress={this.onPressClose}>
							<Image
								style={styles.icon}
								source={require('../../../images/chrome/close-64.png')} />
						</TouchableHighlight>

						<Text style={styles.textTitle}>{title}</Text>
						<Text style={styles.textContent}>{content}</Text>

						<TouchableHighlight
							style={styles.button}
							underlayColor='#99d9f4'
							onPress={this.onPressSend}>
							<Text style={styles.buttonText}>Got It</Text>
						</TouchableHighlight>

					</View>
				</Animated.View>
			</View>
		);
	}


	////////////////////
	// Event Callback //
	////////////////////

	onPressSend() {
		const { selectedSubmitObject } = this.props;

		this.props.submitResourceActions.hide();
		this.props.activityActions.submitResource(selectedSubmitObject);
	}

	onPressClose() {
		this.props.submitResourceActions.hide();
	}
}

SubmitResource.propTypes = propTypes;
SubmitResource.styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: sc.appBackgroundColor,
	},
	overlay: {
    flex: 0,
	},
	dialog: {
    flex: 0,
	},
	inner: {
		flex: 0,
		backgroundColor: 'white',
    borderRadius: 8,
		marginTop: 50,
		marginLeft: 20,
		marginRight: 20,
		padding: 20,
	},
  textTitle: {
		...sc.textBlackBold,
    alignSelf: 'center',
		marginBottom: 20,
  },
  textContent: {
		...sc.textBlack,
    alignSelf: 'center',
		marginBottom: 20,
  },
  buttonText: {
		...sc.textActionBtton,
    alignSelf: 'center',
  },
  button: {
    height: 48,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
		marginTop: 10,
  },
	icon: {
		width: 32,
		height: 32,
	},
  iconButton: {
		position: 'absolute',
		top: -12,
		right: -12,
  },
});

export default connect(state => ({
		selectedSubmitObject	: state.submitResource.object,
	}),
	dispatch => ({
		activityActions				: bindActionCreators(activityActions, dispatch),
		submitResourceActions	: bindActionCreators(submitResourceActions, dispatch),
	})
)(SubmitResource);
