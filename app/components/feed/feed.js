import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Animated,
  Modal,
  Image,
  InteractionManager,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TrackPlayer from 'react-native-track-player';
// import {
//   CachedImage,
//   ImageCacheProvider
// } from 'react-native-cached-image';
import sc from '../../../config/styles';
import * as routes from '../../routes/routes';
import * as strings from '../../../config/strings';
import * as constants from '../../../config/constants';
import * as appActions from '../../actions/app-actions';
import * as rewardActions from '../../actions/reward-actions';
// import CommentsModal from '../comments-modal';
import FeedCell from '../feed-cell/feed-cell';
import FeedCellActivityBar from '../feed-cell-activity-bar';
import LockedView from '../locked-view';
import AnalyticsLib from '../../libs/analytics-lib';
import baseObject from '../../libs/base-object';

const propTypes = {
  layout: PropTypes.any,
  routeId: PropTypes.any,
  data: PropTypes.any,
  isRefreshing: PropTypes.any,
  onPressShortcut: PropTypes.any,
  onPressCommentReply: PropTypes.any,
  onPressNoteEdit: PropTypes.any,
  onRefresh: PropTypes.any,
};

class Feed extends Component {
  constructor(props) {
    super(props);

    this._listView = null;
    this._backSideOpacity = {};
    this._focusImageOpacity = {};
    this._focusTimer = null;

    this.state = {
      selectedObjectForComments: undefined,
      visibleRows: {},
      isFocusImageShown: {},
    };

    this.renderItem = this.renderItem.bind(this);
    this.renderFeedView = this.renderFeedView.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.onPressAdd = this.onPressAdd.bind(this);
    this.onShowComments = this.onShowComments.bind(this);
    this.onHideComments = this.onHideComments.bind(this);
  }

  componentDidMount() {
    // Initialize player
    // TrackPlayer.setupPlayer();
  }

  render() {
    return this.props.data ? this.renderFeedView() : this.renderLoadingView();
  }

  renderLoadingView() {
    return <ActivityIndicator style={styles.container} size="large" />;
  }

  renderFeedView() {
    // Note: set key to layout type b/c changing numColumns on the fly is not supported.
    return (
      <View style={styles.container}>
        <FlatList
          key={this.props.layout}
          data={this.props.data}
          numColumns={this.isRowLayout() ? 1 : 2}
          ref={component => (this._listView = component)}
          automaticallyAdjustContentInsets={false}
          enableEmptySections={true}
          renderItem={this.renderItem}
          renderSeparator={this.renderSeparator}
          onChangeVisibleRows={visibleRows => {
            this.setState({visibleRows});
          }}
          scrollsToTop={true}
          showsVerticalScrollIndicator={false}
          style={styles.container}
          refreshControl={
            this.props.onRefresh && (
              <RefreshControl
                onRefresh={this.props.onRefresh}
                refreshing={this.props.isRefreshing}
                tintColor={sc.colorWhite}
              />
            )
          }
        />

        {/* { this.state.selectedObjectForComments &&
          <CommentsModal
            object={this.state.selectedObjectForComments}
            onPressClose={this.onHideComments} /> } */}
      </View>
    );
  }

