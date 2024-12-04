import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, 	InteractionManager, Animated } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as chillRewardsActions from '../actions/chill-rewards-actions';
import * as routes from '../routes/routes';
import * as strings from '../../config/strings';
import sc from '../../config/styles';
import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
import FeedView from '../components/feed/feed';
import ChillRewardsScanView from '../components/chill-rewards-scan';
import ChillRewardsGiveView from '../components/chill-rewards-give';

const propTypes = {
	initialFilter: PropTypes.any,
};


class ChillRewards extends Component {
	constructor(props) {
		super(props);
		this._chromeOpacity = new Animated.Value(0);
		this._feedView = null;
	}

	componentDidMount() {
		// Add 'Give' filter if has donees
		if ((this.props.donees || []).length > 0) {
			this.props.chillRewardsActions.addGiveFilter();
		}

		InteractionManager.runAfterInteractions(() => {
			Animated.timing( this._chromeOpacity, {
				delay: 0,
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		});


		this.selectFilter(this.props.initialFilter || this.props.filter);
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
					filters={filters.filter((itm) => itm !== "Scan")}
					onPressFilter={(selected) => this.selectFilter(selected)} />

				{(filter == 'Earn'
					|| (filter == 'Spend' && !this.props.isRewardsHidden)
					|| filter == 'Badges') &&
					<FeedView
						routeId={routes.chillHealthRewards().id}
						ref={component => this._feedView = component}
						data={data[filter]}
						onPressAdd={this.onPressAdd} />}

				{!this.props.isRewardsHidden && filter == 'Scan' && <ChillRewardsScanView />}

				{filter == 'Give' && <ChillRewardsGiveView />}

				{this.props.isRewardsHidden && (filter == 'Spend' || filter == 'Scan') &&
					<View style={styles.containerEmpty}>
						<Text style={styles.textEmpty}>Currently, there are no Health Rewards spending opportunities.</Text>
					</View>
				}
			</View>
			</Animated.View>
			
		);
	}


	////////////////////
	// Event Callback //
	////////////////////

	onPressAdd = object => {
	}

	///////////////
	// Functions //
	///////////////

	selectFilter = filter => {
		this.props.chillRewardsActions.selectFilter(filter);
		if (this.props.data[filter] == null) {
			this.props.chillRewardsActions.loadFeed(filter);
		}

		if (this._feedView) {
			// this._feedView.getWrappedInstance().scrollTo({y: 0, animated:false});
		}
	}
}

ChillRewards.propTypes = propTypes;
ChillRewards.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	containerEmpty: {
		flex: 1,
	},
	textEmpty: {
		...sc.textShadow,
		color: sc.colors.white,
		fontFamily: 'HelveticaNeue',
		fontSize: sc.fontSize.plain,
		marginTop: '40%',
		textAlign: 'center',
	},
});

export default connect(state => ({
	isRewardsHidden: state.app.school.is_me_rewards_hidden,
	donees: state.app.school.reward_donees,
	data: state.chillRewards.data,
	filter: state.chillRewards.filter,
	filters: state.chillRewards.filters,
	isLoading: state.chillRewards.is_loading,
}),
	dispatch => ({
		chillRewardsActions: bindActionCreators(chillRewardsActions, dispatch),
	})
)(ChillRewards);
