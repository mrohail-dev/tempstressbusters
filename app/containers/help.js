import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as routes from '../routes/routes';
import sc from '../../config/styles';
import * as helpActions from '../actions/help-actions';
import NavBar from '../libs/nav-bar';
import FeedView from '../components/feed/feed';
import { createStackNavigator } from '@react-navigation/stack';

const propTypes = {
	transitionOpacity				: PropTypes.object.isRequired,
};

const Stack = createStackNavigator();
class Help extends Component {
  constructor(props) {
    super(props);

		this._feedView = null;

		this.onPressAdd = this.onPressAdd.bind(this);
  }

	componentDidMount() {
		this.props.helpActions.loadFeed();
	}

  render() {
		const route = routes.help();
		const { transitionOpacity, logoUrl, data } = this.props;
		const transitionAnimatedStyles = [styles.sceneContainer, {opacity: transitionOpacity}];
    return (
			<View style={styles.container}>
				<Stack.Navigator
					initialRouteName={'Get Help'}
					screenOptions={{
						headerShown: true,
						header: (props) => <NavBar {...props} logoUrl={logoUrl}/>
					}}
					style={styles.navigator}
				>
					<Stack.Screen
						name={'Get Help'}
						// component={MenuFeed}
						// initialParams={{
						// 	routes: subRoutes,
						// 	schoolId: this.props.schoolId,
						// 	tabs: this.props.tabs,
						// }}
					>
						{props =>
							<Animated.View style = {transitionAnimatedStyles}>
								<FeedView
									routeId={routes.help().id}
									ref={component => this._feedView = component}
									data={data}
									onPressAdd={this.onPressAdd} />
							</Animated.View>
						}
					</Stack.Screen>
			</Stack.Navigator>
			</View>
    );
  }


	////////////////////
	// Event Callback //
	////////////////////

	onPressAdd(object) {
		// should not get called
	}

	///////////////
	// Functions //
	///////////////

}

Help.propTypes = propTypes;
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sceneContainer: {
		flex: 1,
	},
});

export default connect(state => ({
		logoUrl			: state.app.school.logo_image_link,
		data				: state.help.data,
	}),
	dispatch => ({
		helpActions	: bindActionCreators(helpActions, dispatch),
	})
)(Help);
