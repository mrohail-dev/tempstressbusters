import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
	StyleSheet,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import UserAvatar from 'react-native-user-avatar';
import sc from '../../../config/styles';

const propTypes = {
	data			: PropTypes.any,
};

class FeedCellPhoneContact extends Component {
	constructor(props) {
		super(props);

	}

	render() {
		const styles = this.constructor.styles;
		const { data } = this.props;
    let name = `${data.firstName} ${data.lastName}`.trim();
    name = (name == '') ? data.number : name;
    const initials = name.split(' ').slice(0, 2).join(' ');

		return (
			<View style={styles.container}>
        <View style={styles.containerAvatar}>
          <UserAvatar
            size="42"
            name={initials}
            src={data.thumbnailPath} />
        </View>

				<View style={styles.containerName}>
          <Text style={styles.textName}>{name}</Text>
          <Text style={styles.textNumber}>{data.number}</Text>
        </View>
			</View>
		);
	}

}

FeedCellPhoneContact.propTypes = propTypes;
FeedCellPhoneContact.styles = StyleSheet.create({
	container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
	containerAvatar: {
		flex: 0,
    width:42,
    height:42,
    marginRight: 20,
	},
	containerName: {
		flex:1,
	},
	containerContact: {
		flex:0,
	},
  textName: {
		flex:1,
		...sc.textBold,
		fontSize: sc.fontSize.library,
  },
  textLabel: {
		flex:1,
		...sc.text,
		fontSize: sc.fontSize.library,
  },
  textNumber: {
		flex:1,
		...sc.text,
		fontSize: sc.fontSize.library,
  }
});

export default connect(state => ({
	}),
	dispatch => ({
	})
)(FeedCellPhoneContact);
