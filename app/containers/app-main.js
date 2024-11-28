import React, {Component} from 'react';
import {
  Animated,
  AppState,
  Dimensions,
  Image,
  InteractionManager,
  NativeAppEventEmitter,
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {isIphoneX, getBottomSpace} from 'react-native-iphone-x-helper';
import TrackPlayer from 'react-native-track-player';
import AnalyticsLib from '../libs/analytics-lib';
import sc from '../../config/styles';
import * as appActions from '../actions/app-actions';
import * as accessCodeActions from '../actions/access-code-actions';
import * as audioActions from '../actions/audio-actions';
import * as favActions from '../actions/favorite-actions';
import * as rewardActions from '../actions/reward-actions';
import * as chillRemindersActions from '../actions/chill-reminders-actions';
import * as routes from '../routes/routes';
import AppBackgroundView from '../components/app-background';
import HomeView from '../containers/home';
import EventsView from '../containers/events';
import ChillView from '../containers/chill';
import HelpView from '../containers/help';
import AudiosView from '../containers/audios';
import RemindersView from '../containers/reminders';
import FavsView from '../containers/favs';
import InvisibleTabView from '../containers/invisible-tab';
import ActivityView from '../components/activity/activity';
import EventForm from '../components/event-form/event-form';
import ReminderForm from '../components/reminder-form/reminder-form';
import BreathView from '../containers/breath';
import SubmitResourceView from '../components/submit-resource/submit-resource';
import TutorialModal from '../components/tutorial-modal';
import AccessCodeModal from '../containers/access-code-modal';
import ChillAbout from './chill-about';

export const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
  // marginBottom: 10,
};

const propTypes = {};

const routeHome = routes.home();
const routeEvents = routes.events();
const routeChill = routes.chill();
const routeHelp = routes.help();
const routeAudios = routes.audios();
const routeFavs = routes.chillFavorites();
const routeReminders = routes.chillReminders();

const Tab = createBottomTabNavigator();

class AppMain extends Component {
  constructor(props) {
    super(props);

    this._isInitial = true;
    this._initialContainerOpacity = new Animated.Value(0);
    this._initialContentOpacity = new Animated.Value(0);
    this._transitionOpacity = new Animated.Value(0);

    this.renderTabs = this.renderTabs.bind(this);
    this.fadeTransition = this.fadeTransition.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
    this.onActivityModalViewClose = this.onActivityModalViewClose.bind(this);
    this.handleTabPress = this.handleTabPress.bind(this);
    this.getTabComponent = this.getTabComponent.bind(this);
  }

