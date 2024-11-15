import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as routes from '../routes/routes';
import * as appActions from '../actions/app-actions';

const propTypes = {
  logoUrl: PropTypes.string,
};

class NavRewardButton extends Component {
  constructor(props) {
    super(props);

    this.onLogoClick = this.onLogoClick.bind(this);
  }

  render() {
    return (
      <TouchableWithoutFeedback
        style={styles.button}
        onPress={this.onLogoClick}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={{uri: this.props.logoUrl}} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  ////////////////////
  // Event Callback //
  ////////////////////

  onLogoClick() {
    this.props.appActions.selectInvisibleTab(routes.about().title);
  }
}

NavRewardButton.propTypes = propTypes;
const styles = StyleSheet.create({
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    width: 120,
  },
  button: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  logo: {
    width: 42,
    height: 42,
  },
});

export default connect(
  state => ({}),
  dispatch => ({
    appActions: bindActionCreators(appActions, dispatch),
  }),
)(NavRewardButton);
