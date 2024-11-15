import { firebase } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import * as strings from '../../config/strings';
import * as constants from '../../config/constants';
import * as types from './action-types';
import * as apiClient from '../libs/api-client';
import AnalyticsLib from '../libs/analytics-lib';
import * as StoreLib from '../libs/store-lib';
import * as rewardActions from '../actions/reward-actions';
import notifee, { TriggerType, AndroidImportance } from '@notifee/react-native';

export function loadFeed() {
  return async (dispatch, getState) => {
    const schoolId = getState().app.school.id;
    const path = 'get_reminders';
    dispatch(requestFeed());
    const response = await apiClient.get(path, schoolId);
    dispatch(receivedFeed(response));
  };
}

export function requestFeed() {
  return {
    type: types.CHILL_REMINDERS_FEED_LOAD,
  };
}

export function receivedFeed(response) {
  return {
    type: types.CHILL_REMINDERS_FEED_LOADED,
    response: response,
  };
}

export function selectFilter(filter) {
  return {
    type: types.CHILL_REMINDERS_SELECT_FILTER,
    filter: filter,
  };
}

export function loadEnabledReminders() {
  return async (dispatch, getState) => {
    let reminders = await StoreLib.getReminderObjects();
    // console.log("reminders", reminders);
    let reminderTimes = await StoreLib.getReminderTimes();
    if (!Array.isArray(reminderTimes)) {
      reminderTimes = [];
    }
    rewardExpiredReminderTimes(dispatch, reminderTimes);
    reminders = filterExpiredReminders(reminders);
    // console.log("fass", reminders)
    reminderTimes = await updateLocalNotifications(reminders);
    // updateLocalNotifications(reminders);
    // console.log("commingremindertimes", reminderTimes);
    StoreLib.setReminderObjects(reminders);
    dispatchEnabledRemindersUpdated(dispatch, reminders, reminderTimes);
    StoreLib.setReminderTimes(reminderTimes);
  };
}

export function selectObject(object, sound) {
  return {
    type: types.CHILL_REMINDERS_SELECT_OBJECT,
    object,
    sound,
  };
}

export function deselectObject() {
  return {
    type: types.CHILL_REMINDERS_DESELECT_OBJECT,
  };
}

export function createReminder(object, sound, date, frequency) {
  AnalyticsLib.trackObject('Reminder Create', object, { sound, frequency });

  return async (dispatch, getState) => {
    // remove if already exist (ie. enabled without voice and then enabling with voice)
    let index = -1;
    let reminders = getState().chillReminders.enabled_reminders;
    let reminderTimes = await StoreLib.getReminderTimes();
    reminders = reminders.filter(reminder => (reminder.object.id != object.id));

    // add to array
    reminders.push({ object, sound, date, frequency });

    // remove expired
    rewardExpiredReminderTimes(dispatch, reminderTimes);
    reminders = filterExpiredReminders(reminders);
    try {
      reminderTimes = await updateLocalNotifications(reminders);
    } catch (err) {
      console.error(err)
    }
    StoreLib.setReminderObjects(reminders);
    StoreLib.setReminderTimes(reminderTimes);
    dispatchEnabledRemindersUpdated(dispatch, reminders, reminderTimes);

    // update state
    dispatch({
      type: types.CHILL_REMINDERS_DESELECT_OBJECT,
    });
  };
}

export function removeReminder(object) {
  return async (dispatch, getState) => {
    // remove from array
    let index = -1;
    let reminders = getState().chillReminders.enabled_reminders;
    let reminderTimes = await StoreLib.getReminderTimes();
    reminders = reminders.filter(reminder => (reminder.object.id != object.id));

    // remove expired
    rewardExpiredReminderTimes(dispatch, reminderTimes);
    reminders = filterExpiredReminders(reminders);
    updateLocalNotifications(reminders);
    StoreLib.setReminderObjects(reminders);
    StoreLib.setReminderTimes(reminderTimes);
    dispatchEnabledRemindersUpdated(dispatch, reminders, reminderTimes);
  };
}