  UNSAFE_componentWillMount() {
    AnalyticsLib.identify({
      school: this.props.school.id,
      access_code: this.props.accessCode,
    });
    AnalyticsLib.registerSuperProperties({
      new_install: this.props.isNewInstall ? true : undefined,
    });
    AnalyticsLib.track('App Open');
    AnalyticsLib.track('Tab Select', {route: routeHome.id});

    // Native modules
    NativeAppEventEmitter.addListener(
      'onHostResume',
      this.onHostResume.bind(this),
    );
    NativeAppEventEmitter.addListener(
      'onHostPause',
      this.onHostPause.bind(this),
    );
    NativeAppEventEmitter.addListener(
      'onHostDestroy',
      this.onHostDestroy.bind(this),
    );
    // TrackPlayer.registerEventHandler(data => {
    //   //console.warn(Date.now(), 'cb', JSON.stringify(data));
    //   if (data.type === 'playback-queue-ended' && data.position > 0) {
    //     const { selectedAudioObject } = this.props;

    //     // Note: when YouTube video finishes playing, this callback gets triggered.
    //     //      The real fix should be not trigger this event in native code, but
    //     //      couldn't get it to work as of Aug 16, 2016.
    //     if ( ! selectedAudioObject) { return; }

    //     if (selectedAudioObject.loop) {
    //       TrackPlayer.seekTo(0);
    //       TrackPlayer.play();
    //     }
    //     else {
    //       this.props.audioActions.stop();
    //     }
    //   }
    // });
    TrackPlayer.registerPlaybackService(() => require('../../service.js'));
    TrackPlayer.setupPlayer().then(() =>
      console.log('The player is ready to be used'),
    );

    this.props.accessCodeActions.checkCodeValidity();
    this.props.appActions.loadUser();
    this.props.appActions.loadPinnedObjects();
    this.props.favActions.loadFeed();
    this.props.chillRemindersActions.loadEnabledReminders();
    this.props.rewardActions.loadPoints();
    this.props.rewardActions.loadEarnedIds();
    this.props.rewardActions.loadSpentIds();
    this.props.rewardActions.loadDonatedPoints();
    this.props.rewardActions.loadFavIds();
    this.props.rewardActions.loadGoalIds();
    this.props.rewardActions.loadAppLastActiveDate();
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this._initialContainerOpacity, {
        delay: 500,
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      Animated.timing(this._initialContentOpacity, {
        delay: 2000,
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      Animated.timing(this._transitionOpacity, {
        delay: 2000,
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });

    // Register notification
    firebase.messaging().requestPermission();
    firebase
      .messaging()
      .getToken()
      .then(fcmToken => {
        firebase
          .messaging()
          .subscribeToTopic(`school_${this.props.school.id}`).then((data)=>{
            console.log('connected to topic');
          }).catch(reason =>{
            console.log('failed',reason)
          });
        console.log('getToken', fcmToken);
      });

    // Add app state listener
    // AppState.addEventListener('change', this.onAppStateChange.bind(this));
    const listener = AppState.addEventListener('change', nextAppState => {});
    listener.remove();
  }

  // componentWillUnmount() {
  //   // AppState.removeEventListener('change', this.onAppStateChange.bind(this));
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.selectedTab != nextProps.selectedTab) {
      this.fadeTransition();
    }
  }

  render() {
    const {
      selectedInvisibleTab,
      selectedObject,
      selectedObjectMode,
      selectedEventObject,
      selectedReminderObject,
      selectedVideoObject,
      selectedSubmitObject,
      selectedBreath,
    } = this.props;
    const initialContainerAnimatedStyles = [
      {
        flex: 1,
        opacity: this._initialContainerOpacity,
      },
    ];
    const initialContentAnimatedStyles = [
      {
        flex: 1,
        opacity: this._initialContentOpacity,
      },
    ];
    const renderInitialBackground = this._isInitial;
    this._isInitial = false;

    return (
      <Animated.View style={initialContainerAnimatedStyles}>
        {renderInitialBackground && (
          <Image
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              resizeMode: 'cover',
            }}
            source={{uri: this.props.school.home_image_link}}
          />
        )}

        <Animated.View accessible={false} style={initialContentAnimatedStyles}>
          <AppBackgroundView transitionOpacity={this._transitionOpacity} />

          <StatusBar barStyle="light-content" />

          {(() => {
            return this.renderTabs();
          })()}

          {/* { selectedInvisibleTab &&
            <ChillAbout transitionOpacity={this._transitionOpacity} /> } */}

          {selectedObject && (
            <ActivityView
              onClose={() => this.onActivityModalViewClose()}
              object={selectedObject}
              mode={selectedObjectMode}
            />
          )}

          {selectedEventObject && <EventForm object={selectedEventObject} />}

          {selectedReminderObject && (
            <ReminderForm object={selectedReminderObject} />
          )}

          {selectedSubmitObject && <SubmitResourceView />}

          {selectedBreath && <BreathView />}

          <TutorialModal />

          <AccessCodeModal
            defaultVisible={false}
            onHide={this.props.accessCodeActions.hideModal}
          />
        </Animated.View>
      </Animated.View>
    );
  }

  handleTabPress(routes, navigation) {
    const route = (this.props.school.tabs || []).find(
      i => i.title === routes.name,
    );
    const {free} = tabBarMenu.get(route.id);
    const isInactive = this.props.isFree && !free;
    if (isInactive) {
      return this.props.accessCodeActions.showModal();
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: routes.name}],
      });
      // return navigation.navigate(routes.name)
      this.onTabClick(route);
    }
  }

  renderTabs() {
    return (
      <NavigationContainer theme={navTheme}>
        <Tab.Navigator
        
          screenOptions={({route, navigation}) => ({
            tabBarIcon: ({focused}) => {
              const routes = (this.props.school.tabs || []).find(
                i => i.title === route.name,
              );
              const {activeIcon, iconName, isLarge, free} = tabBarMenu.get(
                routes.id,
              );
              const isInactive = this.props.isFree && !free;
              const imageStyle = isLarge
                ? styles.imageTabLarge
                : styles.imageTab;
              return (
                <View>
                  <Image
                    source={focused ? activeIcon : iconName}
                    style={[imageStyle, isInactive ? sc.inactive : {}]}
                  />
                  {isInactive && (
                    <Image
                      style={styles.imageTabLock}
                      source={require('../../images/chrome/lock.png')}
                    />
                  )}
                </View>
              );
            },
            tabBarButton: props => (
              <TouchableOpacity
                {...props}
                onPress={() => this.handleTabPress(route, navigation)}
              />
            ),
            tabBarStyle: styles.tabBarStyle,
            headerShown: false,
            // tabBarItemStyle: styles.tabSceneStyle
          })}>
            {console.log("blblblb",this.props.school.tabs)}
          {this.props.school.tabs.map(tab => (
            <Tab.Screen
              name={tab.title}
              component={this.getTabComponent(tab.id, this._transitionOpacity)}
            />
          ))}
        </Tab.Navigator>
      </NavigationContainer>
    );
  }

  getTabComponent(id, transitionOpacity) {
    switch (id) {
      case routeHome.id:
        return props => (
          <HomeView {...props} transitionOpacity={transitionOpacity} />
        );
      case routeEvents.id:
        return props => (
          <EventsView {...props} transitionOpacity={transitionOpacity} />
        );
      case routeChill.id:
        return props => (
          <ChillView {...props} transitionOpacity={transitionOpacity} />
        );
      case routeAudios.id:
        return props => (
          <AudiosView {...props} transitionOpacity={transitionOpacity} />
        );
      case routeHelp.id:
        return props => (
          <HelpView {...props} transitionOpacity={transitionOpacity} />
        );
      case routeFavs.id:
        return props => (
          <FavsView {...props} transitionOpacity={transitionOpacity} />
        );
      case routeReminders.id:
        return props => (
          <RemindersView {...props} transitionOpacity={transitionOpacity} />
        );
      default:
        return props => (
          <HomeView {...props} transitionOpacity={transitionOpacity} />
        );
    }
  }
  ///////////////////////////
  // Notification Callback //
  ///////////////////////////

  onAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
      this.props.rewardActions.earnViaAppActive();
      this.props.chillRemindersActions.resetLocalNotifications();
    }
  }

  onHostResume(e) {
    this.props.appActions.appResume();
  }

  onHostPause(e) {
    this.props.appActions.appPause();
  }

  onHostDestroy(e) {
    this.props.appActions.appDestroy();
  }

  ///////////////////////
  // Delegate Callback //
  ///////////////////////

  onTabClick(route) {
    this.props.appActions.selectTab(route.id);
  }

  onActivityModalViewClose() {
    this.props.appActions.deselectObject();
  }

  ///////////////
  // Functions //
  ///////////////

  fadeTransition() {
    const {appActions} = this.props;
    this._transitionOpacity.setValue(0);

    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this._transitionOpacity, {
        delay: 0,
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });

    // Note: do not update previous tab
    setTimeout(() => {
      appActions.updatePreviousTab();
    }, 1300);
  }
}

