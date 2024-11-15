import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sc from '../../../config/styles';
import * as routes from '../../../app/routes/routes';
import * as strings from '../../../config/strings';
import * as constants from '../../../config/constants';
import * as chillRemindersActions from '../../actions/chill-reminders-actions';
import * as activityActions from '../../actions/activity-actions';
import * as dateLib from '../../libs/date-lib';
import FeedCellAudioView from '../feed-cell/feed-cell-audio';
import FeedCellAudioGridView from '../feed-cell/feed-cell-audio-grid';
import FeedCellBackSideView from '../feed-cell/feed-cell-back-side';
import FeedCellTextView from '../feed-cell/feed-cell-text';
import FeedCellGraphicTextView from '../feed-cell/feed-cell-graphic-text';
import FeedCellVideoView from '../feed-cell/feed-cell-video';
import FeedCellPhoneContactView from '../feed-cell/feed-cell-phone-contact';
import FeedCellPhoneFriendView from '../feed-cell/feed-cell-phone-friend';
import FeedCellPhotoView from '../feed-cell/feed-cell-photo';
import FeedCellNoteView from '../feed-cell/feed-cell-note';
import FeedCellBadgeView from '../feed-cell/feed-cell-badge';
import FeedCellCommentView from '../feed-cell/feed-cell-comment';
import styles from './feed-cell-styles';

const propTypes = {
	data			            : PropTypes.any,
	navigation				: PropTypes.any,
	layout		            : PropTypes.any,
	isBackSide			      : PropTypes.any,
	onPressShortcut	      : PropTypes.any,
	onPressCommentReply	  : PropTypes.any,
	onPressNoteEdit   	  : PropTypes.any,
};

class FeedCell extends Component {

	constructor(props) {
		super(props);

		this.onPressReminder = this.onPressReminder.bind(this);
	}
	
	render() {
		const { data, isBackSide, navigation } = this.props;
		
		// Case: default case
		if (isBackSide) {
			return this.renderBackSide();
		}
		// Case: has "related_screen" => wrap in a button
		else if (data.related_screen || this.props.onPressShortcut) {
			return (
				<TouchableHighlight
					onPress={() => this.props.onPressShortcut(data, navigation)}
					underlayColor={sc.buttonHighlightColor}>
          <View>
            { this.renderCell() }
          </View>
				</TouchableHighlight>
			);
		}
		// Case: default case
		else {
			return this.renderCell();
		}
	}

	renderCell() {
		const { data } = this.props;
		switch (data.type) {
			case strings.OBJECT_TYPE_MESSAGE:
        if (data.image_link) {
          return this.renderPhoto();
        }
        else if (data.template) {
          return this.renderGraphicText();
        }
        return this.renderPlain();
			case strings.OBJECT_TYPE_TEXT: return this.renderText();
			case strings.OBJECT_TYPE_VIDEO: return this.renderVideo();
			case strings.OBJECT_TYPE_PHOTO: return this.renderPhoto();
			case strings.OBJECT_TYPE_AUDIO: return this.renderAudio();
			case strings.OBJECT_TYPE_EVENT: return this.renderEvent();
			case strings.OBJECT_TYPE_LINK: return this.renderPlain();
			case strings.OBJECT_TYPE_GROUP: return this.renderPlain();
			case strings.OBJECT_TYPE_HELP: return this.renderHelp();
			case strings.OBJECT_TYPE_REMINDER: return this.renderReminder();
			case strings.OBJECT_TYPE_REWARD_EARN: return this.renderReward();
			case strings.OBJECT_TYPE_REWARD_SPEND: return this.renderReward();
			case strings.OBJECT_TYPE_PHONE_CONTACT: return this.renderPhoneContact();
			case strings.OBJECT_TYPE_PHONE_FRIEND: return this.renderPhoneFriend();
			case strings.OBJECT_TYPE_NOTE: return this.renderNote();
			case strings.OBJECT_TYPE_BADGE: return this.renderBadge();
			case strings.OBJECT_TYPE_COMMENT: return this.renderComment();
		}
	}

	renderPlain() {
		const styles = this.constructor.styles;
		const { data } = this.props;
		const contentView = () => (
			<View>
				<Text style={styles.textTitle}>{data.title}</Text>
				<Text style={styles.textContent}>{data.content}</Text>
			</View>
		);

		// Case 1: GROUP/LINK has "link" => wrap in a button
		if ((data.type == strings.OBJECT_TYPE_LINK || data.type == strings.OBJECT_TYPE_GROUP)
			&& (data.link)) {
			return (
				<View style={styles.container}>
					<View style={styles.textContainer}>
						<TouchableHighlight
							onPress={() => this.onPressOpenLink()}
							underlayColor={sc.buttonHighlightColor}>
							{ contentView() }
						</TouchableHighlight>
					</View>
				</View>
			);
		}
		// Case 2: MESSAGE with text
		return (
			<View style={styles.container}>
				<View style={styles.textContainer}>
					{ contentView() }
				</View>
			</View>
		);
	}

	renderText() {
		const { data } = this.props;
		return (
			<View style={styles.container}>
        <FeedCellTextView data={data} />
			</View>
		);
	}

	renderGraphicText() {
		const { data } = this.props;
		return (
			<View style={styles.container}>
        <FeedCellGraphicTextView data={data} />
      </View>
    );
	}

	renderPhoneContact() {
		const { data } = this.props;
		return (
			<View style={styles.container}>
        <FeedCellPhoneContactView data={data} />
      </View>
    );
	}

	renderPhoneFriend() {
		const { data } = this.props;
		return (
			<View style={styles.container}>
        <FeedCellPhoneFriendView data={data} />
      </View>
    );
	}

