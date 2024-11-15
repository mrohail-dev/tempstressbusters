import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getAnonymousId() {
  return await getString('anonymousId');
}

export async function getIsWelcomeTutorialShown() {
  return await getBoolean('isWelcomeTutorialShown');
}

export async function getPinnedAudioObject() {
  return await getObject('pinnedAudioObject');
}
export async function getPinnedPhotoObject() {
  return await getObject('pinnedPhotoObject');
}
export async function getPinnedVoice() {
  return await getString('pinnedVoice');
}

export async function getReminderObjects() {
  return await getArray('reminderObjects');
}

export async function getReminderTimes() {
  return await getArray('reminderTimes');
}

export async function getScreenName() {
  return await getString('screenName');
}

export async function setAnonymousId(val) {
  return await setString('anonymousId', val);
}

export async function setIsWelcomeTutorialShown() {
  return await setBoolean('isWelcomeTutorialShown');
}

export async function setPinnedAudioObject(val) {
  return await setObject('pinnedAudioObject', val);
}
export async function setPinnedPhotoObject(val) {
  return await setObject('pinnedPhotoObject', val);
}
export async function setPinnedVoice(val) {
  return await setString('pinnedVoice', val);
}

export async function setReminderObjects(val) {
  return await setArray('reminderObjects', val);
}

export async function setReminderTimes(val) {
  return await setArray('reminderTimes', val);
}

export async function setScreenName(val) {
  return await setString('screenName', val);
}

////////////////////////
// Internal Functions
////////////////////////

async function getArray(key) {
  const val = await AsyncStorage.getItem(key);
  return val ? JSON.parse(val) : [];
}

async function getObject(key) {
  const val = await AsyncStorage.getItem(key);
  return val ? JSON.parse(val) : null;
}

async function getBoolean(key) {
  const val = await AsyncStorage.getItem(key);
  return val !== null;
}

async function getString(key) {
  return await AsyncStorage.getItem(key);
}

async function setArray(key, val) {
  return await AsyncStorage.setItem(key, JSON.stringify(val));
}

async function setObject(key, val) {
  return await AsyncStorage.setItem(key, JSON.stringify(val));
}

async function setBoolean(key) {
  return await AsyncStorage.setItem(key, 'true');
}

async function setString(key, val) {
  return await AsyncStorage.setItem(key, val);
}

