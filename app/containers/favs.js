import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import sc from '../../config/styles';
import * as routeTypes from '../routes/route-types';
import * as routes from '../routes/routes';
import NavBar from '../libs/nav-bar';
import ChillFavorites from '../containers/chill-favorites';
import {createStackNavigator} from '@react-navigation/stack';

const propTypes = {
  transitionOpacity: PropTypes.object.isRequired,
};

const Stack = createStackNavigator();
class Favs extends Component {
  constructor(props) {
    super(props);

    this._navigator = null;
  }

  UNSAFE_componentWillMount() {}

  componentDidMount() {}

  UNSAFE_componentWillReceiveProps(nextProps) {}

  render() {
    const {transitionOpacity, logoUrl} = this.props;
    const transitionAnimatedStyles = [
      styles.sceneContainer,
      {opacity: transitionOpacity},
    ];
    const route = routes.chillFavorites();
    return (
      <View style={styles.container}>
        <NavBar title={route.title} logoUrl={logoUrl} />
        <Stack.Navigator
          initialRouteName={routeTypes.CHILL_FAVORITES}
          screenOptions={{
            headerShown: false,
          }}
          style={styles.navigator}>
          <Stack.Screen
            name={routeTypes.CHILL_FAVORITES}
            component={ChillFavorites}
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
      this._navigator.immediatelyResetRouteStack([routes.chillFavorites()]);
    }
  }

  ///////////////
  // Functions //
  ///////////////
}

Favs.propTypes = propTypes;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sceneContainer: {
    flex: 1,
  },
});

export default connect(
  state => ({
    logoUrl: state.app.school.logo_image_link,
  }),
  dispatch => ({}),
  null,
  {forwardRef: true},
)(Favs);
