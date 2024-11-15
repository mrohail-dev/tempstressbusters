import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Image,
	StyleSheet,
	TouchableHighlight,
	TouchableWithoutFeedback,
	View,
	Animated,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as c from '../../../config/constants';
import * as favActions from '../../actions/favorite-actions';
import * as activityActions from '../../actions/activity-actions';
import * as selectedEventActions from '../../actions/selected-event-actions';
import * as submitResourceActions from '../../actions/submit-resource-actions';
import * as alertLib from '../../libs/alert-lib';
import ActivityButton from '../activity-button';
import baseObject from '../../libs/base-object';
import styles from './activity-styles';

const propTypes = {
	object					: PropTypes.object.isRequired,
	mode  					: PropTypes.string.isRequired,
	onClose					: PropTypes.func.isRequired,
};

class Activity extends Component {
	constructor(props) {
		super(props);

		this._overlayOpacity = new Animated.Value(0);
		this._dialogOpacity = new Animated.Value(0);
		this._dialogScale = new Animated.Value(0.5);

		this.onPressClose = this.onPressClose.bind(this);

		this.onPressFav = this.onPressFav.bind(this);
		this.onPressUnfav = this.onPressUnfav.bind(this);

		this.onPressShareFacebook = this.onPressShareFacebook.bind(this);
		this.onPressShareTwitter = this.onPressShareTwitter.bind(this);
		this.onPressShareSms = this.onPressShareSms.bind(this);
		this.onPressShareEmail = this.onPressShareEmail.bind(this);

		this.onPressReplySms = this.onPressReplySms.bind(this);
		this.onPressReplyPhone = this.onPressReplyPhone.bind(this);
		this.onPressReplyEmail = this.onPressReplyEmail.bind(this);

		this.onPressLinkToCalendar = this.onPressLinkToCalendar.bind(this);
		this.onPressLinkToMap = this.onPressLinkToMap.bind(this);
		this.onPressParticipate = this.onPressParticipate.bind(this);
		this.onPressSendUsResource = this.onPressSendUsResource.bind(this);
		this.onPressGoToWebsite = this.onPressGoToWebsite.bind(this);
		this.isObjectFaved = this.isObjectFaved.bind(this);
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
		const dialogStyles = [ styles.dialog, {
			opacity: this._dialogOpacity,
			transform: [{scale: this._dialogScale}]
		}];
    const { object, mode } = this.props;
		const baseObj = baseObject(object);
		const isFaved = this.isObjectFaved();
		const favImageSrc = isFaved
			? require('../../../images/activity/unfav-120.png')
			: require('../../../images/activity/fav-120.png');
		const favAction = isFaved
			? this.onPressUnfav
			: this.onPressFav;

		return (
			<View style={styles.container}>
				<TouchableHighlight
					style={styles.backgroundButton}
					activeOpacity={1}
					underlayColor={'transparent'}
					onPress={this.onPressClose}>

					<View style={styles.buttonsContainer}>
						<Animated.View style={overlayStyles} />
						<Animated.View style={dialogStyles}>
							<View>
								{mode == c.SELECTED_OBJECT_MODE_ALL
                  && baseObj.canFav()
                  &&
									<ActivityButton
										onPress={favAction}
										source={favImageSrc} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_SHARE)
                  && baseObj.canShareFacebook()
                  &&
									<ActivityButton
										onPress={this.onPressShareFacebook}
										source={require('../../../images/activity/fb-share-120.png')} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_SHARE)
								  && baseObj.canShareTwitter()
                  && 
									<ActivityButton
										onPress={this.onPressShareTwitter}
										source={require('../../../images/activity/twitter-share-120.png')} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_SHARE)
								  && baseObj.canShareSms()
                  && 
									<ActivityButton
										onPress={this.onPressShareSms}
										source={require('../../../images/activity/message-share-120.png')} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_SHARE)
								  && baseObj.canShareEmail()
                  && 
									<ActivityButton
										onPress={this.onPressShareEmail}
										source={require('../../../images/activity/email-share-120.png')} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_MORE)
								  && baseObj.canReplySms()
                  && 
									<ActivityButton
										onPress={this.onPressReplySms}
										source={require('../../../images/activity/message-120.png')} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_MORE)
								  && baseObj.canReplyPhone()
                  && 
									<ActivityButton
										onPress={this.onPressReplyPhone}
										source={require('../../../images/activity/phone-128.png')} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_MORE)
								  && baseObj.canReplyEmail()
                  && 
									<ActivityButton
										onPress={this.onPressReplyEmail}
										source={require('../../../images/activity/email-120.png')} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_MORE)
                  && baseObj.canLinkToCalendar()
                  && 
									<ActivityButton
										onPress={this.onPressLinkToCalendar}
										source={require('../../../images/activity/calendar-128.png')} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_MORE)
                  && baseObj.canLinkToMap()
                  &&
									<ActivityButton
										onPress={this.onPressLinkToMap}
										source={require('../../../images/activity/map-120.png')} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_MORE)
                  && baseObj.canParticipate()
                  && 
									<ActivityButton
										onPress={this.onPressParticipate}
										source={require('../../../images/activity/participate-120.png')} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_MORE)
                  && baseObj.canSendUsPhoto()
                  && 
									<ActivityButton
										onPress={this.onPressSendUsResource}
										source={require('../../../images/activity/photo-120.png')} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_MORE)
                  && baseObj.canSendUsVideoLink()
                  && 
									<ActivityButton
										onPress={this.onPressSendUsResource}
										source={require('../../../images/activity/video-120.png')} />}

								{(mode == c.SELECTED_OBJECT_MODE_ALL || mode == c.SELECTED_OBJECT_MODE_MORE)
                  && baseObj.canGoToWebsite()
                  && 
									<ActivityButton
										onPress={this.onPressGoToWebsite}
										source={require('../../../images/activity/website-120.png')} />}

							</View>
						</Animated.View>
					</View>
				</TouchableHighlight>
			</View>
		);
	}


	////////////////////
	// Event Callback //
	////////////////////

	onPressClose() {
		this.props.onClose();
	}

	onPressFav() {
		const { object } = this.props;

		this.props.favActions.favoriteObject(object);
		this.props.onClose();
	}

	onPressUnfav() {
		const { object } = this.props;

		this.props.favActions.unfavoriteObject(object);
		this.props.onClose();
	}

	onPressShareFacebook() {
		const { object } = this.props;

		this.props.onClose();
		this.props.activityActions.shareFacebook(object);
	}

	onPressShareTwitter() {
		const { object } = this.props;

		this.props.onClose();
		this.props.activityActions.shareTwitter(object);
	}

	onPressShareSms() {
		const { object } = this.props;

		this.props.onClose();
		this.props.activityActions.shareSms(object);
	}

	onPressShareEmail() {
		const { object } = this.props;

		this.props.onClose();
		this.props.activityActions.shareEmail(object);
	}

	onPressReplySms() {
		const { object } = this.props;

		this.props.onClose();
		this.props.activityActions.replySms(object);
	}

	onPressReplyPhone () {
		const { object } = this.props;

		this.props.onClose();
		this.props.activityActions.replyCall(object);
	}

	onPressReplyEmail() {
		const { object } = this.props;

		this.props.onClose();
		this.props.activityActions.replyEmail(object);
	}

	onPressLinkToCalendar () {
		const { object, activityActions, onClose } = this.props;

		alertLib.showAddToCalendarConfirm(() => {
      alertLib.showCalendarReminder((alarmDate) => {
        onClose();
        activityActions.linkToCalendar(object, alarmDate);
      });
		});
	}

	onPressLinkToMap () {
		const { object } = this.props;

		this.props.onClose();
		this.props.activityActions.linkToMap(object);
	}

	onPressParticipate () {
		const { object } = this.props;

		this.props.onClose();
		this.props.selectedEventActions.select(object);
	}

	onPressSendUsResource () {
		const { object } = this.props;

		this.props.onClose();
		this.props.submitResourceActions.show(object);
	}


	onPressGoToWebsite () {
		const { object } = this.props;

		this.props.onClose();
		this.props.activityActions.goToWebsite(object.link);
	}

	///////////////
	// Functions //
	///////////////

	isObjectFaved() {
		const { object, favObjects } = this.props;

		const index = favObjects.findIndex((per, index) => {
			if (per.id == object.id) {
				return true;
			}
			return false;
		});

		return index >= 0;
	}
}

Activity.propTypes = propTypes;
Activity.styles = StyleSheet.create(styles);

export default connect(state => ({
		favObjects	: state.favorites.data['All'],
	}),
	dispatch => ({
		favActions						: bindActionCreators(favActions, dispatch),
		activityActions				: bindActionCreators(activityActions, dispatch),
		selectedEventActions	: bindActionCreators(selectedEventActions, dispatch),
		submitResourceActions	: bindActionCreators(submitResourceActions, dispatch),
	})
)(Activity);
