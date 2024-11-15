import AsyncStorage from '@react-native-async-storage/async-storage';
import AnalyticsLib from '../libs/analytics-lib';
import * as types from './action-types';
import * as rewardActions from '../actions/reward-actions';

export function loadFeed() {
  return async (dispatch, getState) => {
    dispatch(requestFeed());
    AsyncStorage.getItem('favoriteObjects', (err, result) => {
      result = result ? JSON.parse(result) : [];
      dispatch(receivedFeed(result));
    });
  };
}

export function requestFeed() {
  return {
    type: types.CHILL_FAV_FEED_LOAD,
  };
}

export function receivedFeed(response) {
  return {
    type: types.CHILL_FAV_FEED_LOADED,
    response: response,
  };
}

export function selectFilter(filter) {
  return {
    type: types.CHILL_FAV_SELECT_FILTER,
    filter: filter,
  };
}

export function favoriteObject(object) {
  AnalyticsLib.trackObject('Favorite', object);

  return async (dispatch, getState) => {
    // update favorite objects
    const data = getState().favorites.data['All'] || [];
    const objects = [...data];
    const index = getFavoriteIndex(objects, object);
    if (index >= 0) {
      objects.splice(index, 1);
    }
    objects.unshift(object);

    // dispatch
    dispatch(rewardActions.earnViaFav(object.id));
    dispatch(favoriteUpdated(objects));

    // store
    AsyncStorage.setItem('favoriteObjects', JSON.stringify(objects), () => {});
  };
}

export function unfavoriteObject(object) {
  AnalyticsLib.trackObject('Unfavorite', object);

  return async (dispatch, getState) => {
    // update favorite objects
    const data = getState().favorites.data['All'] || [];
    const objects = [...data];
    const index = getFavoriteIndex(objects, object);
    if (index >= 0) {
      objects.splice(index, 1);
    }

    // dispatch
    dispatch(favoriteUpdated(objects));

    // store
    AsyncStorage.setItem('favoriteObjects', JSON.stringify(objects), () => {});
  };
}

export function favoriteUpdated(objects) {
  return {
    type: types.CHILL_FAV_UPDATED,
    objects: objects,
  };
}

function getFavoriteIndex(objects, object) {
  return objects.findIndex((per, index) => {
    if (per.id == object.id) {
      return true;
    }
    return false;
  });
}
