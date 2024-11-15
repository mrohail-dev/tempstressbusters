import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RadioForm from 'react-native-simple-radio-button';
import DatePicker from 'react-native-date-picker';
import * as strings from '../../../config/strings';
import * as chillRemindersActions from '../../actions/chill-reminders-actions';
import styles from './reminder-form-styles';

const propTypes = {
	object: PropTypes.object.isRequired,
};

class ReminderForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			date: new Date(),
			frequency: strings.REMINDER_FREQUENCY_TITLE_ONCE,
		};
		this._overlayOpacity = new Animated.Value(0);
		this._dialogOpacity = new Animated.Value(0);
		this._dialogScale = new Animated.Value(0.5);

		this.onPressRemind = this.onPressRemind.bind(this);
		this.onPressClose = this.onPressClose.bind(this);
	}

	componentDidMount() {
		Animated.timing(this._overlayOpacity, {
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
		const overlayStyles = [styles.overlay, { opacity: this._overlayOpacity }];
		const dialogStyles = [styles.dialog, {
			flex: 1,
			opacity: this._dialogOpacity,
			transform: [{ scale: this._dialogScale }]
		}];

		const frequencyOptions = [
			{
				label: strings.REMINDER_FREQUENCY_TITLE_ONCE,
				value: strings.REMINDER_FREQUENCY_TITLE_ONCE,
			},
			{
				label: strings.REMINDER_FREQUENCY_TITLE_30MIN,
				value: strings.REMINDER_FREQUENCY_TITLE_30MIN,
			},
			{
				label: strings.REMINDER_FREQUENCY_TITLE_HOURLY,
				value: strings.REMINDER_FREQUENCY_TITLE_HOURLY,
			},
			{
				label: strings.REMINDER_FREQUENCY_TITLE_DAILY,
				value: strings.REMINDER_FREQUENCY_TITLE_DAILY,
			},
			{
				label: strings.REMINDER_FREQUENCY_TITLE_WEEKLY,
				value: strings.REMINDER_FREQUENCY_TITLE_WEEKLY,
			},
			{
				label: strings.REMINDER_FREQUENCY_TITLE_MONTHLY,
				value: strings.REMINDER_FREQUENCY_TITLE_MONTHLY,
			},
			{
				label: strings.REMINDER_FREQUENCY_TITLE_YEARLY,
				value: strings.REMINDER_FREQUENCY_TITLE_YEARLY,
			},
		];

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

						<Text style={styles.title} >
							Create reminder
						</Text>

						<DatePicker
							date={this.state.date}
							onDateChange={date => this.setState({ date })}
						/>

						<ScrollView
							scrollsToTop={false}
							showsVerticalScrollIndicator={false}>

							<RadioForm
								radio_props={frequencyOptions}
								initial={0}
								onPress={(value) => { this.setState({ frequency: value }) }}
								style={{ alignItems: 'flex-start' }}
							/>
						</ScrollView>

						<TouchableHighlight
							style={styles.button}
							underlayColor='#99d9f4'
							onPress={this.onPressRemind}>
							<Text style={styles.buttonText}>Remind Me</Text>
						</TouchableHighlight>

					</View>
				</Animated.View>
			</View>
		);
	}


	////////////////////
	// Event Callback //
	////////////////////

	onPressRemind() {
		const { object, sound } = this.props;
		const date = this.state.date;

		let frequency = undefined;

		if (this.state.frequency == strings.REMINDER_FREQUENCY_TITLE_30MIN) {
			frequency = strings.REMINDER_FREQUENCY_VALUE_30MIN;
		}
		else if (this.state.frequency == strings.REMINDER_FREQUENCY_TITLE_ONCE) {
			frequency = strings.REMINDER_FREQUENCY_TITLE_ONCE;
		}
		else if (this.state.frequency == strings.REMINDER_FREQUENCY_TITLE_HOURLY) {
			frequency = strings.REMINDER_FREQUENCY_VALUE_HOURLY;
		}
		else if (this.state.frequency == strings.REMINDER_FREQUENCY_TITLE_DAILY) {
			frequency = strings.REMINDER_FREQUENCY_VALUE_DAILY;
		}
		else if (this.state.frequency == strings.REMINDER_FREQUENCY_TITLE_WEEKLY) {
			frequency = strings.REMINDER_FREQUENCY_VALUE_WEEKLY;
		}
		else if (this.state.frequency == strings.REMINDER_FREQUENCY_TITLE_MONTHLY) {
			frequency = strings.REMINDER_FREQUENCY_VALUE_MONTHLY;
		}
		else if (this.state.frequency == strings.REMINDER_FREQUENCY_TITLE_YEARLY) {
			frequency = strings.REMINDER_FREQUENCY_VALUE_YEARLY;
		}

		this.props.chillRemindersActions.createReminder(object, sound, date.toString(), frequency);
	}

	onPressClose() {
		this.props.chillRemindersActions.deselectObject();
	}
}

ReminderForm.propTypes = propTypes;
ReminderForm.styles = StyleSheet.create(styles);

export default connect(state => ({
	enabledReminders: state.chillReminders.enabled_reminders,
	sound: state.chillReminders.selected_sound,
}),
	dispatch => ({
		chillRemindersActions: bindActionCreators(chillRemindersActions, dispatch),
	})
)(ReminderForm);
