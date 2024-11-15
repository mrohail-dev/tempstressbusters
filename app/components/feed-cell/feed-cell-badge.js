import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
	StyleSheet,
	View,
} from 'react-native';
import sc from '../../../config/styles';

const propTypes = {
	data			: PropTypes.any,
};

export default class FeedCellBadgeView extends Component {
	render() {
		const styles = this.constructor.styles;
		const { data } = this.props;
		return (
      <View style={styles.container}>
        <View style={styles.containerTitle}>
          <Text style={styles.textTitle}>{data.title}</Text>
          <Text style={styles.textPoints}>{data.points}</Text>
        </View>
				<Text style={styles.textContent}>{data.content}</Text>
			</View>
		);
	}

}

FeedCellBadgeView.propTypes = propTypes;
FeedCellBadgeView.styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
  },
	containerTitle: {
		flex: 1,
    flexDirection: 'row',
		paddingBottom: 10,
  },
	textTitle: {
    flex: 1,
		...sc.textBold,
		fontSize: 15,
	},
	textPoints: {
    flex: 0,
		...sc.textBold,
		fontSize: 15,
	},
	textContent: {
		...sc.text,
		fontSize: 15,
	},
});
