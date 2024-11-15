import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Image,
	StyleSheet,
  Text,
	TouchableHighlight,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import UserAvatar from 'react-native-user-avatar';
import RNCommunications from 'react-native-communications';
import Swipeout from '@faisolp/react-native-swipeout';
import * as phoneActions from '../../actions/phone-actions';
import sc from '../../../config/styles';

const propTypes = {
	data			: PropTypes.any,
};

class FeedCellPhoneFriend extends Component {
	constructor(props) {
		super(props);

		this.onPressDelete = this.onPressDelete.bind(this);
		this.onPressCall = this.onPressCall.bind(this);
		this.onPressSms = this.onPressSms.bind(this);
	}

	render() {
		const styles = this.constructor.styles;
		const { data } = this.props;
    let name = `${data.firstName} ${data.lastName}`.trim();
    name = (name == '') ? data.number : name;
    const swipeoutBtns = [
      {
        text: 'Delete',
        type: 'delete',
        onPress: () => this.onPressDelete(data),
      }
    ];


		return (
      <Swipeout
        style={{backgroundColor:'transparent'}}
        right={swipeoutBtns}
        autoClose={true}>

        <View style={styles.container}>
          <View style={styles.containerAvatar}>
            <UserAvatar
              size="42"
              name={name}
              src={data.thumbnailPath} />
          </View>

          <View style={styles.containerName}>
            <Text style={styles.textName}>{name}</Text>
          </View>

          <TouchableHighlight
            onPress={() => this.onPressSms(data)}
            underlayColor={sc.buttonHighlightColor}>
            <Image
              style={styles.imageSms}
              source={require('../../../images/cell/sms-72.png')} />
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() => this.onPressCall(data)}
            underlayColor={sc.buttonHighlightColor}>
            <Image
              style={styles.imageCall}
              source={require('../../../images/cell/help-48.png')} />
          </TouchableHighlight>
        </View>
      </Swipeout>
		);
	}

	///////////////
	// Functions //
	///////////////

	onPressDelete(data) {
		this.props.phoneActions.removeFriend(data);
  }

	onPressCall(data) {
		RNCommunications.phonecall(data.number, true);
  }

	onPressSms(data) {
		RNCommunications.text(data.number);
  }
}

FeedCellPhoneFriend.propTypes = propTypes;
FeedCellPhoneFriend.styles = StyleSheet.create({
	container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginVertical: 8,
  },
	containerAvatar: {
		flex: 0,
    width:38,
    height:38,
    marginRight: 20,
	},
	containerName: {
		flex:1,
	},
	containerContact: {
		flex:0,
	},
  textName: {
		flex:0,
		...sc.textBold,
		fontSize: sc.fontSize.phoneContactName,
  },
	imageCall: {
		width: 32,
		height: 32,
		marginRight: 20,
	},
	imageSms: {
		width: 32,
		height: 32,
		marginRight: 20,
	},
});

export default connect(state => ({
	}),
	dispatch => ({
		phoneActions            : bindActionCreators(phoneActions, dispatch),
	})
)(FeedCellPhoneFriend);
