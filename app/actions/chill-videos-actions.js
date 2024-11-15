import * as types from './action-types';
import * as apiClient from '../libs/api-client';

export function loadFeed(filter) {
	return async(dispatch, getState) => {
		const schoolId = getState().app.school.id;
		const path = 'get_youtube_videos';
		dispatch(requestFeed(getState().app.school.video_categories));
		const response = await apiClient.get(path, schoolId);
		dispatch(receivedFeed(filter, response));
	};
}

export function requestFeed(filters) {
  return {
    type		: types.CHILL_VIDEOS_FEED_LOAD,
		filters	: filters,
  };
}

export function receivedFeed(filter, response) {
  return {
    type		: types.CHILL_VIDEOS_FEED_LOADED,
		filter	: filter,
		response: response,
  };
}

export function selectFilter(filter) {
  return {
    type		: types.CHILL_VIDEOS_SELECT_FILTER,
		filter	: filter,
  };
}