	renderNote() {
		const { data } = this.props;
		return (
			<View style={styles.container}>
        <FeedCellNoteView
          data={data}
          onPressNoteEdit={this.props.onPressNoteEdit} />
      </View>
    );
	}

	renderComment() {
		const { data } = this.props;
		return (
			<View style={styles.container}>
        <FeedCellCommentView
          data={data}
          onPressCommentReply={this.props.onPressCommentReply} />
      </View>
    );
	}

	renderBadge() {
		const { data } = this.props;
		return (
			<View style={styles.container}>
        <FeedCellBadgeView data={data} />
      </View>
    );
	}

	renderPhoto() {
		const { data } = this.props;
		return (
			<View style={styles.container}>
        <FeedCellPhotoView data={data} />
      </View>
    );
	}

	renderAudio() {
		const { data } = this.props;
		return (
			<View style={styles.container}>
        { this.props.layout === "grid"
            ? ( <FeedCellAudioGridView data={data} /> )
            : ( <FeedCellAudioView data={data} /> )
        }
      </View>
    );
	}

	renderVideo() {
		const { data } = this.props;
		return (
			<View style={styles.container}>
        <FeedCellVideoView data={data} />
			</View>
    );
  }

	renderEvent() {
		const styles = this.constructor.styles;
		const { data } = this.props;
		const date = new Date(data.start_date * 1000);
		const dateStr = dateLib.formatDate(date);

		return (
			<View style={styles.container}>
				<View style={styles.textContainer}>
					<Text style={styles.textTitle}>{data.title}</Text>
					<Text style={styles.eventsTextDate}>{`${dateStr} ${data.start_time}`}</Text>
					<Text style={styles.eventsTextLocation}>{data.location_name}</Text>
					<Text style={styles.textContent}>{data.content}</Text>
				</View>
			</View>
		);
	}

	renderHelp() {
		const styles = this.constructor.styles;
		const { data } = this.props;

		return (
			<View style={styles.helpContainer}>
				<View style={styles.helpTextContainer}>
					<Text style={styles.textTitle}>{data.title}</Text>
					<Text style={styles.textContent}>{data.content}</Text>
				</View>
				<TouchableHighlight
					onPress={this.onPressHelp}
					underlayColor={sc.buttonHighlightColor}>
					<Image
						style={styles.helpControlImage}
						source={require('../../../images/cell/help-48.png')} />
				</TouchableHighlight>
			</View>
		);
	}

	renderReminder() {
		const styles = this.constructor.styles;
		const { data, enabledReminders } = this.props;
		const found = enabledReminders.find(({ object }) => object.id === data.id);
    const isEnabled = found;
    const isVoiceEnabled = found && found.sound;
		const imageSrc = isEnabled
			? require('../../../images/cell/reminder-hl-64.png')
			: require('../../../images/cell/reminder-64.png');
		const voiceSrc = isVoiceEnabled
			? require('../../../images/cell/reminder-voice-hl-42.png')
			: require('../../../images/cell/reminder-voice-42.png');
		return (
			<View style={styles.reminderContainer}>
				<View style={styles.reminderTextContainer}>
					<Text style={styles.reminderTextTitle}>{data.title}</Text>
				</View>
        { constants.REMINDER_VOICES[data.title] &&
          <TouchableHighlight
            onPress={() => this.onPressReminder(isVoiceEnabled, constants.REMINDER_VOICES[data.title])}
            underlayColor={sc.buttonHighlightColor}>
            <Image
              style={styles.reminderControlImage}
              source={voiceSrc} />
          </TouchableHighlight> }
        <TouchableHighlight
          onPress={() => this.onPressReminder(isEnabled)}
          underlayColor={sc.buttonHighlightColor}>
          <Image
            style={styles.reminderControlImage}
            source={imageSrc} />
          </TouchableHighlight>
			</View>
		);
	}

	renderReward() {
		const styles = this.constructor.styles;
		const { data } = this.props;

		return (
			<View style={styles.rewardContainer}>
				<View style={styles.rewardTextContainer}>
					<Text style={styles.textTitle}>{data.title}</Text>
					<Text style={styles.textContent}>{data.content}</Text>
				</View>
				<Text style={styles.rewardTextPoint}>{`${data.point} points`}</Text>
			</View>
		);
	}

	renderBackSide() {
		const { data } = this.props;
		return (
			<View style={styles.container}>
        <FeedCellBackSideView data={data} />
      </View>
    );
	}

	////////////////////
	// Event Callback //
	////////////////////

	onPressOpenLink() {
		const { data } = this.props;
		this.props.activityActions.goToWebsite(data.link);
	}

	onPressHelp = () => {
		const { data } = this.props;
		this.props.activityActions.replyCall(data);
	}

	onPressReminder(isEnabled, sound) {
		const { data } = this.props;

    // Case 1: enabled => remove reminder
    if (isEnabled) {
      this.props.chillRemindersActions.removeReminder(data);
    }
    // Case 2: disabled => show form
    else {
      this.props.chillRemindersActions.selectObject(data, sound);
    }
	}
}

FeedCell.propTypes = propTypes;
FeedCell.styles = StyleSheet.create(styles);

export default connect(state => ({
		isAppActive					  : state.app.is_app_active,
		schoolId						  : state.app.school.id,
		isStressbustersHidden	: state.app.school.is_me_stressbusters_hidden,
		isNewInstall				  : state.app.is_new_install,
		enabledReminders	    : state.chillReminders.enabled_reminders,
	}),
	dispatch => ({
		chillRemindersActions : bindActionCreators(chillRemindersActions, dispatch),
		activityActions	  		: bindActionCreators(activityActions, dispatch),
	})
)(FeedCell);
