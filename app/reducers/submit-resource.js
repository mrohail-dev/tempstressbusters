import * as types from '../actions/action-types';

const initialState = {
	object						: null,
};

export default function selectedPhoto(state = initialState, action = {}) {
  switch (action.type) {

    case types.SUBMIT_INSTRUCTION_SHOW:
			return {...state,
				object: action.object
			};

    case types.SUBMIT_INSTRUCTION_HIDE:
			return {...state,
				object: null
			};

    default:
      return state;
  }
}
