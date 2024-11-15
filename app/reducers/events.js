import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const defaultFilters = [
	'All',
	'Today',
	'This Week',
];
const initialState = {
	is_loading					: false,
	data								: {},
	filter							: 'All',
	filters							: defaultFilters,
};

export default function tool(state = initialState, action = {}) {
  switch (action.type) {
    case types.EVENTS_SELECT_FILTER:
			return {...state,
				filter		: action.filter,
			};

    case types.EVENTS_FEED_LOAD:
			return {...state,
				is_loading: true,
			};

    case types.EVENTS_FEED_LOADED:
			let eventsAll = action.response;
			let eventsToday = [];
			let eventsWeek = [];
			let eventsLocations = {};
			const nowDate = new Date()
			const nowDay = nowDate.getDate();

			eventsAll.forEach((event) => {
				// fill up events by date
				const eventDate = new Date(event.start_date * 1000)
				const eventDay = eventDate.getDate();
				const diff = event.start_date - nowDate / 1000;
				if (diff < 0) {
				}
				else if (diff < 86400 && nowDay == eventDay) {
					eventsToday.push(event);
				}
				else if (diff < 604800) {
					eventsWeek.push(event);
				}
				// fill up events by campus
				event.categories.forEach((category) => {
					eventsLocations[category] = eventsLocations[category] || [];
					eventsLocations[category].push(event);
				});
			});

			const data = {...state.data, ...eventsLocations};
			data['All'] = eventsAll;
			data['Today'] = eventsToday;
			data['This Week'] = eventsWeek;
			const filters = [...defaultFilters, ...Object.keys(eventsLocations)];

			return {...state,
				data,
				filters,
				is_loading: false,
			};

    default:
      return state;
  }
}
