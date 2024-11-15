import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  	Animated,
	Image,
  	Platform,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import * as selectedEventActions from '../../actions/selected-event-actions';
import sc from '../../../config/styles';

const propTypes = {
	object: PropTypes.object.isRequired,
};

const EventForm = ({ object }) => {
	const dispatch = useDispatch();
	const _overlayOpacity = new Animated.Value(0);
	const _dialogOpacity = new Animated.Value(0);
	const _dialogScale = new Animated.Value(0.5);

	const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

	useEffect(() => {
		Animated.timing(_overlayOpacity, {
			delay: 10,
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();

		Animated.sequence([
			Animated.timing(_dialogOpacity, {
				delay: 0.1,
				toValue: 1,
				duration: 10,
				useNativeDriver: true,
			}),
			Animated.spring(_dialogScale, {
				toValue: 1,
				friction: 6,
				tension: 100,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	////////////////////
	// Event Callback //
	////////////////////

	const onPressBook = (values) => {
		if (values) {
			dispatch(selectedEventActions.signup(object, values));
		}
	}

	const onPressClose = () => {
		dispatch(selectedEventActions.cancel());
	}

	const render = () => {
		const overlayStyles = [styles.overlay, {opacity: this._overlayOpacity}];
		const dialogStyles = [ styles.dialog, {
			opacity: this._dialogOpacity,
			transform: [{scale: this._dialogScale}]
		}];

		return (
			<View style={styles.container}>
				<Animated.View style={overlayStyles} />
				<Animated.View style={dialogStyles}>
					<View style={styles.inner}>

						<TouchableHighlight
							style={styles.iconButton}
							underlayColor={'transparent'}
							onPress={onPressClose}>
							<Image
								style={styles.icon}
								source={require('../../../images/chrome/close-64.png')} />
						</TouchableHighlight>

						<Text style={styles.title} >
							I Will Attend/Participate
						</Text>

						<form onSubmit={handleSubmit(onPressBook)}>
							<input {...register("name", { required: true })} />
							{errors.name && <span>Name is required</span>}

							<input {...register("email", { required: true })} />
							{errors.email && <span>Email is required</span>}

							<input {...register("phone")} />

							<TouchableHighlight
								style={styles.button}
								underlayColor='#99d9f4'
								onPress={onPressBook}
							>
								<Text style={styles.buttonText}>Sign Up</Text>
							</TouchableHighlight>
						</form>
					</View>
				</Animated.View>
			</View>
		);
	}

	return render();
}

EventForm.propTypes = propTypes;

const styles = StyleSheet.create({
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
  title: {
		...sc.textFormTitle,
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
		// note: Android does not support -ve absolute position
		top: (Platform.OS === 'ios') ? -12 : 0,
		right: (Platform.OS === 'ios') ? -12 : 0,
  },
});

export default EventForm;
