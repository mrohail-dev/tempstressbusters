import React, {Component} from 'react';
import { StyleSheet, ListView, View, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Test extends Component {
  constructor(props) {
    super(props);

		this.renderRow = this.renderRow.bind(this);
		this.renderSeparator = this.renderSeparator.bind(this);
  }

  render() {
		const data = [1, 2, 3, 4, 5];
		const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
			.cloneWithRows(data);

    return (
			<View style={{flex: 1}}>
				<ListView
					automaticallyAdjustContentInsets={false}
					dataSource={dataSource}
					enableEmptySections={true}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator}
					style={{flex:1, backgroundColor:'green', flexWrap: 'wrap',}} />
			</View>
    );
  }

	renderRow(param, sectionId, rowId) {

		if (rowId == 1) {
			return (
				<View style={{flex:0, backgroundColor:'red'}}>
					<Text>{rowId}</Text>
					<Text>line 2</Text>
					<Text>line 3</Text>
					<Text>line 4</Text>
					<Text>line 5</Text>
				</View>
			);
		}

		return (
			<View style={{flex:0, backgroundColor:'red'}}>
				<Text>{rowId}</Text>
			</View>
		);
	}

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
				key={`${sectionID}-${rowID}`}
				style={{height: 1,}} />
    );
	}

}

Test.propTypes = {};

export default connect(state => ({
	}),
	dispatch => ({
	})
)(Test);
