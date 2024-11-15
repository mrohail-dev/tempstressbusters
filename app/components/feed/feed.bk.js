import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	ActivityIndicator,
  Animated,
  Modal,
	Image,
  InteractionManager,
	ListView,
  RefreshControl,
  StatusBar,
	StyleSheet,
	Text,
	TouchableHighlight,
  TouchableWithoutFeedback,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
import CommentsModal from '../comments-modal';
import FeedCell from '../feed-cell/feed-cell';
import FeedCellActivityBar from '../feed-cell-activity-bar';
import LockedView from '../locked-view';
import AnalyticsLib from '../../libs/analytics-lib';
import baseObject from '../../libs/base-object';


const propTypes = {
	routeId		          : PropTypes.any,
	data			          : PropTypes.any,
	isRefreshing			  : PropTypes.any,
	onPressShortcut	    : PropTypes.any,
	onPressCommentReply	: PropTypes.any,
	onPressNoteEdit   	: PropTypes.any,
	onRefresh     	    : PropTypes.any,
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

		this.renderRow = this.renderRow.bind(this);
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
		return this.props.data
			? this.renderFeedView()
			: this.renderLoadingView();
	}

	renderLoadingView() {
		const styles = this.constructor.styles;
		return (
			<ActivityIndicator
				style={styles.container}
				size='large' />
		);
	}

	renderFeedView() {
		const styles = this.constructor.styles;
		const dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2 || r1.comment_count !== r2.comment_count
      })
			.cloneWithRows(this.props.data);
		return (
			<View style={styles.container}>
				<ListView
					ref={component => this._listView = component}
					automaticallyAdjustContentInsets={false}
					dataSource={dataSource}
					enableEmptySections={true}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator}
          onChangeVisibleRows={(visibleRows) => { this.setState({visibleRows})}}
					scrollsToTop={true}
					showsVerticalScrollIndicator={false}
					style={styles.container}
          refreshControl={
            this.props.onRefresh &&
            <RefreshControl
              onRefresh={this.props.onRefresh}
              refreshing={this.props.isRefreshing}
              tintColor={sc.colorWhite}
            />
          }
        />

        { this.state.selectedObjectForComments &&
          <CommentsModal
            object={this.state.selectedObjectForComments}
            onPressClose={this.onHideComments} /> }

			</View>
		);
	}

	renderRow(param, sectionID, rowID) {
		const styles = this.constructor.styles;
    const showActivityBar = this.showActivityBar(param);
		const showActivity = (param.type != strings.OBJECT_TYPE_TEXT)
		  && (param.type != strings.OBJECT_TYPE_HELP)
			&& (param.type != strings.OBJECT_TYPE_REMINDER)
			&& (param.type != strings.OBJECT_TYPE_REWARD_EARN)
			&& (param.type != strings.OBJECT_TYPE_REWARD_SPEND)
			&& (param.type != strings.OBJECT_TYPE_PHONE_CONTACT)
			&& (param.type != strings.OBJECT_TYPE_PHONE_FRIEND)
			&& (param.type != strings.OBJECT_TYPE_NOTE)
			&& (param.type != strings.OBJECT_TYPE_BADGE)
			&& (param.type != strings.OBJECT_TYPE_COMMENT);
		const baseObj = baseObject(param);
    const isInactive = this.props.isFree && baseObj.isPaid();

    // Add alternating style
    let style = [ styles.cellContainer ];
    if (this.props.routeId === routes.chillReminders().id
      || this.props.routeId === routes.events().id
      || this.props.routeId === routes.phone().id
      || this.props.routeId === routes.notes().id
      || this.props.routeId === routes.chillHealthRewards().id
      || this.props.routeId === routes.badges().id
      || this.props.routeId === routes.chillLinks().id
      || this.props.routeId === routes.chillGroups().id
      || this.props.routeId === routes.help().id) {
      style.push(rowID % 2 === 0 ? styles.cellContainerLight : styles.cellContainerDark);
    }

    this._backSideOpacity[rowID] = this._backSideOpacity[rowID] || new Animated.Value(0);
    const backSideStyles = [ styles.containerBackSide, { opacity: this._backSideOpacity[rowID] } ];
		return (
      <LockedView locked={isInactive} iconTop={5} iconLeft={5}>
        <View key={param.id} style={style}>
          <View style={{ flex: 1 }}>
            <View>
              <FeedCell
                data={param}
                onPressCommentReply={this.props.onPressCommentReply}
                onPressNoteEdit={this.props.onPressNoteEdit}
                onPressShortcut={this.props.onPressShortcut} />
              { param.flip_side_image_link &&
                <Animated.View style={backSideStyles} pointerEvents="none">
                  <FeedCell
                    isBackSide={true}
                    data={param} />
                </Animated.View> }
              { param.type === 'photo' &&
                // <ImageCacheProvider
                //   urlsToPreload={ [ param.image_link ] } >
                  <Modal
                    visible={this.state.isFocusImageShown[rowID] || false}
                    animationType={'fade'}
                    transparent={true}
                    onDismiss={() => this.onImageUnfocus(rowID)} >

                    <Animated.View style={{ opacity: this._focusImageOpacity[rowID], backgroundColor:'black' }}>
                      <StatusBar animated={true} hidden={true} />
                      <TouchableWithoutFeedback
                        onPress={() => this.onImageUnfocus(rowID)}>

                        {/* <CachedImage
                          style={styles.imageFullscreen}
                          resizeMode={ 'cover' }
                          source={{uri:param.image_link}} /> */}
                        <Image
                          style={styles.imageFullscreen}
                          resizeMode={ 'cover' }
                          source={{uri:param.image_link}} /> 

                      </TouchableWithoutFeedback>
                    </Animated.View>
                  </Modal>
                // </ImageCacheProvider>
                }
            </View>

            {showActivity && showActivityBar
              && this.renderRowActivityBar(param, sectionID, rowID)}

            {showActivity && ( ! showActivityBar )
              && this.renderRowActivityButton(param, sectionID, rowID)}
          </View>
        </View>
      </LockedView>
		);
	}

  renderRowActivityButton(param, sectionID, rowID) {
		const styles = this.constructor.styles;
		const imageSrc = require('../../../images/cell-activity-bar/more-48.png');
// Note: old '+' image
//		const { selectedObject } = this.props;
//		const imageSrc = (selectedObject && (param.id == selectedObject.id))
//			? require('../../../images/cell/add-hl-64.png')
//			: require('../../../images/cell/add-64.png');

    return (
      <TouchableHighlight
        style={styles.activityButton}
        underlayColor={'transparent'}
        onPress={() => this.onPressAdd(param)}>
        <Image
          style={styles.activityButtonImage}
          source={imageSrc} />
      </TouchableHighlight>
    );
  }

  renderRowActivityBar(param, sectionID, rowID) {
    // Note: pass param.comment_count in to ensure component gets re-rendered
    //       upon new comment
    return (
      <FeedCellActivityBar
        row={rowID}
        object={param}
        favObjects={[]} //TODO
        routeId={this.props.routeId}
        commentCount={param.comment_count}
        onPressComment={this.onShowComments}
        onInfoShow={() => this.onInfoShow(param, rowID)}
        onInfoHide={() => this.onInfoHide(rowID)}
        onPressImageFocus={() => this.onImageFocus(param, rowID)}
        onPressShortcut={this.props.onPressShortcut} />
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		const styles = this.constructor.styles;
    const object = this.props.data[rowID];

    let style;
    // Case 1: no separator
    if (this.props.routeId === routes.chillReminders().id
      || this.props.routeId === routes.events().id
      || this.props.routeId === routes.phone().id
      || this.props.routeId === routes.notes().id
      || this.props.routeId === routes.chillHealthRewards().id
      || this.props.routeId === routes.badges().id
      || this.props.routeId === routes.chillLinks().id
      || this.props.routeId === routes.chillGroups().id
      || this.props.routeId === routes.help().id) {
      style = styles.separatorNone;
    }
    // Case 2: with separator (last row)
    else if (rowID == this.props.data.length - 1) {
      style = styles.separatorLast;
    }
    // Case 3: with separator (invisible)
		else {
      style = styles.separatorInvisible;
    }

    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={style} />
    );
	}


	///////////////////////
	// Delegate Callback //
	///////////////////////

	////////////////////
	// Event Callback //
	////////////////////

	onPressAdd(object) {
		this.props.appActions.selectObject(object, constants.SELECTED_OBJECT_MODE_ALL);
	}

	onShowComments(object) {
    this.setState({ selectedObjectForComments: object });
	}

	onHideComments(object) {
    this.setState({ selectedObjectForComments: undefined });
	}

	onInfoShow(object, rowID) {
    AnalyticsLib.trackObject('Info View', object);

    InteractionManager.runAfterInteractions(() => {
      Animated.timing( this._backSideOpacity[rowID], {
        delay: 0,
        toValue: 1,
        duration: 500,
				useNativeDriver: true,
      }).start();
    });
	}

	onInfoHide(rowID) {
    InteractionManager.runAfterInteractions(() => {
      Animated.timing( this._backSideOpacity[rowID], {
        delay: 0,
        toValue: 0,
        duration: 500,
				useNativeDriver: true,
      }).start();
    });
	}

	async onImageFocus(object, rowID) {
    AnalyticsLib.trackObject('Focus', object);

    this.playChimeSound();

    this.state.isFocusImageShown[rowID] = true;
    this.setState({ isFocusImageShown: this.state.isFocusImageShown });

    this._focusImageOpacity[rowID] = new Animated.Value(0);

    InteractionManager.runAfterInteractions(() => {
      Animated.timing( this._focusImageOpacity[rowID], {
        toValue: 1,
        duration: 600,
				useNativeDriver: true,
      }).start();
    });

    this._focusTimer = setTimeout(() => {
      this.onImageUnfocus(rowID)
      this.props.rewardActions.earnViaFocus();
    }, 60000);
	}

	async onImageUnfocus(rowID) {
    // Note: when disabling via focusTimer, this function gets called twice. The 1st time
    //       is from the timer. The 2nd time is likely from modal dismiss.
    if (this.state.isFocusImageShown[rowID] === false) { return; }

    this._focusTimer && clearTimeout(this._focusTimer);

    this.playChimeSound();

    InteractionManager.runAfterInteractions(() => {
      Animated.timing( this._focusImageOpacity[rowID], {
        toValue: 0,
        duration: 600,
				useNativeDriver: true,
      }).start(() => {
        this.state.isFocusImageShown[rowID] = false;
        this.setState({ isFocusImageShown: this.state.isFocusImageShown });
      });
    });
	}

	async playChimeSound() {
    console.warn('playChimeSound');
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
			this._listView.scrollTo(options);
		}
	}

	///////////////
	// Functions //
	///////////////

  showActivityBar(object) {
    return (object.type != strings.OBJECT_TYPE_TEXT)
    && ((this.props.routeId == routes.home().id)
        || (this.props.routeId == routes.audios().id)
        || (this.props.routeId == routes.chillVideos().id)
        || (this.props.routeId == routes.chillPhotos().id)
        || (this.props.routeId == routes.chillFavorites().id)
        || (this.props.routeId == routes.library().id)
        || (this.props.routeId == routes.libfinedining().id)
        || (this.props.routeId == routes.libbkswellness().id)
        || (this.props.routeId == routes.libbkscollection().id));
  }

}

Feed.propTypes = propTypes;
Feed.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	containerBackSide: {
    position:'absolute',
    width:'100%',
    height:'100%',
	},
	cellContainer: {
		flex: 0,
	},
	cellContainerLight: {
	},
	cellContainerDark: {
    backgroundColor: sc.colors.rowTintDark,
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

export default connect(state => ({
		selectedObject	: state.app.selected_object,
    isFree          : (state.accessCode.access_code == '__FREE__'),
	}),
	dispatch => ({
		appActions	    : bindActionCreators(appActions, dispatch),
		rewardActions	  : bindActionCreators(rewardActions, dispatch),
	}),
	null,
	{ forwardRef: true}
)(Feed);