  renderItem({item, index}) {
    const showActivityBar = this.showActivityBar(item);
    const showActivity =
      item.type != strings.OBJECT_TYPE_TEXT &&
      item.type != strings.OBJECT_TYPE_HELP &&
      item.type != strings.OBJECT_TYPE_REMINDER &&
      item.type != strings.OBJECT_TYPE_REWARD_EARN &&
      item.type != strings.OBJECT_TYPE_REWARD_SPEND &&
      item.type != strings.OBJECT_TYPE_PHONE_CONTACT &&
      item.type != strings.OBJECT_TYPE_PHONE_FRIEND &&
      item.type != strings.OBJECT_TYPE_NOTE &&
      item.type != strings.OBJECT_TYPE_BADGE &&
      item.type != strings.OBJECT_TYPE_COMMENT;
    const baseObj = baseObject(item);
    const isInactive = this.props.isFree && baseObj.isPaid();

    // Add alternating style
    let style = [styles.cellContainer];
    if (this.isRowLayout()) {
      if (
        this.props.routeId === routes.chillReminders().id ||
        this.props.routeId === routes.events().id ||
        this.props.routeId === routes.phone().id ||
        this.props.routeId === routes.notes().id ||
        this.props.routeId === routes.chillHealthRewards().id ||
        this.props.routeId === routes.badges().id ||
        this.props.routeId === routes.chillLinks().id ||
        this.props.routeId === routes.chillGroups().id ||
        this.props.routeId === routes.help().id
      ) {
        style.push(
          index % 2 === 0
            ? styles.cellContainerLight
            : styles.cellContainerDark,
        );
      }
    } else {
      style.push(styles.cellGrid);
    }

    this._backSideOpacity[index] =
      this._backSideOpacity[index] || new Animated.Value(0);
    const backSideStyles = [
      styles.containerBackSide,
      {opacity: this._backSideOpacity[index]},
    ];
    return (
      <LockedView locked={isInactive} iconTop={5} iconLeft={5}>
        <View key={item.id} style={style}>
          <View style={{flex: 1}}>
            <View>
              <FeedCell
                data={item}
                navigation={this.props.navigation}
                layout={this.props.layout}
                onPressCommentReply={this.props.onPressCommentReply}
                onPressNoteEdit={this.props.onPressNoteEdit}
                onPressShortcut={this.props.onPressShortcut}
              />
              {item.flip_side_image_link && (
                <Animated.View style={backSideStyles} pointerEvents="none">
                  <FeedCell isBackSide={true} data={item} />
                </Animated.View>
              )}
              {
                item.type === 'photo' && (
                  // <ImageCacheProvider
                  //   urlsToPreload={ [ item.image_link ] } >
                  <Modal
                    visible={this.state.isFocusImageShown[index] || false}
                    animationType={'fade'}
                    transparent={true}
                    onDismiss={() => this.onImageUnfocus(index)}>
                    <Animated.View
                      style={{
                        opacity: this._focusImageOpacity[index],
                        backgroundColor: 'black',
                      }}>
                      <StatusBar animated={true} hidden={true} />
                      <TouchableWithoutFeedback
                        onPress={() => this.onImageUnfocus(index)}>
                        {/* <CachedImage
                          style={styles.imageFullscreen}
                          resizeMode={ 'cover' }
                          source={{uri:item.image_link}} /> */}
                        <Image
                          style={styles.imageFullscreen}
                          source={{uri: item.image_link}}
                        />
                      </TouchableWithoutFeedback>
                    </Animated.View>
                  </Modal>
                )
                // </ImageCacheProvider>
              }
            </View>

            {showActivity &&
              showActivityBar &&
              this.isRowLayout() &&
              this.renderRowActivityBar(item, index)}

            {showActivity &&
              !showActivityBar &&
              this.isRowLayout() &&
              this.renderRowActivityButton(item, index)}
          </View>
        </View>
      </LockedView>
    );
  }

  renderRowActivityButton(item, index) {
    const imageSrc = require('../../../images/cell-activity-bar/more-48.png');
    // Note: old '+' image
    //		const { selectedObject } = this.props;
    //		const imageSrc = (selectedObject && (item.id == selectedObject.id))
    //			? require('../../../images/cell/add-hl-64.png')
    //			: require('../../../images/cell/add-64.png');

    return (
      <TouchableHighlight
        style={styles.activityButton}
        underlayColor={'transparent'}
        onPress={() => this.onPressAdd(item)}>
        <Image style={styles.activityButtonImage} source={imageSrc} />
      </TouchableHighlight>
    );
  }

  renderRowActivityBar(item, index) {
    // Note: pass item.comment_count in to ensure component gets re-rendered
    //       upon new comment
    return (
      <FeedCellActivityBar
        row={index}
        object={item}
        favObjects={[]} //TODO
        routeId={this.props.routeId}
        commentCount={item.comment_count}
        onPressComment={this.onShowComments}
        onInfoShow={() => this.onInfoShow(item, index)}
        onInfoHide={() => this.onInfoHide(index)}
        onPressImageFocus={() => this.onImageFocus(item, index)}
        onPressShortcut={this.props.onPressShortcut}
      />
    );
  }

