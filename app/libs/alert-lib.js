import { Alert, Platform } from 'react-native';

export function showSignedUpSuccess() {
	Alert.alert(
		'Success',
		'You have signed up. Please wait for your school admin to approve your application.',
		[
			{text: 'OK'},
		]
	);
}

export function showAddToCalendarConfirm(callback) {
	Alert.alert(
		'Add this event to your calendar?',
		'',
		[
			{text:'Add', onPress:callback},
			{text:'Cancel'},
		]
	);
}

export function showGiveRewardPointsConfirm(orgName, points, callback) {
	Alert.alert(
		`Do you want to give ${points} of your Health Rewards to ${orgName}? If yes, THANK YOU!`,
		'',
		[
			{text:'Yes', onPress:callback},
			{text:'Cancel'},
		]
	);
}

export function showCalendarReminder(callback) {
  // iOS: show action sheet (alert can only show 3 buttons)
  if (Platform.OS === 'ios') {
    Alert.alert(
      'Add reminder for this event?',
      '',
      [
        {text:'None'              , onPress:() => { callback(null) }},
        {text:'At time of event'  , onPress:() => { callback(0) }},
        {text:'30 minutes before' , onPress:() => { callback(-30) }},
        {text:'1 hour before'     , onPress:() => { callback(-60) }},
        {text:'2 hours before'    , onPress:() => { callback(-120) }},
        {text:'1 day before'      , onPress:() => { callback(-1440) }},
        {text:'2 days before'     , onPress:() => { callback(-2880) }},
        {text:'1 week before'     , onPress:() => { callback(-10080) }},
      ],
    );
  }
  // Android: show alert
  else {
    Alert.alert(
      'Add reminder for this event?',
      '',
      [
        {text:'None'              , onPress:() => { callback(null) }},
        {text:'At time of event'  , onPress:() => { callback(0) }},
        {text:'30 minutes before' , onPress:() => { callback(-30) }},
        {text:'1 hour before'     , onPress:() => { callback(-60) }},
        {text:'2 hours before'    , onPress:() => { callback(-120) }},
        {text:'1 day before'      , onPress:() => { callback(-1440) }},
        {text:'2 days before'     , onPress:() => { callback(-2880) }},
        {text:'1 week before'     , onPress:() => { callback(-10080) }},
      ]
    );
  }
}

export function showPurchase(price, renewRate, callback) {
	Alert.alert(
		'Confirm Subscription',
    `Do you want to subscribe for full access to Calmcast? After a 2-week free trial, you will be charged ${price} ${renewRate} (you will be able to unsubscribe after the free trial).`,
		[
			{text:'Cancel'},
			{text:'Continue', onPress:callback},
		]
	);
}

export function showError(error) {
	Alert.alert(
		'Error',
		error,
		[
			{text: 'OK'},
		]
	);
}

