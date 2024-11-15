import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as chillAmStressbusterActions from '../actions/chill-amstressbuster-actions';
import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
import FeedView from '../components/feed/feed';
import SectionedFeedView from '../components/sectioned-feed/sectioned-feed';
import ChillAmStressbusterLoginForm from '../components/chill-amstressbuster-login';

const propTypes = {};

class ChillAmStressbuster extends Component {
  constructor(props) {
    super(props);

    this._feedView = null;

    this.selectFilter = this.selectFilter.bind(this);
  }

  UNSAFE_componentWillMount() {}

  componentDidMount() {
    this.selectFilter(this.props.filter);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {}

  render() {
    const {userId} = this.props;
    return userId ? this.renderLoggedIn() : this.renderNotLoggedIn();
  }

  renderLoggedIn() {
    const styles = this.constructor.styles;
    const {data, filter, filters} = this.props;
    return (
      <View style={styles.container}>
        <SlidingTabBarView
          filter={filter}
          filters={filters}
          onPressFilter={selected => this.selectFilter(selected)}
        />

        {(filter == 'Messages' || filter == 'Event Signup') && (
          <FeedView
            ref={component => (this._feedView = component)}
            data={data[filter]}
          />
        )}

        {filter == 'Better Busting' && (
          <SectionedFeedView
            ref={component => (this._feedView = component)}
            data={data[filter]}
          />
        )}
      </View>
    );
  }

  renderNotLoggedIn() {
    return <ChillAmStressbusterLoginForm />;
  }

  ////////////////////
  // Event Callback //
  ////////////////////

  ///////////////
  // Functions //
  ///////////////

  selectFilter(filter) {
    this.props.chillAmStressbusterActions.selectFilter(filter);
    if (this.props.data[filter] == null) {
      this.props.chillAmStressbusterActions.loadFeed(filter);
    }

    // scroll feed only if user is logged in, and feed is rendered
    if (this._feedView) {
      this._feedView.getWrappedInstance().scrollTo({y: 0, animated: false});
    }
  }
}

ChillAmStressbuster.propTypes = propTypes;
ChillAmStressbuster.styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(
  state => ({
    userId: state.app.user_id,
    data: state.chillAmStressbuster.data,
    filter: state.chillAmStressbuster.filter,
    filters: state.chillAmStressbuster.filters,
    isLoading: state.chillAmStressbuster.is_loading,
  }),
  dispatch => ({
    chillAmStressbusterActions: bindActionCreators(
      chillAmStressbusterActions,
      dispatch,
    ),
  }),
)(ChillAmStressbuster);
