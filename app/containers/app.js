import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import * as appActions from '../actions/app-actions';
import * as accessCodeActions from '../actions/access-code-actions';
import * as routes from '../routes/routes';
import AppMain from '../containers/app-main';
import SchoolPicker from '../containers/school-picker';
import AccessCodeModal from '../containers/access-code-modal';
import AnalyticsLib from '../libs/analytics-lib';
import * as constants from '../../config/constants';
import sc from '../../config/styles';
import * as StoreLib from '../libs/store-lib';

const propTypes = {
  interface: PropTypes.string,
  schoolId: PropTypes.string,
};
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    AnalyticsLib.setup();

    // Note: resets schoolId (DO NOT COMMIT)
    //if (__DEV__) {
    //AsyncStorage.removeItem('schoolId', () => {});
    //AsyncStorage.removeItem('accessCode', () => {});
    //  //AsyncStorage.setItem('schoolId', 'GpXyg3gabM', () => {}); // Harvard
    //  //AsyncStorage.setItem('schoolId', 'f6RfXr4Ca0', () => {}); // St. John
    //}
  }
  registerDeviceForMessaging = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
  
    await AsyncStorage.setItem('FCMToken', token);
  
    console.log('FCM Token: ', token);
    // Register the token
    // await register(token);
  };
  componentDidMount() {
    requestUserPermission();
    this.registerDeviceForMessaging();
    this.unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      Alert.alert('New Notification!', JSON.stringify(remoteMessage.notification));
    });

    // Handle background messages
    this.setBackgroundMessageHandler();

    // Handle notification when app is opened from a background state
    this.unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background:', remoteMessage.notification);
    });

    // Handle notification when app is opened from a quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        }
      });


    LogBox.ignoreLogs([
      'ViewPropTypes will be removed',
      'ColorPropType will be removed',
    ]);
    setTimeout(this.loadAppData, constants.SPLASH_SCREEN_WAIT);

    this.onTokenRefreshListener = messaging().onTokenRefresh(fcmToken => {
      console.log('RefreshToken', fcmToken);
    });
  }

  componentWillUnmount() {
    this.onTokenRefreshListener();
    if (this.unsubscribeOnMessage) this.unsubscribeOnMessage();
    if (this.unsubscribeOnNotificationOpened) this.unsubscribeOnNotificationOpened();
  }

  setBackgroundMessageHandler = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  };

  ///////////////
  // Functions //
  ///////////////

  loadAppData = () => {
    const { schoolId, appActions } = this.props;
    // Load school
    // Case 1: school id is hard coded
    console.log('sssssdasdassdad',schoolId)
    if (schoolId) {
      this.props.appActions.loadSchoolWithSchoolId(schoolId);
    }
    // Case 2: load school id from disk
    else {
      console.log('inside else');
      this.props.appActions.loadSchool();
    }
    
    // Load 'new install' and 'access code'
    // this.props.appActions.loadAnonymousId();
    this.props.appActions.loadIsNewInstall();
    this.props.appActions.loadLastVersion();
    this.props.accessCodeActions.loadAccessCodeFromDisk();
  };

  render() {
    // return this.renderPicker()

    // Case 1: loading school
    if (
      this.props.isLoadingSchool ||
      this.props.isLoadingAccessCode ||
      this.props.isNewInstall == null ||
      this.props.lastVersion == null
    ) {
      return <View />;
    }
    // Case 2: school not picked
    else if (!this.props.school) {
      console.log('insideeeeeeeeea')
      return this.props.interface == 'schoolPicker'
        ? this.renderPicker()
        : this.renderAccessCode();
    }
    // Case 3: school picked
    else {
      return this.renderApp();
    }
    // return this.renderPicker()
    // return this.renderAccessCode()
  }

  renderPicker() {
    return <SchoolPicker />;
  }

  renderAccessCode() {
    return (
      <AccessCodeModal
        defaultVisible={true}
        onHide={this.props.accessCodeActions.useFree}
      />
    );
  }

  renderApp() {
    return <AppMain />;
  }
}

App.propTypes = propTypes;
App.styles = StyleSheet.create({});

export default connect(
  state => ({
    isLoadingSchool: state.app.is_loading_school,
    isLoadingAccessCode: state.accessCode.is_loading_from_disk,
    isNewInstall: state.app.is_new_install,
    lastVersion: state.app.last_version,
    school: state.app.school,
  }),
  dispatch => ({
    appActions: bindActionCreators(appActions, dispatch),
    accessCodeActions: bindActionCreators(accessCodeActions, dispatch),
  }),
)(App);
