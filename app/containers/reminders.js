import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sc from '../../config/styles';
import * as routeTypes from '../routes/route-types';
import * as routes from '../routes/routes';
import * as chillRemindersActions from '../actions/chill-reminders-actions';
import NavBar from '../libs/nav-bar';
import ChillReminders from '../containers/chill-reminders';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { navTheme } from './app-main';

const propTypes = {
	transitionOpacity: PropTypes.object.isRequired,
};

const Stack = createStackNavigator();
class Reminders extends Component {
	constructor(props) {
		super(props);

		// this._navigator = null;
	}

	render() {
		const { transitionOpacity, logoUrl } = this.props;
		const transitionAnimatedStyles = [styles.sceneContainer, { opacity: transitionOpacity }];
		const route = routes.chillReminders();
		return (
			<View style={styles.container}>
				<NavBar navtitle={route.title} logoUrl={logoUrl} />
				<Stack.Navigator
					initialRouteName={routeTypes.CHILL_REMINDERS}
					screenOptions={{
						headerShown: false,
					}}
				// style={styles.navigator}
				>
					<Stack.Screen
						name={routeTypes.CHILL_REMINDERS}
						component={ChillReminders}
					// initialParams={{ navigator: navigator }}
					/>
				</Stack.Navigator>
			</View>
		);
	}


	////////////////////
	// Event Callback //
	////////////////////

	//////////////////////
	// Public Functions //
	//////////////////////

	onTabDeselect() {
		this.props.chillRemindersActions.loadFeed();
	}

	///////////////
	// Functions //
	///////////////

}

Reminders.propTypes = propTypes;
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sceneContainer: {
		flex: 1,
	},
});

export default connect(state => ({
	logoUrl: state.app.school.logo_image_link,
}),
	dispatch => ({
		chillRemindersActions: bindActionCreators(chillRemindersActions, dispatch),
	}),
	null,
	{ forwardRef: true }
)(Reminders);
