import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Image,
	StyleSheet,
  Text,
	TouchableHighlight,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import CheckBox from 'react-native-check-box'
import Swipeout from '@faisolp/react-native-swipeout';
import * as notesActions from '../../actions/notes-actions';
import sc from '../../../config/styles';
import * as constants from '../../../config/constants';

const propTypes = {
	data			      : PropTypes.any,
	onPressNoteEdit : PropTypes.any,
};

class FeedCellNote extends Component {
	constructor(props) {
		super(props);

		this.onPressDelete = this.onPressDelete.bind(this);
		this.onToggleGoal = this.onToggleGoal.bind(this);
	}

	render() {
		const styles = this.constructor.styles;
		const { data } = this.props;
    const swipeoutBtns = [
      {
        text: 'Edit',
        type: 'primary',
        onPress: () => this.props.onPressNoteEdit(data),
      },
      {
        text: 'Delete',
        type: 'delete',
        onPress: () => this.onPressDelete(data),
      }
    ];
    const date = moment(data.date).format('MMMM DD, YYYY');

		return (
      <Swipeout
        style={{backgroundColor:'transparent'}}
        right={swipeoutBtns}
        autoClose={true}>

        <View style={styles.container}>
          { (data.categories[0] == constants.NOTE_TYPES.Journal.category) &&
            <Text style={styles.textDate}>{date}</Text>
          }

          { (data.categories[0] != constants.NOTE_TYPES.Goal.category) &&
            <Text style={styles.textContent}>{data.content}</Text>
          }

          { (data.categories[0] == constants.NOTE_TYPES.Goal.category) &&
            <CheckBox
              style={{flex: 1}}
              checkBoxColor={sc.colors.white}
              onClick={()=>this.onToggleGoal(data)}
              isChecked={data.checked}
              rightText={data.content}
              rightTextStyle={StyleSheet.flatten([
                styles.textContent,
                {
                  textDecorationLine: (data.checked ? 'line-through' : 'none'),
                }
              ])}
            />
          }
        </View>
      </Swipeout>
		);
	}

	///////////////
	// Functions //
	///////////////

	onPressDelete(data) {
		this.props.notesActions.removeNote(data);
  }

	onPressEdit(data) {
		//this.props.notesActions.removeNote(data);
  }

	onToggleGoal(data) {
		this.props.notesActions.toggleGoal(data);
  }
}

FeedCellNote.propTypes = propTypes;
FeedCellNote.styles = StyleSheet.create({
	container: {
    flex: 1,
    margin: 10,
    marginHorizontal: 20,
  },
  textDate: {
		flex:0,
		...sc.textBold,
		fontSize: 15,
    marginBottom: 10,
  },
  textContent: {
		...sc.text,
		fontSize: 15,
  },
});

export default connect(state => ({
	}),
	dispatch => ({
		notesActions            : bindActionCreators(notesActions, dispatch),
	})
)(FeedCellNote);
