import { combineReducers } from 'redux';
import app from './app';
import accessCode from './access-code';
import schoolPicker from './school-picker';
import audio from './audio';
import events from './events';
import audios from './audios';
import favorites from './favorites';
import home from './home';
import help from './help';
import rewards from './rewards';
import selectedEvent from './selected-event';
import submitResource from './submit-resource';
import breath from './breath';
import library from './library';
import phone from './phone';
import notes from './notes';

import chillVideos from './chill-videos';
import chillPhotos from './chill-photos';
import chillLinks from './chill-links';
import chillGroups from './chill-groups';
import chillCallbacks from './chill-callbacks';
import chillReminders from './chill-reminders';
import chillRewards from './chill-rewards';
import chillAmStressbuster from './chill-amstressbuster';
import chillBeStressbuster from './chill-bestressbuster';

// export {
  // app,
  // accessCode,
  // schoolPicker,
  // audio,
  // rewards,
  // selectedEvent,
  // submitResource,
  // breath,

  // // tabs
  // events,
  // audios,
  // favorites,
  // home,
  // help,

  // // tab views
  // chillVideos,
  // chillPhotos,
  // chillLinks,
  // chillGroups,
  // chillCallbacks,
  // chillReminders,
  // chillRewards,
  // chillAmStressbuster,
  // chillBeStressbuster,
  // library,
  // phone,
  // notes,
// };

const rootReducer = combineReducers({
  app,
  accessCode,
  schoolPicker,
  audio,
  rewards,
  selectedEvent,
  submitResource,
  breath,

  // tabs
  events,
  audios,
  favorites,
  home,
  help,

  // tab views
  chillVideos,
  chillPhotos,
  chillLinks,
  chillGroups,
  chillCallbacks,
  chillReminders,
  chillRewards,
  chillAmStressbuster,
  chillBeStressbuster,
  library,
  phone,
  notes,
});

export default rootReducer;
