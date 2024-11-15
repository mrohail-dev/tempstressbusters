import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, StyleSheet, View, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as eventsActions from '../actions/events-actions';
import * as routes from '../routes/routes';
import sc from '../../config/styles';
import NavBar from '../libs/nav-bar';
import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
import FeedView from '../components/feed/feed';

const propTypes = {
	transitionOpacity				: PropTypes.object.isRequired,
};

class Events extends Component {
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
		const { transitionOpacity, logoUrl, data, filter, filters } = this.props;
		const transitionAnimatedStyles = [styles.sceneContainer, {opacity: transitionOpacity}];
		const route = routes.events();
    return (
			<View style={styles.container}>
				<NavBar title={route.title} logoUrl={logoUrl} />
				<Animated.View style={transitionAnimatedStyles}>
					<SlidingTabBarView
						filter={filter}
						filters={filters}
						onPressFilter={(selected) => this.selectFilter(selected)} />
					<FeedView
						routeId={routes.events().id}
						ref={component => this._feedView = component}
						data={data[filter]} />
				</Animated.View>
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
		this.props.eventsActions.selectFilter(filter);
		if (this.props.data[filter] == null) {
			this.props.eventsActions.loadFeed(filter);
		}
		// this._feedView.getWrappedInstance().scrollTo({y: 0, animated:false});
	}
}

Events.propTypes = propTypes;
Events.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sceneContainer: {
		flex: 1,
	},
});

export default connect(state => ({
		logoUrl			: state.app.school.logo_image_link,
		data				: state.events.data,
		filter			: state.events.filter,
		filters			: state.events.filters,
		isLoading		: state.events.is_loading,
	}),
	dispatch => ({
		eventsActions	: bindActionCreators(eventsActions, dispatch),
	})
)(Events);
