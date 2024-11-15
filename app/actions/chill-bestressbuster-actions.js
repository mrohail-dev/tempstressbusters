import AsyncStorage from '@react-native-async-storage/async-storage';
import * as alertLib from '../libs/alert-lib';
import * as apiClient from '../libs/api-client';
import * as types from './action-types';

export function selectFilter(filter) {
  return {
    type		: types.CHILL_BESTRESSBUSTER_SELECT_FILTER,
		filter	: filter,
  };
}

export function signup(values) {
	return async(dispatch, getState) => {
		// signup
		const path = 'signup_volunteer';
		const questions = getState().chillBeStressbuster.questions;
		const answers = [values.q1, values.q2, values.q3, values.q4, values.q5];
		const response = await apiClient.post(path, {
			schoolId			: getState().app.school.id,
			fullName			: values.fullName,
			preferredName	: values.preferredName,
			email					: values.email,
			password			: values.password,
			phone					: values.phone,
			questions			: JSON.stringify(questions),
			answers				: JSON.stringify(answers),
		});

		// dispatch
		if (response.error) {
			alertLib.showError(response.message);
		}
		else {
			AsyncStorage.setItem('userId', response.id, () => {});
			alertLib.showSignedUpSuccess();
			dispatch(signedUp(response));
		}
	};
}

export function signedUp(response) {
  return {
    type: types.CHILL_BESTRESSBUSTER_SIGNEDUP,
		user: response
  };
}

export function updateBottomInset(height) {
  return {
    type: types.CHILL_BESTRESSBUSTER_UPDATE_BOTTOM_INSET,
		height: height
  };
}
