import * as types from './action-types';
import * as apiClient from '../libs/api-client';

export function loadFeed(filter) {
	return async(dispatch, getState) => {
		const schoolId = getState().app.school.id;
		let path = '';
		switch (filter) {
			case 'All':
				path = 'get_home_feed';
				break;
			case 'Messages':
				path = 'get_home_feed_messages';
				break;
			case 'Videos':
				path = 'get_home_feed_youtube_videos';
				break;
			case 'Audio':
				path = 'get_home_feed_musics';
				break;
			case 'Photos':
				path = 'get_home_feed_photos';
				break;
			case 'Reminders':
				dispatch(receivedFeed(filter, []));
				return;
		}

		dispatch(requestFeed());
		const response = await apiClient.get(path, schoolId);
		dispatch(receivedFeed(filter, response));
	};
}

export function requestFeed() {
  return {
    type		: types.HOME_FEED_LOAD,
  };
}

export function receivedFeed(filter, response) {
  return {
    type		: types.HOME_FEED_LOADED,
		filter	: filter,
		response: response,
  };
}

export function selectFilter(filter) {
  return {
    type		: types.HOME_SELECT_FILTER,
		filter	: filter,
  };
}
