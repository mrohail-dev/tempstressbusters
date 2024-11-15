import AsyncStorage from '@react-native-async-storage/async-storage';
import AnalyticsLib from '../libs/analytics-lib';
import * as types from './action-types';

export function loadFeed() {
	return async(dispatch, getState) => {
		dispatch({
      type  : types.PHONE_FEED_LOAD,
    });

    // load feed
		AsyncStorage.getItem('phoneFriends', (err, result) => {
			result = result ? JSON.parse(result) : [];
      dispatch({
        type  : types.PHONE_FEED_LOADED,
        data  : result,
      });
		});
	};
}

export function addFriend(object) {
	AnalyticsLib.trackObject('AddFriend', object);

	return async(dispatch, getState) => {
		// update objects
		const objects = getState().phone.data;
		const index = getIndex(objects, object);
		if (index >= 0) {
			objects.splice(index, 1);
		}
		objects.push(object);

		// dispatch
		dispatch(handleUpdated(objects));

		// store
		AsyncStorage.setItem('phoneFriends', JSON.stringify(objects), () => {});
	};
}

export function removeFriend(object) {
	AnalyticsLib.trackObject('RemoveFriend', object);

	return async(dispatch, getState) => {
		// update objects
		const objects = getState().phone.data;
		const index = getIndex(objects, object);
		if (index >= 0) {
			objects.splice(index, 1);
		}

		// dispatch
		dispatch(handleUpdated(objects));

		// store
		AsyncStorage.setItem('phoneFriends', JSON.stringify(objects), () => {});
	};
}

export function handleUpdated(objects) {
  return {
    type: types.PHONE_FEED_UPDATED,
		data: objects
  };
}

function getIndex(objects, object) {
	return objects.findIndex((per, index) => {
		if (per.recordId == object.recordId) {
			return true;
		}
		return false;
	});
}