export function resetLocalNotifications() {
  return async (dispatch, getState) => {
    let reminders = getState().chillReminders.enabled_reminders;
    let reminderTimes = await StoreLib.getReminderTimes();

    // remove expired
    // rewardExpiredReminderTimes(dispatch, reminderTimes);
    reminders = filterExpiredReminders(reminders);
    reminderTimes = await updateLocalNotifications(reminders);
    StoreLib.setReminderObjects(reminders);
    StoreLib.setReminderTimes(reminderTimes);
    dispatchEnabledRemindersUpdated(dispatch, reminders, reminderTimes);
  };
}


function rewardExpiredReminderTimes(dispatch, reminderTimes) {
  const now = Date.now();
  // console.log("sdasdsssssssssssssssssss", reminderTimes);
  return reminderTimes.forEach(reminderTime => {
    if (reminderTime < now) {
      dispatch(rewardActions.earnViaReminder());
    }
  });
}

function filterExpiredReminders(reminders) {
  const now = Date.now();

  return reminders.filter(reminder => {
    const reminderDate = new Date(reminder.date);
    // Case 1: not repeating && expired => remove
    if ((!reminder.frequency) && (reminderDate.getTime() < now)) {
      return false;
    }
    // Case 2: need to schedule => keep
    else {
      return true;
    }
  });
}





// function updateLocalNotifications(reminders) {
//   const reminderTimes = [];

//   // Build a channel
//   if (Platform.OS === 'android') {
//     const channel = new messaging.Android.Channel(
//       'fcm_default_channel',
//       'fcm_default_channel',
//       messaging.Android.Importance.Max
//     )
//     .setDescription('Chill Factory channel')
//     .setSound('notification.wav'); // Ensure you have this sound file in res/raw

//     // Create the channel
//     messaging().android.createChannel(channel)
//       .then(() => console.log('Channel created'))
//       .catch(error => console.error('Error creating channel:', error));
//   }

//   // Clear existing notifications
//   messaging().cancelAllNotifications();

//   // Handle each reminder
//   const now = Date.now();

//   reminders.forEach(reminder => {
//     const tsFire = new Date(reminder.date).getTime();

//     // Set sound
//     const sound = reminder.sound || "notification.wav";

//     // Case 1: not repeating
//     if (!reminder.frequency) {
//       const notification = new messaging.Notification()
//         .setNotificationId(reminder.object.id.toString())
//         .setBody(reminder.object.title)
//         .setSound(sound);

//       if (Platform.OS === 'android') {
//         notification.android.setChannelId('stressbusters');
//       }

//       messaging().scheduleNotification(notification, {
//         fireDate: tsFire,
//       });
//       reminderTimes.push(tsFire);
//     }

//     // Case 2: repeating
//     else {
//       let step = 86400;
//       let count = 1;

//       if (reminder.frequency === strings.REMINDER_FREQUENCY_VALUE_30MIN) {
//         step = 1800;
//         count = 48;
//       } else if (reminder.frequency === strings.REMINDER_FREQUENCY_VALUE_HOURLY) {
//         step = 3600;
//         count = 24;
//       } else if (reminder.frequency === strings.REMINDER_FREQUENCY_VALUE_DAILY) {
//         step = 86400;
//         count = 8;
//       } else if (reminder.frequency === strings.REMINDER_FREQUENCY_VALUE_WEEKLY) {
//         step = 604800;
//         count = 4;
//       } else if (reminder.frequency === strings.REMINDER_FREQUENCY_VALUE_MONTHLY) {
//         step = 18144000;
//         count = 2;
//       } else if (reminder.frequency === strings.REMINDER_FREQUENCY_VALUE_YEARLY) {
//         step = 31536000;
//         count = 2;
//       }

//       step *= 1000;

