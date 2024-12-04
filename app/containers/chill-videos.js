import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as chillVideosActions from '../actions/chill-videos-actions';
import * as routes from '../routes/routes';
import sc from '../../config/styles';
import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
import FeedView from '../components/feed/feed';

const propTypes = {
};

class ChillVideos extends Component {
	constructor(props) {
		super(props);

		this._feedView = null;

		this.selectFilter = this.selectFilter.bind(this);
	}

	UNSAFE_componentWillMount() {
	}

	componentDidMount() {
		this.selectFilter(this.props.filter);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
	}

	render() {
		const styles = this.constructor.styles;
		const { data, filter, filters } = this.props;
		return (
			<View style={styles.container}>
				<SlidingTabBarView
					filter={filter}
					filters={filters}
					onPressFilter={(selected) => this.selectFilter(selected)} />
				<FeedView
					ref={component => this._feedView = component}
					routeId={routes.chillVideos().id}
					data={data[filter]} />
			</View>
		);
	}


	////////////////////
	// Event Callback //
	////////////////////

	///////////////
	// Functions //
	///////////////

	selectFilter(filter) {
		this.props.chillVideosActions.selectFilter(filter);
		if (this.props.data[filter] == null) {
			this.props.chillVideosActions.loadFeed(filter);
		}
		// this._feedView.getWrappedInstance().scrollTo({y: 0, animated:false});
	}
}

ChillVideos.propTypes = propTypes;
ChillVideos.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default connect(state => ({
	data: state.chillVideos.data,
	filter: state.chillVideos.filter,
	filters: state.chillVideos.filters,
	isLoading: state.chillVideos.is_loading,
}),
	dispatch => ({
		chillVideosActions: bindActionCreators(chillVideosActions, dispatch),
	})
)(ChillVideos);
