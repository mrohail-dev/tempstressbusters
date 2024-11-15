import * as types from '../actions/action-types';
// import * as routes from 'Stressbusters/app/routes/routes';

const initialState = {
	is_loading					: false,
	data								: {},
	filter							: 'All',
	filters							: [
		'All',
		'<5m',
		'Popular',
		'Guided',
		'Music',
		'Focus',
		'Sleep',
	],
};

export default function tool(state = initialState, action = {}) {
  switch (action.type) {

    case types.AUDIOS_SELECT_FILTER:
			return {...state,
				filter		: action.filter,
			};

    case types.AUDIOS_FEED_LOAD:
			return {...state,
				is_loading: true,
			};

    case types.AUDIOS_FEED_LOADED: {
			const data = { ...state.data };
			// Initialize data arrays
			state.filters.forEach((filter) => {
				data[filter] = [];
			});

			// Populate data arrays
			action.response.forEach((object) => {
				data['All'].push(object);
        // populate 'category' filters
				object.categories.forEach((category) => {
					data[category] && data[category].push(object);
				});
        // populate 'length' filters
        if (object.length) {
          const length = object.length.match(/^\d*:\d*(:\d*)?/);
          if (length && length[0]) {
            const parts = length[0].split(':');
            const lengthInSec = (parts.length === 2)
              ? parseInt(parts[0]) * 60 + parseInt(parts[1])
              : parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
            if (lengthInSec <= 300) {
              data['<5m'].push(object);
            }
          }
        }
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
