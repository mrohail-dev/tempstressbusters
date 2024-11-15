import * as types from './action-types';
import * as apiClient from '../libs/api-client';

export function loadFeed(filter) {
	return async(dispatch, getState) => {
		const schoolId = getState().app.school.id;
		const path = 'get_photos';
		dispatch(requestFeed(getState().app.school.photo_categories));
		const response = await apiClient.get(path, schoolId);
		dispatch(receivedFeed(filter, response));
	};
}

export function requestFeed(filters) {
  return {
    type		: types.CHILL_PHOTOS_FEED_LOAD,
		filters	: filters,
  };
}

export function receivedFeed(filter, response) {
  return {
    type		: types.CHILL_PHOTOS_FEED_LOADED,
		filter	: filter,
		response: response,
  };
}

export function selectFilter(filter) {
  return {
    type		: types.CHILL_PHOTOS_SELECT_FILTER,
		filter	: filter,
  };
}
