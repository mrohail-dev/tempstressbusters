import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as types from './action-types';
import * as constants from '../../config/constants';
import * as routes from '../routes/routes';
import * as apiClient from '../libs/api-client';
import AnalyticsLib from '../libs/analytics-lib';
import * as StoreLib from '../libs/store-lib';

export function appResume() {
  return {
    type: types.APP_RESUME,
  };
}

export function appPause() {
  return {
    type: types.APP_PAUSE,
  };
}

export function appDestroy() {
  return {
    type: types.APP_DESTROY,
  };
}

export function selectTab(tab) {
  AnalyticsLib.track('Tab Select', {route: tab});

  return async (dispatch, getState) => {
    //TODO
    const homeTab = getState().app.home_tab;
    const chillTab = getState().app.chill_tab;
    const reminderTab = getState().app.reminder_tab;

    // Handle on re-select
    if (tab == routes.chill().id && chillTab) {
      chillTab.getWrappedInstance().resetNav();
    } else if (tab == routes.home().id && homeTab) {
      homeTab.getWrappedInstance().resetNav();
    }

    // Handle on de-select
    if (tab != routes.chillReminders().id && reminderTab) {
      reminderTab.getWrappedInstance().onTabDeselect();
    }

    dispatch({
      type: types.APP_SELECT_TAB,
      tab: tab,
    });
  };
}

export function selectInvisibleTab(tab) {
  return {
    type: types.APP_SELECT_INVISIBLE_TAB,
    tab: tab,
  };
}

export function selectObject(object, mode) {
  return {
    type: types.APP_SELECT_OBJECT,
    object: object,
    mode: mode,
  };
}

export function selectScreen(routeId) {
  return {
    type: types.APP_SELECT_SCREEN,
    routeId: routeId,
  };
}

export function deselectObject() {
  return {
    type: types.APP_DESELECT_OBJECT,
  };
}

export function deselectScreen(routeId) {
  return {
    type: types.APP_DESELECT_SCREEN,
    routeId: routeId,
  };
}

export function jumpToRoute(tabRoute, screenRoute) {
  AnalyticsLib.track('Tab Select', {route: tabRoute.id});
  AnalyticsLib.track('Subview Select', {route: screenRoute.id});

  return {
    type: types.APP_JUMP_TO_ROUTE,
    tab: tabRoute.id,
    route: screenRoute,
  };
}

export function updatePreviousTab() {
  return {
    type: types.APP_UPDATE_PREVIOUS_TAB,
  };
}

// Cache tab reference
export function addHomeTabRef(component) {
  return {
    type: types.APP_ADD_HOME_TAB_REF,
    component: component,
  };
}

export function addChillTabRef(component) {
  return {
    type: types.APP_ADD_CHILL_TAB_REF,
    component: component,
  };
}

export function addReminderTabRef(component) {
  return {
    type: types.APP_ADD_REMINDER_TAB_REF,
    component: component,
  };
}

// Load school
export function loadSchoolWithSchoolId(schoolId) {
  return async (dispatch, getState) => {
    dispatch(loadingSchool());

    const response = await apiClient.get('get_school', schoolId);
    dispatch(receivedSchool(response));
  };
}

export function loadSchool() {
  // Note: handle no internet connection
  /*if (__DEV__) {
	 return {
	   type		: types.APP_SCHOOL_LOADED,
	   school	: {
		 id: 'abc',
		 tabs: [
		   {
			 id: 'HOME',
					   title: 'Home',
		   },
				   {
					  id: 'EVENTS',
					  title: 'Events',
				   },
				   {
					  id: 'CHILL',
					  title: 'Chill',
				  },
		 ],
	   },
	 };
	}*/

  return async (dispatch, getState) => {
    dispatch(loadingSchool());

    // TODO
    AsyncStorage.getItem('schoolId', async (err, result) => {
      // Case 1: has schoolId
      if (result) {
        console.log('local has school Id', result);
        dispatch(loadSchoolWithSchoolId(result));
      }
      // Case 2: has NO schoolId
      else {
        console.log('local has no id');
        dispatch(receivedSchool(null));
      }
    });
  };
}

export function loadingSchool() {
  return {
    type: types.APP_SCHOOL_LOADING,
  };
}

export function receivedSchool(school) {
  return {
    type: types.APP_SCHOOL_LOADED,
    school: school,
  };
}

// Load new install
export function loadIsNewInstall() {
  return async (dispatch, getState) => {
    AsyncStorage.getItem('hasRun', async (err, result) => {
      if (result == null) {
        AsyncStorage.setItem('hasRun', 'true');
        dispatch(receivedIsNewInstall(true));
      } else {
        dispatch(receivedIsNewInstall(false));
      }
    });
  };
}

export function receivedIsNewInstall(isNewInstall) {
  return {
    type: types.APP_IS_NEW_INSTALL_LOADED,
    isNewInstall: isNewInstall,
  };
}

// Load last version
export function loadLastVersion() {
  return async (dispatch, getState) => {
    AsyncStorage.getItem('lastVersion', async (err, result) => {
      let lastVersion = result;
      if (result == null) {
        AsyncStorage.setItem('lastVersion', constants.APP_VERSION);
        lastVersion = '0';
      }

      dispatch({
        type: types.APP_LAST_VERSION_LOADED,
        version: lastVersion,
      });
    });
  };
}

// Load user
export function loadAnonymousId() {
  return async (dispatch, getState) => {
    let anonymousId = await StoreLib.getAnonymousId();
    if (!anonymousId) {
      anonymousId = uuidv4();
      await StoreLib.setAnonymousId(anonymousId);
    }

    dispatch({
      type: types.APP_ANONYMOUS_ID_LOADED,
      anonymousId: anonymousId,
    });
  };
}

export function loadUser() {
  return async (dispatch, getState) => {
    await AsyncStorage.getItem('userId', (err, result) => {
      if (result) {
        dispatch(receivedUser(result));
      }
    });
  };
}

export function receivedUser(userId) {
  return {
    type: types.APP_USER_LOADED,
    userId: userId,
  };
}

///////////////////////////
// Handle pinned objects
///////////////////////////

export function loadPinnedObjects() {
  return async (dispatch, getState) => {
    dispatch({
      type: types.APP_PINNED_OBJECTS_LOADED,
      photo: await StoreLib.getPinnedPhotoObject(),
      audio: await StoreLib.getPinnedAudioObject(),
      voice: await StoreLib.getPinnedVoice(),
    });
  };
}

export function pinPhoto(object) {
  AnalyticsLib.trackObject('Pin Photo', object);

  return async (dispatch, getState) => {
    await StoreLib.setPinnedPhotoObject(object);
    dispatch({type: types.APP_PINNED_PHOTO_UPDATED, photo: object});
  };
}

export function pinAudio(object) {
  AnalyticsLib.trackObject('Pin Audio', object);

  return async (dispatch, getState) => {
    await StoreLib.setPinnedAudioObject(object);
    dispatch({type: types.APP_PINNED_AUDIO_UPDATED, audio: object});
  };
}

export function pinVoice(voice) {
  AnalyticsLib.trackObject('Pin Voice', voice);

  return async (dispatch, getState) => {
    await StoreLib.setPinnedVoice(voice);
    dispatch({type: types.APP_PINNED_VOICE_UPDATED, voice});
  };
}
