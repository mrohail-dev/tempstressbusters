import * as types from '../actions/action-types';

const initialState = {
	object						: null,
};

export default function selectedEvent(state = initialState, action = {}) {
  switch (action.type) {

    case types.SELECTED_EVENT_SELECT:
			return {...state,
				object: action.object,
			};

    case types.SELECTED_EVENT_CANCEL:
			return {...state,
				object: null,
			};

    case types.SELECTED_EVENT_SIGNEDUP:
			return {...state,
				object: null,
			};

    default:
      return state;
  }
}
