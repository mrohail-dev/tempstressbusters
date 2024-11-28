import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Animated, StyleSheet, View, Text, FlatList, ScrollView, KeyboardAvoidingView} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import RNCommunications from 'react-native-communications';
import AnalyticsLib from '../libs/analytics-lib';
import sc from '../../config/styles';
import * as constants from '../../config/constants';
import * as routeTypes from '../routes/route-types';
import * as routes from '../routes/routes';
import * as appActions from '../actions/app-actions';
import * as breathActions from '../actions/breath-actions';
import * as schoolLib from '../libs/school-lib';
import NavBar from '../libs/nav-bar';
import MenuFeed from '../components/menu-feed';
import ChillVideos from '../containers/chill-videos';
import ChillPhotos from '../containers/chill-photos';
import ChillLinks from '../containers/chill-links';
import ChillGroups from '../containers/chill-groups';
import ChillReminders from '../containers/chill-reminders';
import ChillCaps from '../containers/chill-callbacks';
import ChillAbout from '../containers/chill-about';
import ChillRewards from '../containers/chill-rewards';
import ChillFavorites from '../containers/chill-favorites';
import ChillBeStressbuster from '../containers/chill-bestressbuster';
import ChillAmStressbuster from '../containers/chill-amstressbuster';
import Library from '../containers/library';
import Notes from '../containers/notes';
import Events from '../containers/events';

const propTypes = {
  transitionOpacity: PropTypes.object.isRequired,
};

const Stack = createStackNavigator();

class Chill extends Component {
  constructor(props) {
    super(props);
    this._isSchool = this.props.accountType == 'school';
    this._schoolId = this.props.schoolId;
    this._navigator = null;

    // Removed 5/29/24
    this.onPressRow = this.onPressRow.bind(this);
  }

