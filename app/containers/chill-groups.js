import React, {Component} from 'react';
import { StyleSheet, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as routes from '../routes/routes';
import * as chillGroupsActions from '../actions/chill-groups-actions';
import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
import FeedView from '../components/feed/feed';

const propTypes = {
};

class ChillGroups extends Component {
  constructor(props) {
    super(props);

		this._feedView = null;

		this.selectFilter = this.selectFilter.bind(this);
  }

	componentDidMount() {
		this.selectFilter(this.props.filter);
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
          routeId={routes.chillGroups().id}
					ref={component => this._feedView = component}
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
		this.props.chillGroupsActions.selectFilter(filter);
		if (this.props.data[filter] == null) {
			this.props.chillGroupsActions.loadFeed(filter);
		}
		// this._feedView.getWrappedInstance().scrollTo({y: 0, animated:false});
	}
}

ChillGroups.propTypes = propTypes;
ChillGroups.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default connect(state => ({
		data				: state.chillGroups.data,
		filter			: state.chillGroups.filter,
		filters			: state.chillGroups.filters,
		isLoading		: state.chillGroups.is_loading,
	}),
	dispatch => ({
		chillGroupsActions: bindActionCreators(chillGroupsActions, dispatch),
	})
)(ChillGroups);
