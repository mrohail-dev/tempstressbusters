import { Platform } from 'react-native';
import AnalyticsLib from '../libs/analytics-lib';
import RNCommunications from 'react-native-communications';
import { NativeModules } from 'react-native';
import * as strings from '../../config/strings';
import * as shareLib from '../libs/share-lib';
import * as rewardActions from '../actions/reward-actions';
const { RNCalendarEvents } = NativeModules;

export function shareFacebook(object) {
	AnalyticsLib.trackObject('Share', object, {type: 'facebook'});

	return async(dispatch, getState) => {
		const text = shareLib.getShareMessage(object);
		const link = shareLib.getShareUrl(object);
		const imageLink = getImageLink(object);
		shareLib.facebook(text, link, imageLink, () => {
      dispatch(rewardActions.earnViaShare());
    });
	}
}

export function shareTwitter(object) {
	AnalyticsLib.trackObject('Share', object, {type: 'twitter'});

	return async(dispatch, getState) => {
		const text = shareLib.getShareMessage(object);
		const link = shareLib.getShareUrl(object);
		const imageLink = getImageLink(object);
		shareLib.twitter(text, link, imageLink, () => {
      dispatch(rewardActions.earnViaShare());
    });
	}
}

export function shareSms(object) {
	AnalyticsLib.trackObject('Share', object, {type: 'sms'});

	const link = shareLib.getShareUrl(object);
	const bodyPrefix = (Platform.OS === 'ios') ? ';body=' : '?body=';

	let content = '';
	content += object.content ? (bodyPrefix + object.content) : '';
	content += link ? (' - ' + link) : '';

	return async(dispatch, getState) => {
		RNCommunications.text(null, content);
	}
}

export function shareEmail(object) {
	AnalyticsLib.trackObject('Share', object, {type: 'email'});

	const link = shareLib.getShareUrl(object);

	let content = '';
	content += object.content ? (object.content + '\n') : '';
	content += link;

	return async(dispatch, getState) => {
		RNCommunications.email([], null, null, object.title, content);
	}
}

export function replySms(object) {
	const number = object.phone;
	return async(dispatch, getState) => {
		RNCommunications.text(number);
	}
}

export function replyCall(object) {
	AnalyticsLib.trackObject('Call', object, {number: object.phone});

	return async(dispatch, getState) => {
		RNCommunications.phonecall(object.phone, true);
	}
}

export function replyEmail(object) {
	const title = 'RE: ' + object.title;
	const email = object.email;

	return async(dispatch, getState) => {
		RNCommunications.email([email], null, null, title, '');
	}
}


export function linkToCalendar(object, alarmDate) {
	return async(dispatch, getState) => {
		const  offset = new Date().getTimezoneOffset();

		RNCalendarEvents.authorizeEventStore(({status}) => {
			if (status != 'authorized') { return; }

			let startDate = new Date(object.start_date * 1000);
			let endDate = startDate;
			let startEndTimes = object.start_time
				? object.start_time.split('-')
				: [];
      let alarms = (alarmDate == null)
        ? []
        : [{date: alarmDate}];
			if (startEndTimes.length == 2) {
				// break down date
				const year = startDate.getFullYear();
				const month = ("0" + (startDate.getMonth() + 1)).slice(-2);
				const day = ("0" + startDate.getDate()).slice(-2);
				const prefix = year + '-' + month + '-' + day;
				const startDateISO = new Date(prefix + ' ' + startEndTimes[0] + ':00');
				const endDateISO = new Date(prefix + ' ' + startEndTimes[1] + ':00');
				if (startDateISO != 'Invalid Date' && endDateISO != 'Invalid Date') {
					startDate = startDateISO;
					endDate = endDateISO;
				}
			}

			RNCalendarEvents.saveEvent(getCalendarTitle(object), {
				location: object.location_name,
				notes: object.content,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
        alarms: alarms,
			});
		});
	}
}

export function linkToMap(object) {
	const link = (object.address)
		? 'http://maps.apple.com/?q=' + encodeURIComponent(object.address)
		: 'http://maps.apple.com/?ll=' + object.location_latitude + ',' + object.location_longitude;

	return async(dispatch, getState) => {
		RNCommunications.web(link);
	}
}

export function goToWebsite(link) {
	return async(dispatch, getState) => {
		RNCommunications.web(link);
	}
}

export function sendUsEmail() {
	return async(dispatch, getState) => {
		RNCommunications.email(['info@thestresscoach.com '], null, null, '', '');
	}
}

export function submitResource(object) {
	return async(dispatch, getState) => {
		let subject;
		switch (object.type) {
			case strings.OBJECT_TYPE_PHOTO:
				subject = 'Submitting Photo';
				break;
			case strings.OBJECT_TYPE_VIDEO:
				subject = 'Submitting Video Link';
				break;
		}
		RNCommunications.email(['info@thestresscoach.com '], null, null, subject, '');
	}
}


//////////////
// Function //
//////////////

function getImageLink(object) {
	return object.image_link ? object.image_link : '';
}

function getCalendarTitle(object) {
	if (object.type == strings.OBJECT_TYPE_CALLBACK) {
		return 'CAPS Call Back';
	}

	return object.title;
}
