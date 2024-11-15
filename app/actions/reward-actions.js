import AsyncStorage from '@react-native-async-storage/async-storage';
import AnalyticsLib from '../libs/analytics-lib';
import * as types from './action-types';

////////////////////
// Load Functions //
////////////////////

export function loadPoints() {
	return async(dispatch, getState) => {
		AsyncStorage.getItem('rewardPoints', (err, result) => {
			result = result ? parseInt(result) : 250;
			dispatch(updatedPoints(result));

      // Note: need to handle app active reward when app first opens here. Need to handle after
      // points count and last active date are loaded
      if (getState().rewards.is_lastactive_loaded) {
        dispatch(earnViaAppActive());
      }
		});
	};
}

export function loadEarnedIds() {
	return async(dispatch, getState) => {
		AsyncStorage.getItem('earnedRewardIds', (err, result) => {
			result = result ? JSON.parse(result) : [];
			dispatch(updatedEarnedIds(result));
		});
	};
}

export function loadSpentIds() {
	return async(dispatch, getState) => {
		AsyncStorage.getItem('spentRewardIds', (err, result) => {
			result = result ? JSON.parse(result) : [];
			dispatch(updatedSpentIds(result));
		});
	};
}

export function loadDonatedPoints() {
	return async(dispatch, getState) => {
		AsyncStorage.getItem('donatedPoints', (err, result) => {
			result = result ? JSON.parse(result) : {};
			dispatch(updatedDonatedPoints(result));
		});
	};
}

export function loadFavIds() {
	return async(dispatch, getState) => {
		AsyncStorage.getItem('rewardFavIds', (err, result) => {
			result = result ? JSON.parse(result) : [];
			dispatch(updatedFavedIds(result));
		});
	};
}

export function loadGoalIds() {
	return async(dispatch, getState) => {
		AsyncStorage.getItem('rewardGoalIds', (err, result) => {
			result = result ? JSON.parse(result) : [];
			dispatch(updatedGoalIds(result));
		});
	};
}

export function loadAppLastActiveDate() {
	return async(dispatch, getState) => {
		AsyncStorage.getItem('rewardAppLastActiveDate', (err, result) => {
			result = parseInt(result) || 0;
			dispatch(updatedAppLastActiveDate(result));

      // Note: need to handle app active reward when app first opens here. Need to handle after
      // points count and last active date are loaded
      if (getState().rewards.is_points_loaded) {
        dispatch(earnViaAppActive());
      }
		});
	};
}

export function earn(object, point) {
	return async(dispatch, getState) => {
    const id = object.id;
		let points = getState().rewards.points;
		let ids = getState().rewards.earned_ids;

		// update ids
		points = points + point;
		if (ids.indexOf(id) < 0) {
			ids.push(id);
		}

		// dispatch
		dispatch(updatedPoints(points));
		dispatch(updatedEarnedIds(ids));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});
		AsyncStorage.setItem('earnedRewardIds', JSON.stringify(ids), () => {});

    AnalyticsLib.trackObject('Reward Earn', object, {channel: 'scan', point: point});
	};
}

export function earnViaFav(id) {
	return async(dispatch, getState) => {
    const point = 10;
		let points = getState().rewards.points;
		let ids = getState().rewards.faved_ids;

		// Validate: not fav'ed before
		if (ids.indexOf(id) >= 0) { return; }

		// update ids
    ids.push(id);
		points = points + point;

		// dispatch
		dispatch(updatedPoints(points));
		dispatch(updatedFavedIds(ids));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});
		AsyncStorage.setItem('rewardFavIds', JSON.stringify(ids), () => {});

    AnalyticsLib.track('Reward Earn', {object: id, channel: 'fav', point: point});
	};
}

export function earnViaAppActive() {
	return async(dispatch, getState) => {
    const point = 25;
		let points = getState().rewards.points;
		let lastDate = getState().rewards.app_last_active_date;
    const now = Date.now();

		// Validate: haven't opened in 2 hours
		if (now - lastDate < 7200000) { return; }

		// update ids
    lastDate = now;
		points = points + point;

		// dispatch
		dispatch(updatedPoints(points));
		dispatch(updatedAppLastActiveDate(lastDate));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});
		AsyncStorage.setItem('rewardAppLastActiveDate', lastDate.toString(), () => {});

    AnalyticsLib.track('Reward Earn', {channel: 'app active', point: point});
	};
}

export function earnViaAudioPlay() {
	return async(dispatch, getState) => {
    const point = 50;
		const points = getState().rewards.points + point;

		// dispatch
		dispatch(updatedPoints(points));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});

    AnalyticsLib.track('Reward Earn', {channel: 'audio playback', point: point});
	};
}

