import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	ActivityIndicator,
	Image,
	ListView,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sc from '../../../config/styles';
import * as strings from '../../../config/strings';
import * as constants from '../../../config/constants';
import * as appActions from '../../actions/app-actions';
import FeedCell from '../feed-cell/feed-cell';
import styles from './sectioned-feed-styles';


const propTypes = {
	data			: PropTypes.any,
};

class SectionedFeed extends Component {
	constructor(props) {
		super(props);

		this._listView = null;

		this.renderRow = this.renderRow.bind(this);
		this.renderFeedView = this.renderFeedView.bind(this);
		this.renderSeparator = this.renderSeparator.bind(this);
		this.renderSectionHeader = this.renderSectionHeader.bind(this);
		this.scrollTo = this.scrollTo.bind(this);
		this.onPressAdd = this.onPressAdd.bind(this);
	}

	componentDidMount() {
	}

	render() {
		return this.props.data
			? this.renderFeedView()
			: this.renderLoadingView();
	}

	renderLoadingView() {
		const styles = this.constructor.styles;
		const containerStyles = [styles.loadingContainer, {opacity: this._spinnerOpacity}];

		return (
			<ActivityIndicator
				style={styles.container}
				size='large' />
		);
	}

	renderFeedView() {
		const styles = this.constructor.styles;
		const dataSource = new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2,
				sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
			})
			.cloneWithRowsAndSections(this.props.data);
		return (
			<View style={styles.container}>
				<ListView
					ref={component => this._listView = component}
					automaticallyAdjustContentInsets={false}
					dataSource={dataSource}
					enableEmptySections={true}
					renderRow={this.renderRow}
					renderSectionHeader={this.renderSectionHeader}
					renderSeparator={this.renderSeparator}
					scrollsToTop={true}
					showsVerticalScrollIndicator={false}
					style={styles.container} />
			</View>
		);
	}

	renderRow(param, sectionId, rowId) {
		const styles = this.constructor.styles;
		const { data, selectedObject } = this.props;
		const imageSrc = require('../../../images/cell-activity-bar/more-48.png');
		const canShare = (param.type != strings.OBJECT_TYPE_HELP)
			&& (param.type != strings.OBJECT_TYPE_REMINDER)
			&& (param.type != strings.OBJECT_TYPE_REWARD_EARN)
			&& (param.type != strings.OBJECT_TYPE_REWARD_SPEND);

		return (
			<View style={styles.cellContainer}>
				<FeedCell data={param} />

				{canShare &&
					<TouchableHighlight
						style={styles.activityButton}
						underlayColor={'transparent'}
						onPress={() => this.onPressAdd(param)}>
						<Image
							style={styles.activityButtonImage}
							source={imageSrc} />
					</TouchableHighlight>}
			</View>
		);
	}

	renderSectionHeader(sectionData, category) {
		return (
			<View style={styles.sectionHeaderContainer}>
				<Text style={styles.sectionHeaderText}>{category}</Text>
			</View>
		)
	}

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		const styles = this.constructor.styles;
		const isLast = (rowID == this.props.data.length - 1);
    return (
      <View
				key={`${sectionID}-${rowID}`}
				style={isLast ? styles.separatorLast : styles.separator} />
    );
	}


	///////////////////////
	// Delegate Callback //
	///////////////////////

	////////////////////
	// Event Callback //
	////////////////////

	onPressAdd(object) {
		this.props.appActions.selectObject(object, constants.SELECTED_OBJECT_MODE_ALL);
	}

	///////////////////
	// API Functions //
	///////////////////
	scrollTo(options) {
		// Note: do not scroll to top if listView has not been created
		if (this._listView) {
			this._listView.scrollTo(options);
		}
	}

	///////////////
	// Functions //
	///////////////

	handleSubmitForm() {
	}

}

SectionedFeed.propTypes = propTypes;
SectionedFeed.styles = StyleSheet.create(styles);

export default connect(state => ({
		selectedObject					: state.app.selected_object,
	}),
	dispatch => ({
		appActions	: bindActionCreators(appActions, dispatch),
	}),
	null,
	{ forwardRef: true}
)(SectionedFeed);
