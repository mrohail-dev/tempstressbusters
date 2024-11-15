import React, {Component} from 'react';
import { StyleSheet, View, Text  } from 'react-native';
import  Picker from '@react-native-picker/picker'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as chillBeStressbusterActions from '../actions/chill-bestressbuster-actions';
import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
import ChillBeStressbusterAbout from '../components/chill-bestressbuster-about';
import ChillBeStressbusterVideos from '../components/chill-bestressbuster-videos';
import ChillBeStressbusterApply from '../components/chill-bestressbuster-apply';

const propTypes = {
};

class ChillBeStressbuster extends Component {
  constructor(props) {
    super(props);
  }

  render() {
		const styles = this.constructor.styles;
		const { filter, filters } = this.props;
    return (
			<View style={styles.container}>
				{/* <Picker> */}
				<SlidingTabBarView
					filter={filter}
					filters={filters}
					onPressFilter={(selected) => this.selectFilter(selected)} />

				{filter == 'About Stressbusters' && <ChillBeStressbusterAbout />}

				{filter == 'Videos' && <ChillBeStressbusterVideos />}

				{filter == 'Apply Now' && <ChillBeStressbusterApply />}
				{/* </Picker> */}
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
		this.props.chillBeStressbusterActions.selectFilter(filter);
	}
}

ChillBeStressbuster.propTypes = propTypes;
ChillBeStressbuster.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default connect(state => ({
		filter			: state.chillBeStressbuster.filter,
		filters			: state.chillBeStressbuster.filters,
	}),
	dispatch => ({
		chillBeStressbusterActions	: bindActionCreators(chillBeStressbusterActions, dispatch),
	})
)(ChillBeStressbuster);
