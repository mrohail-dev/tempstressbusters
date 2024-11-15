import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const initialState = {
	is_loading							: true,
	selected								: null,
	schools									: [],
};

export default function tool(state = initialState, action = {}) {
  switch (action.type) {

    case types.SCHOOL_PICKER_LOADED:
			return {...state,
				is_loading	: false,
				schools			: action.response,
			};

    case types.SCHOOL_PICKER_SELECT:
			return {...state,
				selected		: action.schoolId,
			};

    default:
      return state;
  }
}
