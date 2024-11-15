import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const initialState = {
	object				: null,
  timer         : null,
	mode					: 'stop',
  pausedPosition: 0,
};

export default function audio(state = initialState, action = {}) {
  switch (action.type) {

    case types.AUDIO_PLAY_TRACK:
			return {...state,
				object  : action.object,
				timer   : action.timer,
        pausedPosition: 0,
				mode    : 'play',
			};

    case types.AUDIO_PAUSE_TRACK:
			return {...state,
        pausedPosition: action.position,
				mode: 'pause',
			};

    case types.AUDIO_STOP_TRACK:
			return {...state,
				object: null,
				mode: 'stop',
        pausedPosition: 0,
			};

    default:
      return state;
  }
}
