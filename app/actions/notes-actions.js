import AsyncStorage from '@react-native-async-storage/async-storage';
import AnalyticsLib from '../libs/analytics-lib';
import * as types from './action-types';
import * as rewardActions from '../actions/reward-actions';

export function loadFeed() {
	return async(dispatch, getState) => {
		dispatch({
      type  : types.NOTES_FEED_LOAD,
    });

    // load feed
		AsyncStorage.getItem('notes', (err, result) => {
			result = result ? JSON.parse(result) : [];
      dispatch({
        type  : types.NOTES_FEED_LOADED,
        data  : result,
      });
		});

    // load instruction state
		AsyncStorage.getItem('notesInstructionShown', (err, result) => {
      dispatch({
        type      : types.NOTES_INSTRUCTION_LOADED,
        is_shown  : result ? true : false,
      });
		});
	};
}

export function addNote(object) {
	AnalyticsLib.trackObject('AddNote', object);

	return async(dispatch, getState) => {
		// update objects
		const objects = getState().notes.data;
		const index = getIndex(objects, object);
		if (index >= 0) {
			objects.splice(index, 1);
		}
		objects.push(object);

		// dispatch
		dispatch(handleUpdated(objects));
	};
}

export function editNote(object) {
	AnalyticsLib.trackObject('editNote', object);

	return async(dispatch, getState) => {
		// update objects
		const objects = getState().notes.data;
		const index = getIndex(objects, object);
    objects[index].content = object.content;

		// dispatch
		dispatch(handleUpdated(objects));
	};
}

export function removeNote(object) {
	AnalyticsLib.trackObject('RemoveNote', object);

	return async(dispatch, getState) => {
		// update objects
		const objects = getState().notes.data;
		const index = getIndex(objects, object);
		if (index >= 0) {
			objects.splice(index, 1);
		}

		// dispatch
		dispatch(handleUpdated(objects));
	};
}

export function toggleGoal(object) {
	AnalyticsLib.trackObject('toggleGoal', object);

	return async(dispatch, getState) => {
		// update objects
		const objects = getState().notes.data;
		const index = getIndex(objects, object);
    objects[index].checked = ! objects[index].checked;

    // reward
    if (objects[index].checked) {
      dispatch(rewardActions.earnViaGoal(object.id));
    }

		// dispatch
		dispatch(handleUpdated(objects));
	};
}

export function markInstructionShown() {
	return async(dispatch, getState) => {
    AsyncStorage.setItem('notesInstructionShown', 'true', () => {});

    dispatch({
      type      : types.NOTES_INSTRUCTION_LOADED,
      is_shown  : true,
    });
	};
}

function handleUpdated(objects) {
  AsyncStorage.setItem('notes', JSON.stringify(objects), () => {});

  return {
    type  : types.NOTES_FEED_LOADED,
		data  : objects
  };
}

function getIndex(objects, object) {
	return objects.findIndex((per, index) => {
		if (per.id == object.id) {
			return true;
		}
		return false;
	});
}

