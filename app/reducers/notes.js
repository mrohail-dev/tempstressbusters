import * as types from '../actions/action-types';
import * as strings from '../../config/strings';
import * as constants from '../../config/constants';

const initialState = {
	is_loading					: false,
	is_instruction_shown: false,
	data								: [],
	dataByFilter				: {},
	filters							: [
    constants.NOTE_TYPES.Note.category,
    constants.NOTE_TYPES.Journal.category,
    constants.NOTE_TYPES.Goal.category,
    constants.NOTE_TYPES.Resource.category,
  ],
};

export default function tool(state = initialState, action = {}) {
  switch (action.type) {

    case types.NOTES_FEED_LOAD:
			return {...state,
				is_loading: true,
			};

    case types.NOTES_FEED_LOADED:
      const dataByFilter = {};

			// initialize data arrays
			state.filters.forEach((filter) => {
				dataByFilter[filter] = [];
			});

			// populate data arrays
			action.data.forEach((object) => {
				object.categories.forEach((category) => {
					dataByFilter[category] && dataByFilter[category].push(object);
				});
			});

			return {...state,
				is_loading    : false,
        data          : action.data,
        dataByFilter  : JSON.parse(JSON.stringify(dataByFilter)),
			};

    case types.NOTES_INSTRUCTION_LOADED:
			return {...state,
				is_instruction_shown: action.is_shown,
			};

    default:
      return state;
  }

}

