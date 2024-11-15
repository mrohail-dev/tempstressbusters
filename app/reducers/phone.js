import * as types from '../actions/action-types';

const initialState = {
	is_loading					: false,
	data								: null,
};

export default function tool(state = initialState, action = {}) {
  switch (action.type) {

    case types.PHONE_FEED_LOAD:
			return {...state,
				is_loading: true,
			};

    case types.PHONE_FEED_LOADED:
			return {...state,
				is_loading: false,
        data: action.data,
			};

    case types.PHONE_FEED_UPDATED:
      // Note: need to re-create 'All' array so components subscribed to the array will
      // receive new props. Otherwise, the array address is the same.

			return {...state,
				is_loading: false,
        data: JSON.parse(JSON.stringify(action.data)),
			};

    default:
      return state;
  }

}

