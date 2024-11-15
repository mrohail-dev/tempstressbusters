import React, {Component} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as favActions from '../actions/favorite-actions';
import * as routes from '../routes/routes';
import sc from '../../config/styles';
import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
import FeedView from '../components/feed/feed';

const propTypes = {
};

class MeFavorites extends Component {
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
          routeId={routes.chillFavorites().id}
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
		this.props.favActions.selectFilter(filter);
		if (this.props.data[filter] == null) {
			this.props.favActions.loadFeed();
		}
		// this._feedView.getWrappedInstance().scrollTo({y: 0, animated:false});
	}
}

MeFavorites.propTypes = propTypes;
MeFavorites.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default connect(state => ({
		data				: state.favorites.data,
		filter			: state.favorites.filter,
		filters			: state.favorites.filters,
		isLoading		: state.favorites.is_loading,
	}),
	dispatch => ({
		favActions	: bindActionCreators(favActions, dispatch),
	})
)(MeFavorites);
