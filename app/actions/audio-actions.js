import AnalyticsLib from '../libs/analytics-lib';
import TrackPlayer from 'react-native-track-player';
import * as rewardActions from '../actions/reward-actions';
import * as types from './action-types';

export function play(object) {
	AnalyticsLib.trackObject('Audio Play', object);

	return async(dispatch, getState) => {
    const state = getState();

    // Setup player
    // await TrackPlayer.setupPlayer({});

    const currentTrackObject = state.audio.object;
    const wasPlayingSameTrack = (currentTrackObject && object.id == currentTrackObject.id);
    if ( ! wasPlayingSameTrack) {
      await TrackPlayer.reset();
    } 

    // Adds a track to the queue
    await TrackPlayer.add({
      id: object.id,
      url: object.audio_link,
      title: object.title,
      artist: 'Sonic Spa',
    });

    // Starts playing it
    if (wasPlayingSameTrack) {
      TrackPlayer.seekTo(state.audio.pausedPosition);
    }
    TrackPlayer.play();
    
    // clear current timer
    clearTimer(state);

    // create timer
    const timer = setTimeout(() => {
      clearTimeout(timer);
      dispatch(rewardActions.earnViaAudioPlay());
    }, 60000);

		dispatch({
      type: types.AUDIO_PLAY_TRACK,
      timer: timer,
      object: object,
    });
	};
}

export function pause() {
	return async(dispatch, getState) => {
    const state = getState();

    TrackPlayer.pause();
    // clear current timer
    clearTimer(state);

    dispatch({
      type: types.AUDIO_PAUSE_TRACK,
      position: await TrackPlayer.getPosition(),
      timer: null,
    });
  }
}

export function stop() {
	return async(dispatch, getState) => {
    const state = getState();

    TrackPlayer.stop();

    // clear current timer
    clearTimer(state);

    dispatch({
      type: types.AUDIO_STOP_TRACK,
      timer: null,
    });
  }
}

function clearTimer(state) {
  if (state.audio.timer != null) {
    clearTimeout(state.audio.timer);
  }
}
