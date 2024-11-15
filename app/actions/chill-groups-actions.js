import * as types from './action-types';
import * as apiClient from '../libs/api-client';

export function loadFeed(filter) {
	return async(dispatch, getState) => {
		const schoolId = getState().app.school.id;
		const path = 'get_groups';
		dispatch(requestFeed());
		const response = await apiClient.get(path, schoolId);
		dispatch(receivedFeed(filter, response));
	};
}

export function requestFeed() {
  return {
    type		: types.CHILL_GROUPS_FEED_LOAD,
  };
}

export function receivedFeed(filter, response) {
  return {
    type		: types.CHILL_GROUPS_FEED_LOADED,
		filter	: filter,
		response: response,
  };
}

export function selectFilter(filter) {
  return {
    type		: types.CHILL_GROUPS_SELECT_FILTER,
		filter	: filter,
  };
}
