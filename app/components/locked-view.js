import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sc from '../../config/styles';
import * as constants from '../../config/constants';
import * as routeTypes from '../routes/route-types';
import * as accessCodeActions from '../actions/access-code-actions';

const propTypes = {
	locked			: PropTypes.bool.isRequired,
  iconTop     : PropTypes.number,
  iconLeft    : PropTypes.number,
};

class LockedView extends Component {
	constructor(props) {
		super(props);

		this.onPress = this.onPress.bind(this);
	}

	render() {
    return this.props.locked
      ? this.renderInactive()
      : this.renderActive();
  }

	renderActive() {
		return (
      <View>
        { this.props.children }
      </View>
		);
	}

	renderInactive() {
		const styles = this.constructor.styles;
		return (
      <TouchableOpacity
        onPress={this.onPress}>
        <View
          style={sc.inactive}
          pointerEvents={'none'}>
          { this.props.children }
        </View>

        <Image
          style={[styles.imageLock, {
            top: this.props.iconTop || 0,
            left: this.props.iconLeft || 0,
          }]}
          source={require('../../images/chrome/lock.png')} />

      </TouchableOpacity>
		);
	}

	onPress() {
    this.props.accessCodeActions.showModal();
  }

}

LockedView.propTypes = propTypes;
LockedView.styles = StyleSheet.create({
  imageLock: {
    position: 'absolute',
    width: 16,
    height: 16,
    opacity: 0.7,
  },
});

export default connect(state => ({
	}),
	dispatch => ({
    accessCodeActions     : bindActionCreators(accessCodeActions, dispatch),
	})
)(LockedView);
