import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const initialState = {
  anonymoud_id: null,
  is_app_active: true,
  school: null,
  is_loading_school: false,
  is_new_install: null,
  last_version: null,
  user_id: null,
  previous_tab: routes.home().id,
  selected_tab: routes.home().id,
  selected_invisible_tab: null,
  selected_screen_route_id: null,
  selected_object: null,
  selected_object_mode: null,
  hud_component: null,
  // pinned objects
  pinned_audio: null,
  pinned_photo: null,
  pinned_voice: null,
  // next screen to navigate to when jumping (ie. clicking in rewards in nav bar)
  next_route_to_show: null,
  // tab components
  home_tab: null,
  chill_tab: null,
  reminder_tab: null,
  me_tab: null,
};

export default function tool(state = initialState, action = {}) {
  switch (action.type) {
    case types.APP_RESUME:
      return {...state, is_app_active: true};

    case types.APP_PAUSE:
      return {...state, is_app_active: false};

    case types.APP_DESTROY:
      return {...state, is_app_active: false};

    case types.APP_SELECT_TAB:
      return {
        ...state,
        selected_tab: action.tab,
        selected_invisible_tab: null,
        selected_screen_route_id: null,
      };

    case types.APP_SELECT_INVISIBLE_TAB:
      return {
        ...state,
        selected_tab: null,
        selected_invisible_tab: action.tab,
        selected_screen_route_id: null,
      };

    case types.APP_SELECT_SCREEN:
      return {...state, selected_screen_route_id: action.routeId};

    case types.APP_SELECT_OBJECT:
      return {
        ...state,
        selected_object: action.object,
        selected_object_mode: action.mode,
      };

    case types.APP_DESELECT_SCREEN:
      const routeId =
        state.selected_screen_route_id === action.routeId
          ? null
          : state.selected_screen_route_id;
      return {...state, selected_screen_route_id: routeId};

    case types.APP_DESELECT_OBJECT:
      return {...state, selected_object: null, selected_object_mode: null};

    case types.APP_JUMP_TO_ROUTE:
      return {
        ...state,
        selected_tab: action.tab,
        selected_invisible_tab: null,
        next_route_to_show: action.route,
      };

    case types.APP_UPDATE_PREVIOUS_TAB:
      return {...state, previous_tab: state.selected_tab};

    case types.APP_USER_LOADED:
      return {...state, user_id: action.userId};

    case types.APP_SCHOOL_LOADING:
      return {...state, is_loading_school: true};

    case types.APP_SCHOOL_LOADED:
      return {...state, is_loading_school: false, school: action.school};

    case types.APP_IS_NEW_INSTALL_LOADED:
      return {...state, is_new_install: action.isNewInstall};

    case types.APP_LAST_VERSION_LOADED:
      return {...state, last_version: action.version};

    case types.APP_ANONYMOUS_ID_LOADED:
      global.anonymousId = action.anonymousId;
      return {...state, anonymous_id: action.anonymousId};

    case types.HUD_REGISTER:
      return {...state, hud_component: action.component};

    case types.CHILL_BESTRESSBUSTER_SIGNEDUP:
      return {...state, user_id: action.user.id};

    case types.CHILL_AMSTRESSBUSTER_LOGGEDIN:
      return {...state, user_id: action.user.id};

    // Cache tab reference
    case types.APP_ADD_HOME_TAB_REF:
      return {...state, home_tab: action.component};

    case types.APP_ADD_CHILL_TAB_REF:
      return {...state, chill_tab: action.component};

    case types.APP_ADD_REMINDER_TAB_REF:
      return {...state, reminder_tab: action.component};

    // Access code not valid anymore
    case types.ACCESS_CODE_VALIDATION_ERROR:
      return {...state, school: null};

    // Handle pinned objects
    case types.APP_PINNED_OBJECTS_LOADED:
      return {
        ...state,
        pinned_photo: action.photo,
        pinned_audio: action.audio,
        pinned_voice: action.voice,
      };

    case types.APP_PINNED_PHOTO_UPDATED:
      return {...state, pinned_photo: action.photo};

    case types.APP_PINNED_AUDIO_UPDATED:
      return {...state, pinned_audio: action.audio};

    case types.APP_PINNED_VOICE_UPDATED:
      return {...state, pinned_voice: action.voice};

    default:
      return state;
  }
}
