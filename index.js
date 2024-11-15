/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './app/containers/stressbusters-app';
import {name as appName} from './app.json';
import './firebase.config';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import notifee, {
  EventType,
  AndroidImportance,
  TriggerType,
  Trigger,
} from '@notifee/react-native';
var EventEmitter = require('eventemitter3');
export const eventEmitter = new EventEmitter();
const onMessageReceived = async message => {
  console.log('messagemessage',message)
  notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  // const notification = JSON.parse(message.data.notifee);
  const notification = {
    title: message.notification?.title || 'Notification Title',
    body: message.notification?.body || 'Notification Body',
    android: {
      channelId: 'default',
      pressAction: {
        id: 'default', // Identifier for the press action
      },
    },
    data: message.data, // Attach any additional data
  };
  await notifee.displayNotification(notification);
};
messaging().setBackgroundMessageHandler(onMessageReceived);
messaging().onMessage(onMessageReceived);
notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  // Check if the user pressed the "Mark as read" action
  if (type === EventType.PRESS) {
    // Update external API
    eventEmitter.emit('notificationReceived', notification);
    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});
notifee.onForegroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  if (type === EventType.PRESS) {
    eventEmitter.emit('notificationReceived', notification);
    await notifee.cancelNotification(notification.id);
  }
});
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
AppRegistry.registerComponent(appName, () => () => <App interface="schoolPicker" />);