export function earnViaVideoPlay() {
	return async(dispatch, getState) => {
    const point = 50;
		const points = getState().rewards.points + point;

		// dispatch
		dispatch(updatedPoints(points));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});

    AnalyticsLib.track('Reward Earn', {channel: 'video playback', point: point});
	};
}

export function earnViaFocus() {
	return async(dispatch, getState) => {
    const point = 50;
		const points = getState().rewards.points + point;

		// dispatch
		dispatch(updatedPoints(points));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});

    AnalyticsLib.track('Reward Earn', {channel: 'focus', point: point});
	};
}

export function earnViaShare() {
	return async(dispatch, getState) => {
    const point = 20;
		const points = getState().rewards.points + point;

		// dispatch
		dispatch(updatedPoints(points));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});

    AnalyticsLib.track('Reward Earn', {channel: 'share', point: point});
	};
}

export function earnViaComment() {
	return async(dispatch, getState) => {
    const point = 20;
		const points = getState().rewards.points + point;

		// dispatch
		dispatch(updatedPoints(points));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});

    AnalyticsLib.track('Reward Earn', {channel: 'comment', point: point});
	};
}

export function earnViaBreath() {
	return async(dispatch, getState) => {
    const point = 50;
		const points = getState().rewards.points + point;

		// dispatch
		dispatch(updatedPoints(points));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});

    AnalyticsLib.track('Reward Earn', {channel: 'breather', point: point});
	};
}

export function earnViaReminder() {
	return async(dispatch, getState) => {
    const point = 10;
		const points = getState().rewards.points + point;

		// dispatch
		dispatch(updatedPoints(points));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});

    AnalyticsLib.track('Reward Earn', {channel: 'reminder', point: point});
	};
}

export function earnViaGoal(id) {
	return async(dispatch, getState) => {
    const point = 20;
		let points = getState().rewards.points;
		let ids = getState().rewards.goal_ids;

		// Validate: not in goal ids before
		if (ids.indexOf(id) >= 0) { return; }

		// update ids
    ids.push(id);
		points = points + point;

		// dispatch
		dispatch(updatedPoints(points));
		dispatch(updatedGoalIds(ids));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});
		AsyncStorage.setItem('rewardGoalIds', JSON.stringify(ids), () => {});

    AnalyticsLib.track('Reward Earn', {object: id, channel: 'goal', point: point});
	};
}

export function spend(object, point) {
	return async(dispatch, getState) => {
    const id = object.id;
		let points = getState().rewards.points;
		let ids = getState().rewards.spent_ids;

		// update ids
		points = points - point;
		if (ids.indexOf(id) < 0) {
			ids.push(id);
		}

		// dispatch
		dispatch(updatedPoints(points));
		dispatch(updatedSpentIds(ids));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});
		AsyncStorage.setItem('spentRewardIds', JSON.stringify(ids), () => {});

    AnalyticsLib.trackObject('Reward Spend', object, {channel: 'scan', point: point});
	};
}

export function give(donee, point) {
	return async(dispatch, getState) => {
    const id = donee.id;
		let points = getState().rewards.points;
		let donatedPoints = getState().rewards.donated_points;

		// update
		points = points - point;
    donatedPoints[donee.id] = (donatedPoints[donee.id] || 0) + point;

		// dispatch
		dispatch(updatedPoints(points));
		dispatch(updatedDonatedPoints(donatedPoints));

		// store
		AsyncStorage.setItem('rewardPoints', points.toString(), () => {});
		AsyncStorage.setItem('donatedPoints', JSON.stringify(donatedPoints), () => {});

    AnalyticsLib.trackObject('Reward Give', donee, {point: point});
	};
}


//////////////////////
// Update Functions //
//////////////////////

export function updatedPoints(points) {
  return {
    type	: types.REWARD_POINTS_UPDATED,
		points: points,
  };
}

export function updatedEarnedIds(ids) {
  return {
    type	: types.REWARD_EARNED_UPDATED,
		ids		: ids,
  };
}

export function updatedSpentIds(ids) {
  return {
    type	: types.REWARD_SPENT_UPDATED,
		ids		: ids,
  };
}

export function updatedDonatedPoints(data) {
  return {
    type	: types.REWARD_DONATED_UPDATED,
		data	: data,
  };
}

export function updatedFavedIds(ids) {
  return {
    type	: types.REWARD_FAVED_UPDATED,
		ids		: ids,
  };
}

export function updatedGoalIds(ids) {
  return {
    type	: types.REWARD_GOAL_UPDATED,
		ids		: ids,
  };
}

export function updatedAppLastActiveDate(date) {
  return {
    type	: types.REWARD_APPLASTACTIVE_UPDATED,
		date	: date,
  };
}