AppMain.propTypes = propTypes;
const styles = StyleSheet.create({
  tabSceneStyle: {
    // marginBottom: 10,
    paddingTop: isIphoneX() ? 15 : 0,
    paddingBottom: sc.tabBarHeight + getBottomSpace() - 3,
  },
  tabBarStyle: {
    backgroundColor: sc.tabBarBackgroundColor,
    borderColor: sc.tabBarBackgroundColor,
    height: sc.tabBarHeight + getBottomSpace() - 3,
    // paddingBottom: getBottomSpace() - 5,
  },
  textTabTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  textTabTitleActive: {
    fontWeight: 'bold',
  },
  imageTab: {
    width: 18,
    height: 18,
  },
  imageTabLarge: {
    width: 20,
    height: 20,
  },
  imageTabLock: {
    position: 'absolute',
    width: 16,
    height: 16,
    top: -8,
    right: -8,
    opacity: 0.7,
  },
});

const tabBarMenu = new Map([
  [
    routeHome.id,
    {
      iconName: require('../../images/tabbar/home.png'),
      activeIcon: require('../../images/tabbar/home_active.png'),
      free: routeHome.free,
      isLarge: false,
    },
  ],
  [
    routeEvents.id,
    {
      iconName: require('../../images/tabbar/events.png'),
      activeIcon: require('../../images/tabbar/events_active.png'),
      free: routeEvents.free,
      isLarge: false,
    },
  ],
  [
    routeChill.id,
    {
      iconName: require('../../images/tabbar/calmcierge.png'),
      activeIcon: require('../../images/tabbar/calmcierge_active.png'),
      free: routeChill.free,
      isLarge: true,
    },
  ],
  [
    routeAudios.id,
    {
      iconName: require('../../images/tabbar/audios.png'),
      activeIcon: require('../../images/tabbar/audios_active.png'),
      free: routeAudios.free,
      isLarge: false,
    },
  ],
  [
    routeHelp.id,
    {
      iconName: require('../../images/tabbar/help.png'),
      activeIcon: require('../../images/tabbar/help_active.png'),
      free: routeHelp.free,
      isLarge: false,
    },
  ],
  [
    routeFavs.id,
    {
      iconName: require('../../images/tabbar/favs.png'),
      activeIcon: require('../../images/tabbar/favs_active.png'),
      free: routeFavs.free,
      isLarge: false,
    },
  ],
  [
    routeReminders.id,
    {
      iconName: require('../../images/tabbar/reminders.png'),
      activeIcon: require('../../images/tabbar/reminders_active.png'),
      free: routeFavs.free,
      isLarge: false,
    },
  ],
]);

export default connect(
  state => ({
    school: state.app.school,
    isNewInstall: state.app.is_new_install,
    isFree: state.accessCode.access_code == '__FREE__',
    accessCode: state.accessCode.access_code,
    selectedTab: state.app.selected_tab,
    selectedInvisibleTab: state.app.selected_invisible_tab,
    selectedObject: state.app.selected_object,
    selectedObjectMode: state.app.selected_object_mode,
    selectedEventObject: state.selectedEvent.object,
    selectedReminderObject: state.chillReminders.selected_object,
    selectedSubmitObject: state.submitResource.object,
    selectedAudioObject: state.audio.object,
    selectedBreath: state.breath.selected,
  }),
  dispatch => ({
    appActions: bindActionCreators(appActions, dispatch),
    accessCodeActions: bindActionCreators(accessCodeActions, dispatch),
    audioActions: bindActionCreators(audioActions, dispatch),
    favActions: bindActionCreators(favActions, dispatch),
    rewardActions: bindActionCreators(rewardActions, dispatch),
    chillRemindersActions: bindActionCreators(chillRemindersActions, dispatch),
  }),
)(AppMain);
