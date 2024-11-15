import * as types from '../actions/action-types';

const initialState = {
	selected						: false,
};

export default function breath(state = initialState, action = {}) {
  switch (action.type) {

    case types.BREATH_SELECT:
			return {...state,
				selected: true,
			};

    case types.BREATH_CLOSE:
			return {...state,
				selected: false,
			};

    default:
      return state;
  }
}
