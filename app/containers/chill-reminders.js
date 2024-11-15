import React, {Component} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as chillRemindersActions from '../actions/chill-reminders-actions';
import * as routes from '../routes/routes';
import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
import FeedView from '../components/feed/feed';

const propTypes = {
};

class ChillReminders extends Component {
  constructor(props) {
    super(props);

		this._feedView = null;

		this.onPressAdd = this.onPressAdd.bind(this);
		this.selectFilter = this.selectFilter.bind(this);
  }

	UNSAFE_componentWillMount() {
		this.props.chillRemindersActions.loadFeed();
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
          			routeId={routes.chillReminders().id}
					ref={component => this._feedView = component}
					data={data[filter]}
					onPressAdd={this.onPressAdd} />
			</View>
    );
  }


	////////////////////
	// Event Callback //
	////////////////////

	selectFilter(filter) {
		this.props.chillRemindersActions.selectFilter(filter);
		if (this.props.data[filter] == null) {
			this.props.chillRemindersActions.loadFeed(filter);
		}
		// this._feedView.getWrappedInstance().scrollTo({y: 0, animated:false});
	}

	onPressAdd(object) {
		// should not get called
	}

}

ChillReminders.propTypes = propTypes;
ChillReminders.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default connect(state => ({
		data				: state.chillReminders.data,
		filter			: state.chillReminders.filter,
		filters			: state.chillReminders.filters,
		isLoading		: state.chillReminders.is_loading,
	}),
	dispatch => ({
		chillRemindersActions: bindActionCreators(chillRemindersActions, dispatch),
	})
)(ChillReminders);
