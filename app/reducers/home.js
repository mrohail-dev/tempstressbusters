import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const initialState = {
	is_loading					: false,
	data								: {},
	filter							: 'All',
	filters							: [
		'All',
		'Messages',
		'Videos',
		'Audio',
		'Photos',
	],
};

export default function tool(state = initialState, action = {}) {
  switch (action.type) {

    case types.HOME_SELECT_FILTER:
			return {...state,
				filter		: action.filter,
			};

    case types.HOME_FEED_LOAD:
			return {...state,
				is_loading: true,
			};

    case types.HOME_FEED_LOADED: {
			const data = { ...state.data };
			data[action.filter] = action.response;

			return {...state,
				data,
				is_loading: false,
			};
		}

    default:
      return state;
  }
}
