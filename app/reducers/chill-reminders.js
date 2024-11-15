import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const initialState = {
	is_loading: false,
	data: {},
	filter: 'All',
	filters: [
		'All',
		'Actions',
		'Affirmations',
		'Energy',
		'Mood',
		'Muscle Tension',
		'Anxiety',
		'Sleep',
	],
	selected_object: null,
	selected_sound: null,
	enabled_reminders: [],
	enabled_reminder_ids: [],
	enabled_reminder_times: [],
};

export default function tool(state = initialState, action = {}) {
	switch (action.type) {

		case types.CHILL_REMINDERS_SELECT_FILTER:
			return {
				...state,
				filter: action.filter,
			};

		case types.CHILL_REMINDERS_FEED_LOAD:
			return {
				...state,
				is_loading: true,
			};

		case types.CHILL_REMINDERS_FEED_LOADED: {
			// sort enabled first
			const _data = action.response.sort((a, b) => {
				const aEnabled = state.enabled_reminder_ids.indexOf(a.id) > -1;
				const bEnabled = state.enabled_reminder_ids.indexOf(b.id) > -1;
				if (aEnabled == bEnabled) {
					return 0;
				}
				else if (aEnabled) {
					return -1;
				}
				return 1;
			});

			const data = { ...state.data };
			// initialize data arrays
			state.filters.forEach((filter) => {
				data[filter] = [];
			});

			// populate data arrays
			action.response.forEach((object) => {
				data['All'].push(object);
				object.categories.forEach((category) => {
					data[category] && data[category].push(object);
				});
			});

			return {
				...state,
				data,
				is_loading: false,
			};
		}

		case types.CHILL_REMINDERS_ENABLED_UPDATED:
			const ids = action.reminders.map(reminder => (reminder.object.id));

			return {
				...state,
				enabled_reminders: action.reminders,
				enabled_reminder_ids: ids,
				enabled_reminder_times: action.reminderTimes,
			};

		case types.CHILL_REMINDERS_SELECT_OBJECT:
			return {
				...state,
				selected_object: action.object,
				selected_sound: action.sound,
			};

		case types.CHILL_REMINDERS_DESELECT_OBJECT:
			return {
				...state,
				selected_object: null,
			};

		default:
			return state;
	}
}