  componentDidMount() {
    if (this.props.nextRouteToShow) {
      if (this.props.nextRouteToShow.id == routeTypes.CHILL_VIDEOS) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.chillVideos(),
        ]);
      } else if (this.props.nextRouteToShow.id == routeTypes.CHILL_PHOTOS) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.chillPhotos(),
        ]);
      } else if (this.props.nextRouteToShow.id == routeTypes.CHILL_LINKS) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.chillLinks(),
        ]);
      } else if (this.props.nextRouteToShow.id == routeTypes.CHILL_GROUPS) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.chillGroups(),
        ]);
      } else if (this.props.nextRouteToShow.id == routeTypes.CHILL_REMINDERS) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.chillReminders(),
        ]);
      } else if (this.props.nextRouteToShow.id == routeTypes.CHILL_ABOUT) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.chillAbout(),
        ]);
      } else if (
        this.props.nextRouteToShow.id == routeTypes.CHILL_HEALTH_REWARDS
      ) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.chillHealthRewards(),
        ]);
      } else if (this.props.nextRouteToShow.id == routeTypes.CHILL_FAVORITES) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.chillFavorites(),
        ]);
      } else if (this.props.nextRouteToShow.id == routeTypes.LIBRARY) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.library(this._schoolId),
        ]);
      } else if (
        this.props.nextRouteToShow.id == routeTypes.LIBRARY_FINE_DINING
      ) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.libfinedining(),
        ]);
      } else if (
        this.props.nextRouteToShow.id == routeTypes.LIBRARY_BKS_WELLNESS
      ) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.libbkswellness(),
        ]);
      } else if (
        this.props.nextRouteToShow.id == routeTypes.LIBRARY_BKS_COLLECTION
      ) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.libbkscollection(),
        ]);
      } else if (
        this.props.nextRouteToShow.id == routeTypes.LIBRARY_SUICIDE_PREVENTION
      ) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.libsuicideprevention(),
        ]);
      } else if (this.props.nextRouteToShow.id == routeTypes.NOTES) {
        this._navigator.immediatelyResetRouteStack([
          routes.chill(),
          routes.notes(),
        ]);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.nextRouteToShow != nextProps.nextRouteToShow) {
      if (this.props.nextRouteToShow) {
        if (nextProps.nextRouteToShow.id == routeTypes.CHILL_VIDEOS) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.chillVideos(),
          ]);
        } else if (nextProps.nextRouteToShow.id == routeTypes.CHILL_PHOTOS) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.chillPhotos(),
          ]);
        } else if (nextProps.nextRouteToShow.id == routeTypes.CHILL_LINKS) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.chillLinks(this._schoolId),
          ]);
        } else if (nextProps.nextRouteToShow.id == routeTypes.CHILL_GROUPS) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.chillGroups(),
          ]);
        } else if (nextProps.nextRouteToShow.id == routeTypes.CHILL_REMINDERS) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.chillReminders(),
          ]);
        } else if (nextProps.nextRouteToShow.id == routeTypes.CHILL_ABOUT) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.chillAbout(),
          ]);
        } else if (
          nextProps.nextRouteToShow.id == routeTypes.CHILL_HEALTH_REWARDS
        ) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.chillHealthRewards(),
          ]);
        } else if (nextProps.nextRouteToShow.id == routeTypes.CHILL_FAVORITES) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.chillFavorites(),
          ]);
        } else if (nextProps.nextRouteToShow.id == routeTypes.LIBRARY) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.library(this._schoolId),
          ]);
        } else if (
          nextProps.nextRouteToShow.id == routeTypes.LIBRARY_FINE_DINING
        ) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.libfinedining(),
          ]);
        } else if (
          nextProps.nextRouteToShow.id == routeTypes.LIBRARY_BKS_WELLNESS
        ) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.libbkswellness(),
          ]);
        } else if (
          nextProps.nextRouteToShow.id == routeTypes.LIBRARY_BKS_COLLECTION
        ) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.libbkscollection(),
          ]);
        } else if (
          nextProps.nextRouteToShow.id == routeTypes.LIBRARY_SUICIDE_PREVENTION
        ) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.libsuicideprevention(),
          ]);
        } else if (nextProps.nextRouteToShow.id == routeTypes.NOTES) {
          this._navigator.immediatelyResetRouteStack([
            routes.chill(),
            routes.notes(),
          ]);
        }
      }
    }
  }

  render() {
    const {transitionOpacity, logoUrl, isStressbustersHidden, hasLibraries} =
      this.props;
    const transitionAnimatedStyles = [
      styles.sceneContainer,
      {opacity: transitionOpacity},
    ];
    const route = routes.chill();
    let subRoutes;
    if (this._schoolId === constants.LOCATION_ID_BKS) {
      subRoutes = [
        //routes.libfinedining(),
        routes.libbkswellness(),
        //routes.libbkscollection(),
        routes.chillLinks(this._schoolId),
        routes.audios(),
        routes.chillVideos(),
        routes.chillPhotos(),
        routes.breath(),

        routes.chillFavorites(),
        routes.chillReminders(),
        routes.chillHealthRewards(),
        routes.notes(),

        routes.chillAbout(),
        routes.contact(),
      ];
    } else {
      subRoutes = [
        routes.breath(),
        routes.chillFavorites(),
        routes.chillReminders(),
        routes.notes(),
        routes.chillHealthRewards(),
        routes.audios(),
        routes.chillVideos(),
        routes.chillPhotos(),
        hasLibraries ? [routes.library(this._schoolId)] : [],
        this._isSchool ? [routes.events()] : [],
        routes.chillLinks(this._schoolId),
        this._isSchool ? [routes.chillGroups()] : [],
        this._schoolId === constants.LOCATION_ID_TOLEDO
          ? [routes.libsuicideprevention()]
          : [],
        this._isSchool ? [routes.help()] : [],
        !this._isSchool || isStressbustersHidden
          ? []
          : [routes.chillAmStressbuster()],
        !this._isSchool || isStressbustersHidden
          ? []
          : [routes.chillBeStressbuster()],
        routes.chillAbout(),
        routes.contact(),
      ];
    }
    // flatten routes
    subRoutes = [].concat(...subRoutes);

    return (
      <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <Stack.Navigator
          initialRouteName={routeTypes.CHILL}
          screenOptions={{
            headerShown: true,
            header: props => <NavBar {...props} logoUrl={logoUrl} />,
          }}
          style={styles.navigator}>
          <Stack.Screen
            name={routeTypes.CHILL}
            // component={MenuFeed}
            initialParams={{
              routes: subRoutes,
              schoolId: this.props.schoolId,
              tabs: this.props.tabs,
            }}>
            {props => (
              <Animated.View style={transitionAnimatedStyles}>
                <MenuFeed {...props} onPressRow={this.onPressRow} />
              </Animated.View>
            )}
          </Stack.Screen>
          <Stack.Screen
						name={routeTypes.CHILL_FAVORITES}
						component={ChillFavorites}
						initialParams={{
							routes: subRoutes,
						}}
            // options={{presentation:'card'}}            
					>
          </Stack.Screen>
          <Stack.Screen
            name={routeTypes.CHILL_REMINDERS}
            component={ChillReminders}
            initialParams={{
              routes: subRoutes,
            }}
          />
          <Stack.Screen
            name={routeTypes.CHILL_HEALTH_REWARDS}
            component={ChillRewards}
            initialParams={{
              initialFilter: 'Earn',
              routes: subRoutes,
            }}
          />
          <Stack.Screen
            name={routeTypes.CHILL_VIDEOS}
            component={ChillVideos}
            initialParams={{
              routes: subRoutes,
            }}
          />
          <Stack.Screen
            name={routeTypes.CHILL_PHOTOS}
            component={ChillPhotos}
            initialParams={{
              routes: subRoutes,
            }}
          />
          <Stack.Screen
            name={routeTypes.CHILL_LINKS}
            component={ChillLinks}
            initialParams={{
              routes: subRoutes,
            }}
          />
          <Stack.Screen
            name={routeTypes.CHILL_GROUPS}
            component={ChillGroups}
            initialParams={{
              routes: subRoutes,
            }}
          />
          <Stack.Screen
            name={routeTypes.CHILL_CAPS}
            component={ChillCaps}
            initialParams={{
              routes: subRoutes,
            }}
          />
          <Stack.Screen
            name={routeTypes.CHILL_ABOUT}
            component={ChillAbout}
            initialParams={{
              routes: subRoutes,
            }}
          />
          <Stack.Screen
            name={routeTypes.CHILL_AM_STRESSBUSTER}
            component={ChillAmStressbuster}
            initialParams={{
              routes: subRoutes,
            }}
          />
          <Stack.Screen
            name={routeTypes.CHILL_BE_STRESSBUSTER}
            component={ChillBeStressbuster}
            initialParams={{
              routes: subRoutes,
            }}
          />
          <Stack.Screen
            name={routeTypes.LIBRARY}
            component={Library}
            initialParams={{
              navigator: this._navigator,
              routes: subRoutes,
              libraryFeature: 'libraries',
            }}
          />
          <Stack.Screen
            name={routeTypes.LIBRARY_FINE_DINING}
            component={Library}
            initialParams={{
              navigator: this._navigator,
              routes: subRoutes,
              libraryFeature: 'libfinedining',
            }}
          />
          <Stack.Screen
            name={routeTypes.LIBRARY_BKS_WELLNESS}
            component={Library}
            initialParams={{
              navigator: this._navigator,
              routes: subRoutes,
              libraryFeature: 'libbkswellness',
            }}
          />
          <Stack.Screen
            name={routeTypes.LIBRARY_BKS_COLLECTION}
            component={Library}
            initialParams={{
              navigator: this._navigator,
              routes: subRoutes,
              libraryFeature: 'libbkscollection',
            }}
          />
          <Stack.Screen
            name={routeTypes.LIBRARY_SUICIDE_PREVENTION}
            component={Library}
            initialParams={{
              navigator: this._navigator,
              routes: subRoutes,
              libraryFeature: 'libsuicideprevention',
            }}
          />
          <Stack.Screen
            name={routeTypes.NOTES}
            component={Notes}
            initialParams={{navigator: this._navigator, routes: subRoutes}}
          />
          <Stack.Screen
            name={routeTypes.EVENTS}
            component={Events}
            initialParams={{navigator: this._navigator, routes: subRoutes}}
          />          
        </Stack.Navigator>
      </View>
      </KeyboardAvoidingView>

    );
  }

  ////////////////////
  // Event Callback //
  ////////////////////

  // Removed 5/29/24
  onPressRow(route, navigation) {
    AnalyticsLib.track('Subview Select', {route: route.id});
    console.log("0")
    console.log(route.id)
    if (route.id == routes.breath().id) {
      console.log("1")
      this.props.breathActions.select();
    } else if (route.id == routes.contact().id) {
      AnalyticsLib.track('Contact');
      console.log("2")
      const appType = schoolLib.getAppType(
        this.props.accountType,
        this.props.schoolId,
      );
      const title = `${appType.name} app`;
      RNCommunications.email(
        [constants.CONTACT_EMAIL],
        null,
        null,
        title,
        null,
      );
    } else if (
      route.id == routes.chillFavorites().id &&
      schoolLib.hasFavoritesTab(this.props.tabs)
    ) {
      console.log("3")
      console.log('Favorites id', route.id);
      navigation.navigate('Favorites');
    } else if (route.id == routes.audios().id) {
      console.log("4")
      if (schoolLib.hasAudiosTab(this.props.tabs)) {
        console.log("4.1")
        navigation.navigate('Sonic Spa');
      }
    } else {
      // this._navigator.push(route);
      console.log("5")
      navigation.navigate(route.id);
      // this._navigator = navigation;
    }
  }
  //////////////////////
  // Public Functions //
  //////////////////////

  resetNav() {
    if (this._navigator) {
      this._navigator.immediatelyResetRouteStack([routes.chill()]);
    }
  }

  ///////////////
  // Functions //
  ///////////////
}

Chill.propTypes = propTypes;
const styles = StyleSheet.create({
  maincontainer:{
    flex:1,
  },
  container: {
    flex: 1,
  },
  sceneContainer: {
    flex: 1,
  },
});

export default connect(
  state => ({
    schoolId: state.app.school.id,
    accountType: state.app.school.account_type,
    logoUrl: state.app.school.logo_image_link,
    tabs: state.app.school.tabs,
    isStressbustersHidden: state.app.school.is_me_stressbusters_hidden,
    hasLibraries: state.app.school.has_libraries,
    nextRouteToShow: state.app.next_route_to_show,
  }),
  dispatch => ({
    appActions: bindActionCreators(appActions, dispatch),
    breathActions: bindActionCreators(breathActions, dispatch),
  }),
  null,
  {forwardRef: true},
)(Chill);
