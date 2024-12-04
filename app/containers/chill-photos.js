import React, {Component} from 'react';
import { StyleSheet, View, Text, InteractionManager, Animated } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as chillPhotosActions from '../actions/chill-photos-actions';
import * as routes from '../routes/routes';
import sc from '../../config/styles';
import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
import FeedView from '../components/feed/feed';

const propTypes = {
};

class ChillPhotos extends Component {
  constructor(props) {
    super(props);

		this._feedView = null;
		this._chromeOpacity = new Animated.Value(0);
		this.selectFilter = this.selectFilter.bind(this);
  }

	UNSAFE_componentWillMount() {
	}

	componentDidMount() {
		this.selectFilter(this.props.filter);
		InteractionManager.runAfterInteractions(() => {
			Animated.timing( this._chromeOpacity, {
				delay: 0,
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		});
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
	}

  render() {
		const styles = this.constructor.styles;
		const { data, filter, filters } = this.props;
		const chromeAnimatedStyles = [styles.container, {opacity: this._chromeOpacity}];

    return (
		<Animated.View style={chromeAnimatedStyles}>
	<View style={styles.container}>
				<SlidingTabBarView
					filter={filter}
					filters={filters}
					onPressFilter={(selected) => this.selectFilter(selected)} />
				<FeedView
					ref={component => this._feedView = component}
          routeId={routes.chillPhotos().id}
					data={data[filter]} />
			</View>
		</Animated.View>
		
    );
  }


	////////////////////
	// Event Callback //
	////////////////////

	///////////////
	// Functions //
	///////////////

	selectFilter(filter) {
		this.props.chillPhotosActions.selectFilter(filter);
		if (this.props.data[filter] == null) {
			this.props.chillPhotosActions.loadFeed(filter);
		}
		// this._feedView.getWrappedInstance().scrollTo({y: 0, animated:false});
	}
}

ChillPhotos.propTypes = propTypes;
ChillPhotos.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default connect(state => ({
		data				: state.chillPhotos.data,
		filter			: state.chillPhotos.filter,
		filters			: state.chillPhotos.filters,
		isLoading		: state.chillPhotos.is_loading,
	}),
	dispatch => ({
		chillPhotosActions	: bindActionCreators(chillPhotosActions, dispatch),
	})
)(ChillPhotos);
