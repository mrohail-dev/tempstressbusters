import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
	StyleSheet,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import sc from '../../../config/styles';

const propTypes = {
	data			: PropTypes.any,
};

class FeedCellTextView extends Component {
	render() {
		const styles = this.constructor.styles;
		const { data } = this.props;
		return (
      <View style={styles.container}>
        <Text style={styles.textTitle}>{data.title}</Text>
				<Text style={styles.textContent}>{data.content}</Text>
			</View>
		);
	}

}

FeedCellTextView.propTypes = propTypes;
FeedCellTextView.styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
  },
	textTitle: {
		...sc.textBold,
		paddingBottom: 10,
		fontSize: sc.fontSize.library,
	},
	textContent: {
		...sc.text,
		fontSize: sc.fontSize.library,
	},
});

export default connect(state => ({
	}),
	dispatch => ({
	})
)(FeedCellTextView);
