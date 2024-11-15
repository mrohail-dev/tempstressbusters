import React, {Component} from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as activityActions from '../actions/activity-actions';
import * as chillCallbacksActions from '../actions/chill-callbacks-actions';
import * as routes from '../routes/routes';
import sc from '../../config/styles';
import FeedView from '../components/feed/feed';

const propTypes = {
};

class ChillCallbacks extends Component {
  constructor(props) {
    super(props);

		this._feedView = null;

		this.onPressOpenLink = this.onPressOpenLink.bind(this);
  }

	UNSAFE_componentWillMount() {
	}

	componentDidMount() {
		//this.props.chillCallbacksActions.loadFeed();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
	}

  render() {
		const styles = this.constructor.styles;
		const { data } = this.props;
    return (
			<View style={styles.container}>
				<Text style={styles.text}>
					You will link to Penn’s existing web form where students request a call back. Penn needs to authenticate a students’ identity which is done through that form (students enter their Penn IDs)
				</Text>

				<TouchableHighlight
					style={styles.button}
					underlayColor='#99d9f4'
					onPress={this.onPressOpenLink}>
					<Text style={styles.buttonText}>Schedule Callback</Text>
				</TouchableHighlight>
			</View>
    );
  }


	////////////////////
	// Event Callback //
	////////////////////

	onPressOpenLink() {
		this.props.activityActions.goToWebsite('https://uapps.vpul.upenn.edu/capsform/');
	}

	///////////////
	// Functions //
	///////////////

}

ChillCallbacks.propTypes = propTypes;
ChillCallbacks.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
  text: {
		...sc.text,
    alignSelf: 'center',
		margin: 20,
  },
  buttonText: {
		...sc.textActionBtton,
    alignSelf: 'center',
  },
  button: {
    height: 48,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
		margin: 20,
  },
});

export default connect(state => ({
		data				: state.chillCallbacks.data,
		isLoading		: state.chillCallbacks.is_loading,
	}),
	dispatch => ({
		activityActions				: bindActionCreators(activityActions, dispatch),
		chillCallbacksActions	: bindActionCreators(chillCallbacksActions, dispatch),
	})
)(ChillCallbacks);
