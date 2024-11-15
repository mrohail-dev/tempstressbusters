import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const initialState = {
	is_loading					: false,
	data								: {},
	filter							: 'All',
	filters							: ['All'],
};

export default function tool(state = initialState, action = {}) {
  switch (action.type) {

    case types.CHILL_LINKS_SELECT_FILTER:
			return {...state,
				filter		: action.filter,
			};

    case types.CHILL_LINKS_FEED_LOAD:
			return {...state,
				is_loading: true,
				filters			: [...state.filters, ...action.filters],
			};

    case types.CHILL_LINKS_FEED_LOADED: {
			const data = { ...state.data };
			// initialize data arrays
			state.filters.forEach((filter) => {
				data[filter] = [];
			});

			// populate data arrays
			action.response.forEach((object) => {
				data['All'].push(object);
				object.categories.forEach((category) => {
					if (data[category]) {
						data[category].push(object);
					}
				});
			});

			return {...state,
				data,
				is_loading: false,
			};
		}

    default:
      return state;
  }
}
