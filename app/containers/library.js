import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as routes from '../routes/routes';
import * as schoolLib from '../libs/school-lib';
import * as appActions from '../actions/app-actions';
import * as breathActions from '../actions/breath-actions';
import * as libraryActions from '../actions/library-actions';
import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
import FeedView from '../components/feed/feed';
import sc from '../../config/styles';

const propTypes = {
	navigator: PropTypes.any,
	route: PropTypes.any,
	libraryFeature: PropTypes.any,
};

class Library extends Component {
	constructor(props) {
		super(props);

		this._isSchool = (this.props.accountType == 'school');
		this._feedView = null;

		this.selectFilter = this.selectFilter.bind(this);
		this.onPressShortcut = this.onPressShortcut.bind(this);
		this.props.libraryActions.loadFeed(props.route.params.libraryFeature);
	}

	render() {
		const styles = this.constructor.styles;
		const { route, data, filter, filters } = this.props;
		return (
			<View style={styles.container}>
				<SlidingTabBarView
					filter={filter}
					filters={filters}
					onPressFilter={(selected) => this.selectFilter(selected)} />
				<FeedView
					ref={component => this._feedView = component}
					routeId={route.id}
					data={data[filter]}
					onPressShortcut={this.onPressShortcut} />
			</View>
		);
	}

	///////////////
	// Functions //
	///////////////

	selectFilter(filter) {
		this.props.libraryActions.selectFilter(filter);
	}

	onPressShortcut(data) {
		const { appActions, breathActions } = this.props;

		// Tab
		if (data.related_screen == 'resources') {
			if (schoolLib.hasChillTab(this.props.tabs)) {
				appActions.selectTab(routes.chill().id);
			}
		}
		else if (data.related_screen == 'audios') {
			if (schoolLib.hasAudiosTab(this.props.tabs)) {
				appActions.selectTab(routes.audios().id);
			}
		}
		else if (data.related_screen == 'events') {
			if (schoolLib.hasEventsTab(this.props.tabs)) {
				this._isSchool && appActions.selectTab(routes.events().id);
			}
		}
		else if (data.related_screen == 'help') {
			if (schoolLib.hasHelpTab(this.props.tabs)) {
				this._isSchool && appActions.selectTab(routes.help().id);
			}
		}
		// Tab or Screen
		else if (data.related_screen == 'favorites') {
			schoolLib.hasFavoritesTab(this.props.tabs)
				? appActions.selectTab(routes.chillFavorites().id)
				: this.props.navigator.push(routes.chillFavorites());
		}
		else if (data.related_screen == 'reminders') {
			schoolLib.hasRemindersTab(this.props.tabs)
				? appActions.selectTab(routes.chillReminders().id)
				: this.props.navigator.push(routes.chillReminders());
		}
		// Screen
		else if (data.related_screen == 'breather') {
			breathActions.select();
		}
		else if (data.related_screen == 'rewards') {
			this.props.navigator.push(routes.chillHealthRewards());
		}
		else if (data.related_screen == 'videos') {
			this.props.navigator.push(routes.chillVideos());
		}
		else if (data.related_screen == 'photos') {
			this.props.navigator.push(routes.chillPhotos());
		}
		else if (data.related_screen == 'links') {
			this.props.navigator.push(routes.chillLinks());
		}
		else if (data.related_screen == 'groups') {
			this.props.navigator.push(routes.chillGroups());
		}
		else if (data.related_screen == 'am_one') {
			(!this.props.isStressbustersHidden)
				&& this.props.navigator.push(routes.chillAmStressbuster());
		}
		else if (data.related_screen == 'be_one') {
			(!this.props.isStressbustersHidden)
				&& this.props.navigator.push(routes.chillBeStressbuster());
		}
		else if (data.related_screen == 'about') {
			this.props.navigator.push(routes.chillAbout());
		}
		else if (data.related_screen == 'phone') {
			this.props.navigator.push(routes.phone());
		}
	}
}

Library.propTypes = propTypes;
Library.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default connect(state => ({
	accountType: state.app.school.account_type,
	tabs: state.app.school.tabs,
	isStressbustersHidden: state.app.school.is_me_stressbusters_hidden,
	data: state.library.data,
	filter: state.library.filter,
	filters: state.library.filters,
	isLoading: state.library.is_loading,
}),
	dispatch => ({
		appActions: bindActionCreators(appActions, dispatch),
		breathActions: bindActionCreators(breathActions, dispatch),
		libraryActions: bindActionCreators(libraryActions, dispatch),
	})
)(Library);

