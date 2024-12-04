import React, {Component} from 'react';
import {
  Image,
  ListView,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import sc from '../../config/styles';
import * as schoolPickerActions from '../actions/school-picker-actions';
import LoadingView from '../components/loading-view';

const propTypes = {};

class SchoolPicker extends Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
  }

  componentDidMount() {
    this.props.schoolPickerActions.load();
  }

  render() {
    const styles = this.constructor.styles;
    const {isLoading} = this.props;
    return (
      <View style={styles.container}>
        <Image
          style={{position: 'absolute', zIndex: 0}}
          source={require('../../images/stressbusters/backgroundimg.png')}
        />
        <View style={styles.header}>
          <Image
            style={{height: 50, width: 50}}
            source={require('../../images/chrome/ic_launcher.png')}
          />
          <Text style={styles.headerText}>Choose Your Location</Text>
          <View style={styles.headerSeparator} />
        </View>

        {isLoading && this.renderLoading()}
        {!isLoading && this.renderPicker()}
      </View>
    );
  }

  renderLoading() {
    return <LoadingView />;
  }

  //   renderPicker() {
  //     const styles = this.constructor.styles;
  //     const dataSource = new ListView.DataSource({
  //       rowHasChanged: (r1, r2) => r1 !== r2,
  //     }).cloneWithRows(this.props.schools);
  // 	console.log("dataSource",dataSource)
  //     return (
  //       <ListView
  //         automaticallyAdjustContentInsets={false}
  //         dataSource={dataSource}
  //         enableEmptySections={true}
  //         renderRow={this.renderRow}
  //         renderSeparator={this.renderSeparator}
  //         scrollsToTop={true}
  //         showsVerticalScrollIndicator={false}
  //         style={styles.list}
  //       />
  //     );
  //   }
  renderPicker() {
    const styles = this.constructor.styles;
    const {schools} = this.props;
    // console.log("this is schools", this.props.schools);
    return (
      <FlatList
        data={schools} // Use the array directly
        keyExtractor={(item, index) => item.id || index.toString()} // Unique key for each item
        renderItem={this.renderRow} // Use renderItem for rendering rows
        ItemSeparatorComponent={this.renderSeparator} // Separator between items
        automaticallyAdjustContentInsets={false}
        scrollsToTop={true}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    );
  }

  renderRow({item: param, index}) {
    const styles = this.constructor.styles;
    const {selected} = this.props;
    console.log('con', param.id);
    const isSelected = selected == param.id;

    return (
      <View style={styles.rowContainer}>
        <TouchableHighlight
          style={styles.rowButton}
          underlayColor={sc.buttonHighlightColor}
          onPress={() => this.onSelect(param)}>
          <View style={styles.buttonContainer}>
            <Image
              style={styles.buttonImage}
              source={{uri: param.logo_image_link}}
            />
            <Text style={styles.buttonText}>{param.name}</Text>
          </View>
        </TouchableHighlight>
        {isSelected && (
          <TouchableHighlight
            style={styles.confirmButton}
            underlayColor={sc.buttonHighlightColor}
            onPress={() => this.onConfirm(param)}>
            <Text style={styles.confirmButtonText}>GO</Text>
          </TouchableHighlight>
        )}
      </View>
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    const styles = this.constructor.styles;
    const isLast = rowID == this.props.schools.length - 1;
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={isLast ? styles.separatorLast : styles.separator}
      />
    );
  }

  ///////////////
  // Functions //
  ///////////////

  onSelect(school) {
    if (school.is_signed_up) {
      this.props.schoolPickerActions.select(school.id);
    }
  }

  onConfirm(school) {
    this.props.schoolPickerActions.confirm(school.id);
  }
}

SchoolPicker.propTypes = propTypes;
SchoolPicker.styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: sc.pickerBackgroundColor,
  },
  header: {
    flex: 0,
    marginTop: sc.statusBarHeight,
    alignItems: 'center',
  },
  headerText: {
    ...sc.textNavTitle,
    marginTop: 10,
    marginBottom: 10,
  },
  headerSeparator: {
    width: 1999,
    height: 1,
    backgroundColor: sc.pickerHeaderSeparatorColor,
  },
  list: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  rowButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
  },
  confirmButtonText: {
    ...sc.textSchoolPickerText,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonImage: {
    width: 36,
    height: 36,
  },
  buttonText: {
    ...sc.textSchoolPickerText,
    marginLeft: 20,
  },
  separator: {
    height: 1,
    backgroundColor: sc.menuFeedSeparatorColor,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  separatorLast: {
    height: 0,
  },
});

export default connect(
  state => ({
    isLoading: state.schoolPicker.is_loading,
    schools: state.schoolPicker.schools,
    selected: state.schoolPicker.selected,
  }),
  dispatch => ({
    schoolPickerActions: bindActionCreators(schoolPickerActions, dispatch),
  }),
)(SchoolPicker);
