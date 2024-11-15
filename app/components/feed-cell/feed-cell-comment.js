import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
	StyleSheet,
	View,
} from 'react-native';
import sc from '../../../config/styles';
import * as dateLib from '../../libs/date-lib';

const propTypes = {
	data			            : PropTypes.any,
	onPressCommentReply		: PropTypes.any,
};

export default class FeedCellCommentView extends Component {
	render() {
		const styles = this.constructor.styles;
		const { data } = this.props;
    const isChild = !! data.parentId;
		const dateStr = dateLib.formatRelativeDate(data.created_at);
		return (
      <View style={styles.container}>
        { data.parent_id &&
          <View style={styles.containerIndent} /> }

        <View style={styles.containerContent}>
          <Text style={styles.textTitle}>{data.screen_name}</Text>
          <Text style={styles.textDate}>{dateStr} ago</Text>
          <Text style={styles.textContent}>{data.content}</Text>
          { ! data.parent_id &&
            <TouchableOpacity
              style={styles.buttonReply}
              onPress={() => this.props.onPressCommentReply(data)}>
              <Text style={styles.textReply}>Reply</Text>
            </TouchableOpacity> }
        </View>
			</View>
		);
	}

}

FeedCellCommentView.propTypes = propTypes;
FeedCellCommentView.styles = StyleSheet.create({
	container: {
		flex: 1,
    flexDirection: 'row',
		padding: 10,
  },
	containerIndent: {
		flex: 1,
  },
	containerContent: {
		flex: 10,
  },
	textTitle: {
    flex: 1,
		...sc.textBold,
		fontSize: 15,
	},
	textDate: {
		...sc.text,
		fontSize: 15,
    color: sc.colors.gray,
    marginBottom: 10,
	},
	textContent: {
		...sc.text,
		fontSize: 15,
	},
	textReply: {
		...sc.textBold,
		fontSize: 15,
	},
	buttonReply: {
    flex: 0,
    borderWidth: 0,
    paddingTop: 10,
    paddingRight: 0,
    alignItems: 'flex-end',
	},
});
