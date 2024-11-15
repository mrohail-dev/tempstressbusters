import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const initialState = {
	is_loading					: false,
	data								: [],
};

export default function chillCallbacks(state = initialState, action = {}) {
  switch (action.type) {

    case types.CHILL_CALLBACKS_FEED_LOAD:
			return {...state,
				is_loading: true,
			};

    case types.CHILL_CALLBACKS_FEED_LOADED:
			return {...state,
				is_loading: false,
				data:action.response
			};

    case types.CALLBACK_BOOKED:
			let data = [];

			for (let key in state.data){
				if (state.data[key].id == action.object.id) {
					data.push(action.object);
				}
				else {
					data.push(state.data[key]);
				}
			}
			return {...state,
				data:data
			};

    default:
      return state;
  }
}
