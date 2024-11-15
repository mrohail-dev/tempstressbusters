import AsyncStorage from '@react-native-async-storage/async-storage';
import * as alertLib from '../libs/alert-lib';
import * as apiClient from '../libs/api-client';
import * as types from './action-types';

export function loadFeed(filter) {
	return async (dispatch, getState) => {
		const schoolId = getState().app.school.id;
		let path = '';
		switch (filter) {
			case 'Messages':
				path = 'get_stressbuster_messages';
				break;
			case 'Event Signup':
				path = 'get_stressbuster_events';
				break;
			case 'Better Busting':
				path = 'get_stressbuster_videos';
				break;
		}

		dispatch(requestFeed());
		const response = await apiClient.get(path, schoolId);
		dispatch(receivedFeed(filter, response));
	};
}

export function requestFeed() {
	return {
		type: types.CHILL_AMSTRESSBUSTER_FEED_LOAD,
	};
}

export function receivedFeed(filter, response) {
	return {
		type: types.CHILL_AMSTRESSBUSTER_FEED_LOADED,
		filter: filter,
		response: response,
	};
}

export function selectFilter(filter) {
	return {
		type: types.CHILL_AMSTRESSBUSTER_SELECT_FILTER,
		filter: filter,
	};
}

export function login(values) {
	return async (dispatch, getState) => {
		// login
		const path = 'login_volunteer';
		const response = await apiClient.post(path, {
			email: values.email,
			password: values.password,
		});

		// dispatch
		if (response.error) {
			alertLib.showError(response.message);
		}
		else {
			AsyncStorage.setItem('userId', response.id, () => { });
			dispatch(loggedIn(response));
		}
	};
}

export function loggedIn(response) {
	return {
		type: types.CHILL_AMSTRESSBUSTER_LOGGEDIN,
		user: response
	};
}
