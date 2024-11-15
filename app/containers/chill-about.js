import React, {Component} from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as activityActions from '../actions/activity-actions';
import sc from '../../config/styles';
import * as strings from '../../config/strings';
import FeedView from '../components/feed/feed';

const propTypes = {
};

class ChillAbout extends Component {
  constructor(props) {
    super(props);

		this.onPressContact = this.onPressContact.bind(this);
  }

	UNSAFE_componentWillMount() {
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
	}

  render() {
		const styles = this.constructor.styles;
		const { titles, contents } = this.props;
    return (
			<ScrollView style={styles.container}>
				{
					(titles || []).map((title, index) => {
						const content = contents[index];
						return (
							<View key={index}>
								<Text style={styles.textTitle}>{title}</Text>
								<Text style={styles.textContent}>{content}</Text>
							</View>
						);
					})
				}
			</ScrollView>
    );

//				<TouchableHighlight
//					style={styles.button}
//					underlayColor='#99d9f4'
//					onPress={this.onPressContact}>
//					<Text style={styles.buttonText}>Contact Us</Text>
//				</TouchableHighlight>
  }


	////////////////////
	// Event Callback //
	////////////////////

	onPressContact() {
		//this.props.activityActions.sendUsEmail();
	}

	///////////////
	// Functions //
	///////////////

}

ChillAbout.propTypes = propTypes;
ChillAbout.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	textTitle: {
		...sc.textBold,
		margin: 20,
		marginBottom: 10,
	},
	textContent: {
		...sc.text,
		margin: 20,
		marginTop: 0,
		marginBottom: 10,
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
		titles: state.app.school.about_titles,
		contents: state.app.school.about_contents,
	}),
	dispatch => ({
		activityActions	: bindActionCreators(activityActions, dispatch),
	})
)(ChillAbout);
