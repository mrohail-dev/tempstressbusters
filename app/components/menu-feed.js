import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import RNCommunications from 'react-native-communications';
import AnalyticsLib from '../libs/analytics-lib';
import sc from '../../config/styles';
import * as appActions from '../actions/app-actions';
import * as breathActions from '../actions/breath-actions';
import * as constants from '../../config/constants';
import * as routes from '../routes/routes';
import * as schoolLib from '../libs/school-lib';
import * as routeTypes from '../routes/route-types';
import LockedView from './locked-view';

// const flattenStyle = require('flattenStyle');

const propTypes = {
  route: PropTypes.object.isRequired,
  onPressRow: PropTypes.func.isRequired,
};

class MenuFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalRoute: undefined,
      params: this.props.route.params,
    };

    this._listView = null;

    this.renderRow = this.renderRow.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
    this.onPressInfo = this.onPressInfo.bind(this);
    this.onPressClose = this.onPressClose.bind(this);
  }

  componentDidMount() {
    // if(this._listView.current){
    //   this._listView.current.scrollToIndex({ animated: true, index: 0 });
    // }
  }

  componentDidUpdate(){
    console.log("menu feed component update")
  }

  render() {
    const dataSource = this.state.params.routes;
    return (
      <View style={{flex:1}}>
        <FlatList
          ref={component => (this._listView = component)}
          data={dataSource}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderRow}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          ItemSeparatorComponent={this.renderSeparator}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ marginLeft: 10,
            marginRight: 10,}}
          keyboardShouldPersistTaps='always'
          // fadingEdgeLength={1}
          // numColumns={1}
          // initialNumToRender={30}
          // initialScrollIndex={3}
        />
        {this.renderModal()}
      </View>
    );
  }

  renderRow({index, item: route, sectionId, rowId}) {
    const isInactive = this.props.isFree && !route.free;
    // console.log("",route.title, route.free);
    const {navigation} = this.props;
    return (
      <View style={styles.containerRow}>
        <View style={styles.buttonRow}>
          <LockedView locked={isInactive} iconTop={-10} iconLeft={-5}>
            <TouchableHighlight
              underlayColor={sc.buttonHighlightColor}
              // onPress={() => this.onPressItem(route, navigation)}>
              onPress={() => this.props.onPressRow(route, navigation)}
              >
              <View style={styles.buttonRowContainer}>
                <Image style={styles.imageIcon} source={route.icon} />
                <Text style={styles.textButton}>{route.title}</Text>
              </View>
            </TouchableHighlight>
          </LockedView>
        </View>

        {route.info && (
          <TouchableHighlight
            style={styles.buttonInfo}
            underlayColor={sc.buttonHighlightColor}
            onPress={() => this.onPressInfo(route)}>
            <Image
              style={styles.imageInfo}
              source={require('../../images/chrome/info-64.png')}
            />
          </TouchableHighlight>
        )}
      </View>
    );
  }

  renderSeparator({highlighted, leadingItem}) {
    const isLast = false; //(rowID == this.state.routes.length - 1);
    return (
      <View
        key={leadingItem.id}
        style={isLast ? styles.separatorLast : styles.separator}
      />
    );
  }
  
// renderSeparator(index) {
//   const isLast = index === this.state.params.routes.length - 1;
//   return (
//     <View
//       style={isLast ? styles.separatorLast : styles.separator}
//     />
//   );
// }


  renderModal() {
    return (
      <Modal
        animationType={'fade'}
        onRequestClose={() => this.onPressClose()}
        transparent={true}
        visible={this.state.modalRoute !== undefined}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.buttonModalBackground}
          onPress={this.onPressClose}></TouchableOpacity>

        {this.state.modalRoute && (
          <View style={styles.containerModalInner}>
            <Image
              style={styles.imageModalIcon}
              source={this.state.modalRoute.icon}
            />
            <Text style={styles.textModalTitle}>
              {this.state.modalRoute.title}
            </Text>
            <Text style={styles.textModalContent}>
              {this.state.modalRoute.info}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.buttonModalClose}
              onPress={this.onPressClose}>
              <Text style={styles.textModalButton}>Got It</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    );
  }

  onPressInfo(route) {
    this.setState({modalRoute: route});
  }

  onPressClose() {
    this.setState({modalRoute: undefined});
  }

  ///////////////////
  // API Functions //
  ///////////////////

  ///////////////
  // Functions //
  ///////////////
}

MenuFeed.propTypes = propTypes;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    // marginBottom: 50,
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 5,
  },
  buttonRow: {},
  buttonRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonInfo: {
    flex: 0,
    justifyContent: 'center',
  },
  imageIcon: {
    width: 48,
    height: 48,
  },
  imageInfo: {
    width: 24,
    height: 24,
  },
  textButton: {
    ...sc.textMenuButton,
    marginLeft: 20,
  },
  separator: {
    height: 1,
    backgroundColor: sc.menuFeedSeparatorColor,
    marginTop: 5,
    marginBottom: 5,
  },
  separatorLast: {
    height: 20,
  },
  // Modal
  containerModalInner: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: '10%',
    marginTop: '30%',
    padding: 20,
  },
  containerModalContent: {
    flex: 1,
  },
  imageModalIcon: {
    position: 'absolute',
    top: -20,
    width: 64,
    height: 64,
    borderColor: 'white',
    borderRadius: 5,
    borderWidth: 3,
  },
  textModalTitle: {
    color: sc.colors.black,
    fontFamily: 'HelveticaNeue-Bold',
    fontSize: 26,
    marginTop: 40,
  },
  textModalContent: {
    color: sc.colors.black,
    fontFamily: 'HelveticaNeue',
    fontSize: 18,
    marginTop: 30,
  },
  textModalButton: {
    ...sc.textActionBtton,
    alignSelf: 'center',
  },
  buttonModalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: sc.appBackgroundColor,
  },
  buttonModalClose: {
    height: 48,
    backgroundColor: '#459E97',
    borderColor: '#459E97',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop: 50,
  },
});

export default connect(
  state => ({
    isFree: state.accessCode.access_code == '__FREE__',
  }),
  dispatch => ({
    appActions: bindActionCreators(appActions, dispatch),
    breathActions: bindActionCreators(breathActions, dispatch),
  }),
)(MenuFeed);