//       // Create 1 notification for each occurrence
//       let tsStart = new Date(reminder.date).getTime();
//       tsStart = (tsStart < now)
//         ? tsStart + Math.floor((now - tsStart) / step + 1) * step
//         : tsStart;

//       for (let i = 0; i < count; i++) {
//         const tsFire = tsStart + step * i;
//         const notification = new messaging.Notification()
//           .setNotificationId(reminder.object.id.toString() + '_' + i.toString())
//           .setBody(reminder.object.title)
//           .setSound(sound);

//         if (Platform.OS === 'android') {
//           notification.android.setChannelId('stressbusters');
//         }

//         messaging().scheduleNotification(notification, {
//           fireDate: tsFire,
//         });
//         reminderTimes.push(tsFire);
//       }
//     }
//   });

//   return reminderTimes;
// }

async function updateLocalNotifications(reminders) {
  const reminderTimes = [];

  // Build a channel
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'fcm_default_channel',
      name: 'fcm_default_channel',
      importance: AndroidImportance.HIGH,
    });
  }

  // Clear existing notifications
  await notifee.cancelAllNotifications();

  // Handle each reminder
  const now = Date.now();
  for (const reminder of reminders) {
    // console.log("reminderreminder", reminder);
    const tsFire = new Date(reminder.date).getTime();
    const sound = reminder.sound || "notification.wav";

    // Case 1: Not repeating
    if (!reminder.frequency) {
      await scheduleNotification(reminder, tsFire, sound);
      reminderTimes.push(tsFire);
    } else {
      // Case 2: Repeating notification
      const { step, count } = getFrequencyStepAndCount(reminder.frequency);

      // Set the start time for the notification, adjusted for the current time
      let tsStart = tsFire < now ? tsFire + Math.floor((now - tsFire) / step + 1) * step : tsFire;

      for (let i = 0; i < count; i++) {
        const tsFireRepeat = tsStart + step * i;
        // console.log("tsFireRepeat", tsFireRepeat);
        await scheduleNotification(reminder, tsFireRepeat, sound, i);
        reminderTimes.push(tsFireRepeat);
      }
    }
  }

  return reminderTimes;
}

// Helper function to get the step and count based on frequency
function getFrequencyStepAndCount(frequency) {
  let step = 86400; // Default step: daily in seconds
  let count = 1; // Default repeat count

  switch (frequency) {
    case strings.REMINDER_FREQUENCY_VALUE_30MIN:
      step = 1800;
      count = 48;
      break;
    case strings.REMINDER_FREQUENCY_VALUE_HOURLY:
      step = 3600;
      count = 24;
      break;
    case strings.REMINDER_FREQUENCY_VALUE_DAILY:
      step = 86400;
      count = 8;
      break;
    case strings.REMINDER_FREQUENCY_VALUE_WEEKLY:
      step = 604800;
      count = 4;
      break;
    case strings.REMINDER_FREQUENCY_VALUE_MONTHLY:
      step = 18144000;
      count = 2;
      break;
    case strings.REMINDER_FREQUENCY_VALUE_YEARLY:
      step = 31536000;
      count = 2;
      break;
  }

  return { step: step * 1000, count };
}

// Helper function to schedule notifications
async function scheduleNotification(reminder, fireDate, sound, suffix = '') {
  const notification = {
    id: `${reminder.object.id}${suffix ? '_' + suffix : ''}`,
    title: reminder.object.title,
    android: {
      channelId: 'fcm_default_channel',
      sound: sound,
      pressAction: { id: 'default' },
    },
    ios: {
      sound: sound,
    },
  };

  await notifee.createTriggerNotification(notification, {
    type: TriggerType.TIMESTAMP,
    timestamp: fireDate,
  });
}

function dispatchEnabledRemindersUpdated(dispatch, reminders, reminderTimes) {
  dispatch({
    type: types.CHILL_REMINDERS_ENABLED_UPDATED,
    reminders: reminders,
    reminderTimes: reminderTimes,
  });
}
