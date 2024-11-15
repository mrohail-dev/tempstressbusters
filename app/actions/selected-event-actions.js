import * as apiClient from '../libs/api-client';
import * as types from './action-types';

export function select(object) {
  return {
    type: types.SELECTED_EVENT_SELECT,
		object: object,
  };
}

export function cancel() {
  return {
    type: types.SELECTED_EVENT_CANCEL
  };
}

export function signup(object, values) {
	return async(dispatch, getState) => {
		// signup
		const path = 'signup_event';
		const response = await apiClient.post(path, {...values, event_id:object.id});

		// dispatch
		dispatch(signedup());
	};
}

export function signedup() {
  return {
    type: types.SELECTED_EVENT_SIGNEDUP,
  };
}
