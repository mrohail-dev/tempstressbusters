import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const initialState = {
	is_loading					: false,
	data								: null,
};

export default function help(state = initialState, action = {}) {
  switch (action.type) {

    case types.HELP_FEED_LOAD:
			return {...state,
				is_loading: true,
			};

    case types.HELP_FEED_LOADED:
			return {...state,
				data: action.response,
				is_loading: false,
			};

    default:
      return state;
  }
}
