import * as types from './action-types';
import * as apiClient from '../libs/api-client';

export function loadFeed() {
	return async(dispatch, getState) => {
		const schoolId = getState().app.school.id;
		const path = 'get_helps';
		dispatch(requestFeed());
		const response = await apiClient.get(path, schoolId);
		dispatch(receivedFeed(response));
	};
}

export function requestFeed() {
  return {
    type		: types.HELP_FEED_LOAD,
  };
}

export function receivedFeed(response) {
  return {
    type		: types.HELP_FEED_LOADED,
		response: response,
  };
}
