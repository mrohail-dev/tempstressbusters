import * as types from '../actions/action-types';
// import * as routes from 'Stressbusters/app/routes/routes';

const initialState = {
	is_loading					: false,
	data								: {},
	filter							: 'Messages',
	filters							: [
		'Messages',
		'Event Signup',
		'Better Busting',
	],
};

export default function chillAmStressbuster(state = initialState, action = {}) {
  switch (action.type) {

    case types.CHILL_AMSTRESSBUSTER_SELECT_FILTER:
			return {...state,
				filter		: action.filter,
			};

    case types.CHILL_AMSTRESSBUSTER_FEED_LOAD:
			return {...state,
				is_loading: true,
			};

    case types.CHILL_AMSTRESSBUSTER_FEED_LOADED: {
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
