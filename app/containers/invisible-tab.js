import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import sc from '../../config/styles';
import * as routeTypes from '../routes/route-types';
import * as routes from '../routes/routes';
import NavBar from '../libs/nav-bar';
import ChillAbout from '../containers/chill-about';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { navTheme } from './app-main';

const propTypes = {
	transitionOpacity				: PropTypes.object.isRequired,
};

const Stack = createStackNavigator()

class InvisibleTab extends Component {
  constructor(props) {
    super(props);

		this._navigator = null;
  }

	UNSAFE_componentWillMount() {
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
	}

  render() {
		const styles = this.constructor.styles;
		const { transitionOpacity, logoUrl } = this.props;
		const transitionAnimatedStyles = [styles.sceneContainer, {opacity: transitionOpacity}];
		const route = routes.chillAbout();
    return (
			<View style={styles.container}>
				<NavBar title={route.title} logoUrl={logoUrl}/>
					<Stack.Navigator
						initialRouteName={routeTypes.CHILL_ABOUT}
						screenOptions={{
							headerShown: false,
						}}
						// style={styles.navigator}
					>
						<Stack.Screen
							name={routeTypes.CHILL_ABOUT}
							component={ChillAbout}
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

	resetNav() {
		if (this._navigator) {
			this._navigator.immediatelyResetRouteStack([routes.chillAbout()]);
		}
	}

	///////////////
	// Functions //
	///////////////

}

InvisibleTab.propTypes = propTypes;
InvisibleTab.styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: isIphoneX() ? 15 : 0,
		left: 0,
		bottom: sc.tabBarHeight + getBottomSpace() - 3,
		right: 0,
	},
	sceneContainer: {
		flex: 1,
	},
});

export default connect(state => ({
		logoUrl			: state.app.school.logo_image_link,
	}),
	dispatch => ({
	}),
	null,
	{ forwardRef: true}
)(InvisibleTab);
