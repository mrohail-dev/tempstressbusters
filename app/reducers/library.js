import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const initialState = {
	is_loading: false,
	data: {},
	libraries: [],
	filter: undefined,
	filters: [],
};

export default function library(state = initialState, action = {}) {
	switch (action.type) {

		case types.LIBRARY_SELECT_FILTER:
			return {
				...state,
				filter: action.filter,
			};

		case types.LIBRARY_FEED_LOAD: {
			console.log("action.libraries", action.libraries);
			const filters = action.libraries.map(library => library.title);
			const data = action.libraries.map(library => []);
			return {
				...state,
				is_loading: true,
				libraries: action.libraries,
				filters: filters,
				filter: filters[0],
				data: data,
			};
		}

		case types.LIBRARY_FEED_LOADED: {
			const data = { ...state.data };
			console.log("library feed loaded", data)
			state.libraries.forEach((library) => {
				const filter = library.title;
				data[filter] = action.response[library.id] || [];
			});

			return {
				...state,
				data,
				is_loading: false,
			};
		}

		default:
			return state;
	}
}
