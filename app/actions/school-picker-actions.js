import AsyncStorage from '@react-native-async-storage/async-storage';
import * as types from './action-types';
import * as apiClient from '../libs/api-client';
import * as appActions from '../actions/app-actions';

export function load() {
	return async(dispatch, getState) => {
		const path = 'get_schools';
		const response = await apiClient.get(path);
		dispatch(received(response));
	};
}

export function received(response) {
  return {
    type		: types.SCHOOL_PICKER_LOADED,
		response: response,
  };
}

export function select(schoolId) {
  return {
    type		: types.SCHOOL_PICKER_SELECT,
		schoolId: schoolId,
  };
}

export function confirm(schoolId) {
	return async(dispatch, getState) => {
		AsyncStorage.setItem('schoolId', schoolId, () => {});
		dispatch(appActions.loadSchoolWithSchoolId(schoolId));
	};
}
