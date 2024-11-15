import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const initialState = {
  is_points_loaded    : false,
  is_earned_loaded    : false,
  is_spent_loaded     : false,
  is_donated_loaded   : false,
  is_faved_loaded     : false,
  is_goal_loaded      : false,
  is_lastactive_loaded: false,
	points							: 250,
	earned_ids					: [],
	spent_ids						: [],
	faved_ids						: [],
	goal_ids						: [],
	app_last_active_date: 0,
};

export default function meRewards(state = initialState, action = {}) {
  switch (action.type) {

    case types.REWARD_EARNED_UPDATED:
			return {...state,
        is_earned_loaded  : true,
				earned_ids        : action.ids,
			};

    case types.REWARD_SPENT_UPDATED:
			return {...state,
        is_spent_loaded   : true,
				spent_ids         : action.ids,
			};

    case types.REWARD_DONATED_UPDATED:
			return {...state,
        is_donated_loaded : true,
				donated_points    : action.data,
			};

    case types.REWARD_FAVED_UPDATED:
			return {...state,
        is_faved_loaded   : true,
				faved_ids         : action.ids,
			};

    case types.REWARD_GOAL_UPDATED:
			return {...state,
        is_goal_loaded    : true,
				goal_ids          : action.ids,
			};

    case types.REWARD_APPLASTACTIVE_UPDATED:
			return {...state,
        is_lastactive_loaded  : true,
				app_last_active_date  : action.date,
			};

    case types.REWARD_POINTS_UPDATED:
			return {...state,
        is_points_loaded  : true,
				points            : action.points,
			};

    default:
      return state;
  }
}
