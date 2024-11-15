import * as types from './action-types';
import * as strings from '../../config/strings';
import * as apiClient from '../libs/api-client';
import * as alertLib from '../libs/alert-lib';
import * as rewardActions from '../actions/reward-actions';

const appRewards = [
  {
    type    : strings.OBJECT_TYPE_REWARD_EARN,
    title   : 'Open The App',
    point   : 25,
    content : 'Just launch the app and earn 25 Health Rewards each time you do it as long as two hours have passed since your last open. It’s that easy!',
  },
  {
    type    : strings.OBJECT_TYPE_REWARD_EARN,
    title   : 'Favorite App Content',
    point   : 10,
    content : 'Star app content to put it on your My Favorites screen for one-tap access when you need it. And get 10 Health Rewards when you do it.',
  },
  {
    type    : strings.OBJECT_TYPE_REWARD_EARN,
    title   : 'Share App Content',
    point   : 10,
    content : 'Share quotes, videos, photos and more to social media and with friends. Sharing is caring and you’ll get 10 Health Rewards for your kindness.',
  },
  {
    type    : strings.OBJECT_TYPE_REWARD_EARN,
    title   : 'Listen to Sonic Spa Tracks',
    point   : 50,
    content : 'Earn 50 Health Rewards for listening to Go Coastal, Quick Calm, Meditation Coach and any other Sonic Spa track for at least one minute.',
  },
  {
    type    : strings.OBJECT_TYPE_REWARD_EARN,
    title   : 'Watch Videos',
    point   : 50,
    content : 'Watch chill, how-to and inspiring videos on the app’s Home feed or Videostream for at least one minute and you’ll earn 50 Health Rewards.',
  },
  {
    type    : strings.OBJECT_TYPE_REWARD_EARN,
    title   : 'Use Breather',
    point   : 50,
    content : 'Inhale and exhale with the orb, or just focus on it for one minute or more, and you’ll score 50 Health Rewards in the process.',
  },
  {
    type    : strings.OBJECT_TYPE_REWARD_EARN,
    title   : 'Set Reminders',
    point   : 10,
    content : 'Get 10 Health Rewards when you set and receive one or more reminders from our ever-growing list of wellness-enhancing activities.',
  },
  {
    type    : strings.OBJECT_TYPE_REWARD_EARN,
    title   : 'Checkoff Goals',
    point   : 20,
    content : 'Exercise? Cut down on sugar? Use the app daily? Whatever the goal, complete and check it off in My Notes and you’ll earn 20 Health Rewards.',
  },
];

export function loadFeed(filter) {
	return async(dispatch, getState) => {
		const schoolId = getState().app.school.id;
		let path = '';
		switch (filter) {
			case 'Earn':
				path = 'get_reward_earns';
				break;
			case 'Spend':
				path = 'get_reward_spends';
				break;
			case 'Scan':
			case 'Give':
				dispatch(receivedFeed(filter, []));
				return;
		}

		dispatch(requestFeed());
		const response = await apiClient.get(path, schoolId);
    (filter == 'Earn')
      ? (getState().app.school.is_me_rewards_hidden
          ? dispatch(receivedFeed(filter, appRewards))
          : dispatch(receivedFeed(filter, response.concat(appRewards)))
        )
      : dispatch(receivedFeed(filter, response));
	};
}

export function requestFeed() {
  return {
    type		: types.CHILL_REWARDS_FEED_LOAD,
  };
}

export function receivedFeed(filter, response) {
  return {
    type		: types.CHILL_REWARDS_FEED_LOADED,
		filter	: filter,
		response: response,
  };
}

export function addGiveFilter() {
  return {
    type		: types.CHILL_REWARDS_ADD_GIVE_FILTER,
  };
}

export function selectFilter(filter) {
  return {
    type		: types.CHILL_REWARDS_SELECT_FILTER,
		filter	: filter,
  };
}

export function processScan(code) {
	return async(dispatch, getState) => {
		dispatch(processScanStarted());

		const schoolId = getState().app.school.id;
		const response = await apiClient.getWithParams('get_reward', {
			school_id: schoolId,
			reward_id: code,
		});
		if (response && response.type && response.point) {
			// Case 1: earning point
			if (response.type == strings.OBJECT_TYPE_REWARD_EARN) {
				const id = response.id;
				const point = response.point_value;
				// Case 1a: earned already
				if (getState().rewards.earned_ids.indexOf(response.id) >= 0) {
					const msg = 'Already earned this reward.';
					dispatch(processScanFailed(msg));
				}
				// Case 1b: earn
				else {
					const msg = 'Reward earned.';
					dispatch(rewardActions.earn(response, point));
					dispatch(processScanSucceeded(msg));
				}
				return;
			}
			// Case 2:  spending point
			else if (response.type == strings.OBJECT_TYPE_REWARD_SPEND) {
				const id = response.id;
				const point = response.point_value;
				// Case 2a: redeemed already
				if (getState().rewards.spent_ids.indexOf(response.id) >= 0) {
					const msg = 'Already redeem this reward.';
					dispatch(processScanFailed(msg));
				}
				// Case 2b: not enough points
				else if (point > getState().rewards.points) {
					const msg = 'Not enough point to redeem this reward. ' + point + ' points required.';
					dispatch(processScanFailed(msg));
				}
				// Case 2c: redeam
				else {
					const msg = 'Reward redeemed.';
					dispatch(rewardActions.spend(response, point));
					dispatch(processScanSucceeded(msg));
				}
				return;
			}
		}

		dispatch(processScanFailed('QR code not recognized.'));
	};
}

export function processScanStarted() {
  return {
    type		: types.CHILL_REWARDS_SCAN_STARTED,
  };
}

export function processScanSucceeded(msg) {
  return {
    type		: types.CHILL_REWARDS_SCAN_SUCEEDED,
		msg			: msg,
  };
}
export function processScanFailed(msg) {
  return {
    type		: types.CHILL_REWARDS_SCAN_FAILED,
		msg			: msg,
  };
}

export function processScanRetry() {
  return {
    type		: types.CHILL_REWARDS_SCAN_RETRY,
  };
}

