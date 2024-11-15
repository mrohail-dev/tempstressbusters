import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Animated, InteractionManager, StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AnalyticsLib from '../libs/analytics-lib';
import * as appActions from '../actions/app-actions';
import * as breathActions from '../actions/breath-actions';
import * as homeActions from '../actions/home-actions';
import * as audiosActions from '../actions/audios-actions';
import * as routeTypes from '../routes/route-types';
import * as routes from '../routes/routes';
import * as schoolLib from '../libs/school-lib';
import NavBar from '../libs/nav-bar';
import FeedView from '../components/feed/feed';
import HomeShortcuts from '../components/home-shortcuts';
import ChillVideos from '../containers/chill-videos';
import ChillPhotos from '../containers/chill-photos';
import ChillLinks from '../containers/chill-links';
import ChillGroups from '../containers/chill-groups';
import ChillReminders from '../containers/chill-reminders';
import ChillCaps from '../containers/chill-callbacks';
import ChillFavorites from '../containers/chill-favorites';
import ChillBeStressbuster from '../containers/chill-bestressbuster';
import ChillAmStressbuster from '../containers/chill-amstressbuster';
import Library from '../containers/library';
import Phone from '../containers/phone';
import Notes from '../containers/notes';
import chillAbout from './chill-about';
import chillRewards from './chill-rewards';

const propTypes = {
	transitionOpacity				: PropTypes.object.isRequired,
};

const Stack = createStackNavigator();

class Home extends Component {
  constructor(props) {
    super(props);

    this._isSchool = (this.props.accountType == 'school');
    this._schoolId = this.props.schoolId;
		this._navigator = [];
		this._feedView = null;

		this.selectFilter = this.selectFilter.bind(this);
		this.onPressShortcut = this.onPressShortcut.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
  }

	UNSAFE_componentWillMount() {
	}

	componentDidMount() {
		this.selectFilter(this.props.filter);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
	}

	componentDidUpdate(prevProps) {
		// Migration
		if (
			prevProps.appActions.selected_tab !== this.props.appActions.selected_tab && 
			this.props.appActions.selected_tab === routes.home().id
		) {
			this.resetNav();
		}
	}

  render() {
		const { transitionOpacity, logoUrl, data, isLoading, filter, filters } = this.props;
		const transitionAnimatedStyles = [styles.sceneContainer, {opacity: transitionOpacity}];
		let route = routes.home();
		route.title = this._isSchool ? route.title : 'Hello';
		const { selectedInvisibleTab } = this.props;
    return (
			<View style={styles.container}>
					<Stack.Navigator
						initialRouteName={routeTypes.HOME}
						screenOptions={{
							headerShown: true,
							...TransitionPresets.FadeFromBottomAndroid, // For FadeAndroid transition
							header: (props) => <NavBar {...props} title = {route.title} logoUrl={logoUrl}/>
						}}
					>
						<Stack.Screen name={routeTypes.HOME} options={{ title: 'Home' }} initialParams={{routes: this.props.tabs}}>
							{props => (
								<Animated.View style={transitionAnimatedStyles}>
									<FeedView
										{...props}
										ref={(component) => (this._feedView = component)}
										routeId={route.id}
										isRefreshing={isLoading}
										data={data[filter]}
										onPressShortcut={this.onPressShortcut}
										onRefresh={this.onRefresh}
									/>
									<HomeShortcuts />
								</Animated.View>
							)}
						</Stack.Screen>
						<Stack.Screen name={routes.chillFavorites().title} component={ChillFavorites} />
						<Stack.Screen name={routes.chillReminders().title} component={ChillReminders} />
						<Stack.Screen name={routes.chillHealthRewards().title} component={chillRewards} />
						<Stack.Screen name={routes.chillVideos().title} component={ChillVideos} />
						<Stack.Screen name={routes.chillPhotos().title} component={ChillPhotos} />
						<Stack.Screen name={routes.library().title}>
							{(screenProps) => <Library {...screenProps} libraryFeature="libraries" />}
						</Stack.Screen>
						<Stack.Screen name={routes.libfinedining().title}>
							{(screenProps) => <Library {...screenProps} libraryFeature="libfinedining" />}
						</Stack.Screen>
						<Stack.Screen name={routes.libbkswellness().title}>
							{(screenProps) => <Library {...screenProps} libraryFeature="libbkswellness" />}
						</Stack.Screen>
						<Stack.Screen name={routes.libbkscollection().title}>
							{(screenProps) => <Library {...screenProps} libraryFeature="libbkscollection" />}
						</Stack.Screen>
						<Stack.Screen name={routes.libsuicideprevention().title}>
							{(screenProps) => <Library {...screenProps} libraryFeature="libsuicideprevention" />}
						</Stack.Screen>
						<Stack.Screen name={routes.phone().title} component={Phone} />
						<Stack.Screen name={routeTypes.NOTES} component={Notes} />
						<Stack.Screen name={routes.chillLinks().title} component={ChillLinks} />
						<Stack.Screen name={routes.chillGroups().title} component={ChillGroups} />
						<Stack.Screen name={routeTypes.CHILL_CAPS} component={ChillCaps} />
						<Stack.Screen name={'About'} component={chillAbout}/>
						<Stack.Screen name={routes.chillAmStressbuster().title} component={ChillAmStressbuster} />
						<Stack.Screen name={routes.chillBeStressbuster().title} component={ChillBeStressbuster} />
					</Stack.Navigator>
			</View>
    );
  }

	////////////////////
	// Event Callback //
	////////////////////

