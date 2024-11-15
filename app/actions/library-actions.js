import * as types from './action-types';
import * as apiClient from '../libs/api-client';

export function loadFeed(libraryFeature) {
	return async(dispatch, getState) => {
    // initialize filters
		const libraries = getState().app.school[libraryFeature];
		dispatch({
      type		  : types.LIBRARY_FEED_LOAD,
      libraries : libraries,
    });

    // load feed
		const path = 'get_library_items_all';
		const schoolId = getState().app.school.id;
		const response = await apiClient.getWithParams(path, { school_id:schoolId, libraryFeature });
		dispatch({
      type		: types.LIBRARY_FEED_LOADED,
      response: response,
    });
	};
}

export function selectFilter(filter) {
  return {
    type		: types.LIBRARY_SELECT_FILTER,
		filter	: filter,
  };
}