  renderSeparator(index, adjacentRowHighlighted) {
    const object = this.props.data[index];

    let style;
    // Case 1: no separator
    if (
      this.props.routeId === routes.chillReminders().id ||
      this.props.routeId === routes.events().id ||
      this.props.routeId === routes.phone().id ||
      this.props.routeId === routes.notes().id ||
      this.props.routeId === routes.chillHealthRewards().id ||
      this.props.routeId === routes.badges().id ||
      this.props.routeId === routes.chillLinks().id ||
      this.props.routeId === routes.chillGroups().id ||
      this.props.routeId === routes.help().id
    ) {
      style = styles.separatorNone;
    }
    // Case 2: with separator (last row)
    else if (index == this.props.data.length - 1) {
      style = styles.separatorLast;
    }
    // Case 3: with separator (invisible)
    else {
      style = styles.separatorInvisible;
    }

    return <View key={`${index}`} style={style} />;
  }

  ///////////////////////
  // Delegate Callback //
  ///////////////////////

  ////////////////////
  // Event Callback //
  ////////////////////

  onPressAdd(object) {
    this.props.appActions.selectObject(
      object,
      constants.SELECTED_OBJECT_MODE_ALL,
    );
  }

  onShowComments(object) {
    this.setState({selectedObjectForComments: object});
  }

  onHideComments(object) {
    this.setState({selectedObjectForComments: undefined});
  }

  onInfoShow(object, index) {
    AnalyticsLib.trackObject('Info View', object);

    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this._backSideOpacity[index], {
        delay: 0,
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }

  onInfoHide(index) {
    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this._backSideOpacity[index], {
        delay: 0,
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }

  async onImageFocus(object, index) {
    AnalyticsLib.trackObject('Focus', object);

    this.playChimeSound();

    this.state.isFocusImageShown[index] = true;
    this.setState({isFocusImageShown: this.state.isFocusImageShown});

    this._focusImageOpacity[index] = new Animated.Value(0);

    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this._focusImageOpacity[index], {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });

    this._focusTimer = setTimeout(() => {
      this.onImageUnfocus(index);
      this.props.rewardActions.earnViaFocus();
    }, 60000);
  }

  async onImageUnfocus(index) {
    // Note: when disabling via focusTimer, this function gets called twice. The 1st time
    //       is from the timer. The 2nd time is likely from modal dismiss.
    if (this.state.isFocusImageShown[index] === false) {
      return;
    }

    this._focusTimer && clearTimeout(this._focusTimer);

    this.playChimeSound();

    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this._focusImageOpacity[index], {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        this.state.isFocusImageShown[index] = false;
        this.setState({isFocusImageShown: this.state.isFocusImageShown});
      });
    });
  }

  async playChimeSound() {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: 'chime',
      url: require('../../../audios/chime.mp3'),
      title: 'chime',
      artist: 'Instacalm',
    });
    await TrackPlayer.play();
  }

  ///////////////////
  // API Functions //
  ///////////////////

  scrollTo(options) {
    // Note: do not scroll to top if listView has not been created
    if (this._listView) {
      this._listView.scrollToOffset(options);
    }
  }

  ///////////////
  // Functions //
  ///////////////

  showActivityBar(object) {
    return (
      object.type != strings.OBJECT_TYPE_TEXT &&
      (this.props.routeId == routes.home().id ||
        this.props.routeId == routes.audios().id ||
        this.props.routeId == routes.chillVideos().id ||
        this.props.routeId == routes.chillPhotos().id ||
        this.props.routeId == routes.chillFavorites().id ||
        this.props.routeId == routes.library().id ||
        this.props.routeId == routes.libfinedining().id ||
        this.props.routeId == routes.libbkswellness().id ||
        this.props.routeId == routes.libbkscollection().id)
    );
  }

  isRowLayout() {
    return this.props.layout !== 'grid';
  }
}

Feed.propTypes = propTypes;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerBackSide: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cellContainer: {
    flex: 0,
  },
  cellContainerLight: {},
  cellContainerDark: {
    backgroundColor: sc.colors.rowTintDark,
  },
  cellGrid: {
    flex: 2,
  },
  separatorLast: {
    height: 20,
  },
  separatorInvisible: {
    height: 10,
  },
  separatorNone: {
    height: 0,
  },
  activityButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  activityButtonImage: {
    width: 24,
    height: 24,
  },
  imageFullscreen: {
    width: sc.dimension.wp(100),
    height: sc.dimension.hp(100),
  },
});

export default connect(
  state => ({
    selectedObject: state.app.selected_object,
    isFree: state.accessCode.access_code == '__FREE__',
  }),
  dispatch => ({
    appActions: bindActionCreators(appActions, dispatch),
    rewardActions: bindActionCreators(rewardActions, dispatch),
  }),
  null,
  {forwardRef: true},
)(Feed);