	onPressShortcut(data, navigation) {
		const { appActions, audiosActions, breathActions } = this.props;
    // Tab
	  if (data.related_screen == 'resources') {
		if (schoolLib.hasChillTab(this.props.tabs)) {
			// appActions.selectTab(routes.chill().id);
			navigation.navigate(routes.chill().title);
		}
	  } else if (data.related_screen && data.related_screen.startsWith('audios')) {
      if (schoolLib.hasAudiosTab(this.props.tabs)) {
        audiosActions.selectFilter(data.related_screen.split(':').pop());
        // appActions.selectTab(routes.audios().id);
		navigation.navigate(routes.audios().title)
      }
		}
		else if (data.related_screen == 'events') {
      if (schoolLib.hasEventsTab(this.props.tabs)) {
        // this._isSchool && appActions.selectTab(routes.events().id);
		this._isSchool && navigation.navigate(routes.events().title)
      }
		}
		else if (data.related_screen == 'help') {
      if (schoolLib.hasHelpTab(this.props.tabs)) {
        // this._isSchool && appActions.selectTab(routes.help().id);
		this._isSchool && navigation.navigate(routes.help().title)
      }
		}
    // Tab or Screen
		else if (data.related_screen == 'favorites') {
      schoolLib.hasFavoritesTab(this.props.tabs)
        // ? appActions.selectTab(routes.chillFavorites().id)
        // : this._navigator.push(routes.chillFavorites());
		? navigation.navigate(routes.chillFavorites().title)
		: navigation.navigate(routes.chillFavorites().title)
		}
		else if (data.related_screen == 'reminders') {
    //   schoolLib.hasRemindersTab(this.props.tabs)
    //     ? appActions.selectTab(routes.chillReminders().id)
    //     : this._navigator.push(routes.chillReminders());
		navigation.navigate(routes.chillReminders().title)
		}
    // Screen
		else if (data.related_screen == 'breather') {
      breathActions.select();
		}
		else if (data.related_screen == 'rewards') {
      this._navigator.push(routes.chillHealthRewards());
			navigation.navigate(routes.chillHealthRewards().title)
		}
		else if (data.related_screen == 'videos') {
			// this._navigator.push(routes.chillVideos());
			navigation.navigate(routes.chillVideos().title)
		}
		else if (data.related_screen == 'photos') {
			// this._navigator.push(routes.chillPhotos());
			navigation.navigate(routes.chillPhotos().title)
		}
		else if (data.related_screen == 'library') {
			// this._navigator.push(routes.library(this._schoolId));
			navigation.navigate(routes.library().title)
		}
		else if (data.related_screen == 'libfinedining') {
			this._navigator.push(routes.libfinedining());
			navigation.navigate(routes.libfinedining().title)
		}
		else if (data.related_screen == 'libbkswellness') {
			// this._navigator.push(routes.libbkswellness());
			navigation.navigate(routes.libbkswellness().title)
		}
		else if (data.related_screen == 'libbkscollection') {
			// this._navigator.push(routes.libbkscollection());
			navigation.navigate(routes.libbkscollection().title)
		}
		else if (data.related_screen == 'libsuicideprevention') {
			// this._navigator.push(routes.libsuicideprevention());
			navigation.navigate(routes.libsuicideprevention().title)
		}
		else if (data.related_screen == 'phone') {
			navigation.navigate(routes.phone().title)
		}
		else if (data.related_screen == 'notes') {
			navigation.navigate('NOTES')	
		}
		else if (data.related_screen == 'links') {
			// this._navigator.push(routes.chillLinks());
			navigation.navigate(routes.chillLinks().title)
		}
		else if (data.related_screen == 'groups') {
			// this._navigator.push(routes.chillGroups());
			navigation.navigate(routes.chillGroups().title)
		}
		else if (data.related_screen == 'am_one') {
			( ! this.props.isStressbustersHidden)
        && navigation.navigate(routes.chillAmStressbuster().title)
		}
		else if (data.related_screen == 'be_one') {
			( ! this.props.isStressbustersHidden)
			  && navigation.navigate(routes.chillBeStressbuster().title)
		}
		else if (data.related_screen == 'about') {
			// this._navigator.push(routes.chillAbout());
			navigation.navigate('About')
		}
	}

	onRefresh() {
    this.props.homeActions.loadFeed(this.props.filter);
  	}

	//////////////////////
	// Public Functions //
	//////////////////////

	resetNav() {
		if (this._navigator) {
			this._navigator.immediatelyResetRouteStack([routes.home()]);
		}
	}

	///////////////
	// Functions //
	///////////////

	selectFilter(filter) {
		AnalyticsLib.track('Filter Select', {
			route: routes.home().id,
			filter: filter
		});

		this.props.homeActions.selectFilter(filter);
		if (this.props.data[filter] == null) {
			this.props.homeActions.loadFeed(filter);
		}
		// this._feedView.getWrappedInstance().scrollTo({y: 0, animated:false});
	}
}

Home.propTypes = propTypes;
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sceneContainer: {
		flex: 1,
	},
});

export default connect(state => ({
		schoolId  			        : state.app.school.id,
		accountType			        : state.app.school.account_type,
		logoUrl			            : state.app.school.logo_image_link,
		tabs  			            : state.app.school.tabs,
		isStressbustersHidden	  : state.app.school.is_me_stressbusters_hidden,
		data				            : state.home.data,
		filter			            : state.home.filter,
		filters			            : state.home.filters,
		isLoading		            : state.home.is_loading,
		selectedInvisibleTab  : state.app.selected_invisible_tab,
	}),
	dispatch => ({
		appActions		: bindActionCreators(appActions	, dispatch),
		audiosActions	: bindActionCreators(audiosActions, dispatch),
		breathActions	: bindActionCreators(breathActions	, dispatch),
		homeActions   : bindActionCreators(homeActions, dispatch),
	}),
	null,
	{ forwardRef: true}
)(Home);
