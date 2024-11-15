import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const initialState = {
  is_modal_shown: false,
  is_loading_from_disk: false,
  is_loading_use_code: false,
  access_code: undefined,
  error_message: null,
};

export default function tool(state = initialState, action = {}) {
  switch (action.type) {
    case types.ACCESS_CODE_USE_LOADING:
      return {...state, is_loading_use_code: true, error_message: null};

    case types.ACCESS_CODE_USE_SUCCESS:
      return {
        ...state,
        is_loading_use_code: false,
        access_code: action.code,
        is_modal_shown: false,
      };

    case types.ACCESS_CODE_SHOW_MODAL:
      return {...state, is_modal_shown: true};

    case types.ACCESS_CODE_HIDE_MODAL:
      return {...state, is_modal_shown: false};

    case types.ACCESS_CODE_USE_ERROR:
      return {
        ...state,
        is_loading_use_code: false,
        error_message: action.message,
      };

    case types.ACCESS_CODE_LOADING_FROM_DISK:
      return {...state, is_loading_from_disk: true};

    case types.ACCESS_CODE_LOADED_FROM_DISK:
      return {...state, is_loading_from_disk: false, access_code: action.code};

    case types.ACCESS_CODE_VALIDATION_ERROR:
      return {...state, access_code: undefined};

    default:
      return state;
  }
}
