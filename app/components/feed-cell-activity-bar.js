import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Image,
  ImageEditor,
  ImageStore,
  Platform,
  Share,
	StyleSheet,
  Text,
	TouchableHighlight,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sc from '../../config/styles';
import * as routes from '../routes/routes';
import * as strings from '../../config/strings';
import * as constants from '../../config/constants';
import * as appActions from '../actions/app-actions';
import * as favActions from '../actions/favorite-actions';
import * as rewardActions from '../actions/reward-actions';
import * as shareLib from '../libs/share-lib';
import AnalyticsLib from '../libs/analytics-lib';
import baseObject from '../libs/base-object';

// const flattenStyle = require('flattenStyle');

const propTypes = {
	row   			      : PropTypes.any,
	object			      : PropTypes.any,
	routeId		        : PropTypes.any,
	commentCount			: PropTypes.any,
	onPressComment	  : PropTypes.any,
	onInfoShow   	    : PropTypes.any,
	onInfoHide   	    : PropTypes.any,
	onPressImageFocus	: PropTypes.any,
	onPressShortcut	  : PropTypes.any,
};

class FeedCellActivityBar extends Component {
	constructor(props) {
		super(props);

    this.state = {
      isShowingInfo: false,
    };

		this.onPressComment = this.onPressComment.bind(this);
		this.onPressFav = this.onPressFav.bind(this);
		this.onPressUnfav = this.onPressUnfav.bind(this);
		this.onPressShare = this.onPressShare.bind(this);
		this.onPressPinHome = this.onPressPinHome.bind(this);
		this.onPressMore = this.onPressMore.bind(this);
		this.onPressInfo = this.onPressInfo.bind(this);
		this.isObjectFaved = this.isObjectFaved.bind(this);
	}

	render() {
		const styles = this.constructor.styles;
		const { object, pinnedAudioId, pinnedPhotoId } = this.props;
		const isFaved = this.isObjectFaved();
		const favImageSrc = isFaved
			? require('../../images/cell-activity-bar/fav-hl-48.png')
			: require('../../images/cell-activity-bar/fav-48.png');
		const favAction = isFaved
			? this.onPressUnfav
			: this.onPressFav;
		const baseObj = baseObject(object);
    const showComment = baseObj.canComment();
    const showFav = baseObj.canFav();
    const showShare = baseObj.canShare();
    const showPinHome = baseObj.canPinHome();
    const showMore = baseObj.canDoMore()
      && (this.props.routeId !== routes.library().id);
    const showShortcut = object.related_screen;
    const showFocus = baseObj.canFocus();

    return (
      <View style={styles.container}>

        {object.flip_side_image_link && <TouchableHighlight
          style={styles.button}
          underlayColor={'transparent'}
					onPress={this.onPressInfo} >
          <Image
            style={styles.buttonImage}
            source={this.state.isShowingInfo
              ? require('../../images/cell-activity-bar/info-hl-48.png')
              : require('../../images/cell-activity-bar/info-48.png')} />
        </TouchableHighlight>}

        {showFocus && <TouchableHighlight
          style={styles.button}
          underlayColor={'transparent'}
					onPress={() => this.props.onPressImageFocus(object)} >
          <Image
            style={styles.buttonImage}
            source={require('../../images/cell-activity-bar/focus-48.png')} />
        </TouchableHighlight>}

        {showComment && <TouchableHighlight
          style={styles.button}
          underlayColor={'transparent'}
          onPress={this.onPressComment}>
          <View style={styles.containerCommentCount}>
            <Image
              style={styles.buttonImage}
              source={require('../../images/cell-activity-bar/comment-48.png')} />
            <Text style={styles.textCommentCount}>{object.comment_count}</Text>
          </View>
        </TouchableHighlight>}

        {showPinHome && <TouchableHighlight
          style={styles.button}
          underlayColor={'transparent'}
          onPress={this.onPressPinHome}>
          <Image
            style={styles.buttonImage}
            source={pinnedPhotoId === object.id || pinnedAudioId === object.id
              ? require('../../images/cell-activity-bar/pin-home-hl-48.png')
              : require('../../images/cell-activity-bar/pin-home-48.png')} />
        </TouchableHighlight>}

        {showFav && <TouchableHighlight
          style={styles.button}
          underlayColor={'transparent'}
          onPress={() => favAction()}>
          <Image
            style={styles.buttonImage}
            source={favImageSrc} />
        </TouchableHighlight>}

        {showShare && <TouchableHighlight
          style={styles.button}
          underlayColor={'transparent'}
          onPress={this.onPressShare}>
          <Image
            style={styles.buttonImage}
            source={require('../../images/cell-activity-bar/share-48.png')} />
        </TouchableHighlight>}

        {showMore && <TouchableHighlight
          style={styles.button}
          underlayColor={'transparent'}
          onPress={this.onPressMore}>
          <Image
            style={styles.buttonImage}
            source={require('../../images/cell-activity-bar/more-48.png')} />
        </TouchableHighlight>}

        {showShortcut && <TouchableHighlight
          style={styles.button}
          underlayColor={'transparent'}
					onPress={() => this.props.onPressShortcut(object)} >
          <Image
            style={styles.buttonImage}
            source={require('../../images/cell-activity-bar/shortcut-48.png')} />
        </TouchableHighlight>}
      </View>
    );
  }


	///////////////////////
	// Delegate Callback //
	///////////////////////

	////////////////////
	// Event Callback //
	////////////////////

	onPressComment() {
    const { object } = this.props;
    this.props.onPressComment(object);
	}

	onPressPinHome() {
    console.warn("onPressPinHome");
    const { object } = this.props;
    if (object.type == strings.OBJECT_TYPE_PHOTO) {
    console.warn("pinPhoto");
      this.props.appActions.pinPhoto(object);
    }
    else if (object.type == strings.OBJECT_TYPE_AUDIO) {
    console.warn("pinAudio");
      this.props.appActions.pinAudio(object);
    }
	}

	onPressFav() {
    const { object } = this.props;
		this.props.favActions.favoriteObject(object);
	}

	onPressUnfav() {
    const { object } = this.props;
		this.props.favActions.unfavoriteObject(object);
	}

	async onPressShare() {
    const { accountType, object } = this.props;

    // Get image url
    let imageUrl;
    if (object.image_link) {
      const imageData = await this.getImageBase64Data(object.image_link);
      if (imageData) {
        imageUrl = 'data:image/png;base64,' + imageData;
      }
    }

    // Share
    Share.share({
      title   : shareLib.getShareMessage(object, accountType),
      message : shareLib.getShareMessage(object, accountType),
      url     : imageUrl,
    }, {
      subject : shareLib.getShareMessage(object),
      excludedActivityTypes: [
        'com.apple.UIKit.activity.AirDrop',
        'com.apple.UIKit.activity.AddToReadingList',
        'com.apple.UIKit.activity.AssignToContact',
        'com.apple.UIKit.activity.Print',
      ],
      dialogTitle: 'Share',
    })
    .then((ret) => {
      if (
        // iOS actions
        ret.activityType == 'com.apple.UIKit.activity.PostToFacebook'
        || ret.activityType == 'com.apple.UIKit.activity.PostToTwitter'
        || ret.activityType == 'com.apple.UIKit.activity.Mail'
        || ret.activityType == 'com.google.Gmail.ShareExtension'
        || ret.activityType == 'com.apple.UIKit.activity.Message'
        || ret.activityType == 'com.burbn.instagram.shareextension'
        // Android actions
      ) {
        AnalyticsLib.trackObject('Share', object, {channel: ret.activityType});
        this.props.rewardActions.earnViaShare();
      }
    })
    .catch((err) => {
      err && console.log(err);
    })
	}

	onPressMore() {
    const { object } = this.props;
		this.props.appActions.selectObject(object, constants.SELECTED_OBJECT_MODE_MORE);
	}

	onPressInfo() {
    this.setState({ isShowingInfo: ! this.state.isShowingInfo });
		this.state.isShowingInfo
      ? this.props.onInfoHide()
      : this.props.onInfoShow();
	}


	///////////////
	// Functions //
	///////////////

	isObjectFaved() {
		const { object, favObjects } = this.props;

		const index = favObjects.findIndex((per, index) => {
			if (per.id == object.id) {
				return true;
			}
			return false;
		});

		return index >= 0;
	}

	getImageBase64Data(imageUrl) {
    if (Platform.OS != 'ios') { return null; }

    return new Promise((resolve, reject) => {
      Image.getSize(imageUrl, (width, height) => {
        const imageSize = {
          size: {width, height},
          offset: {x:0, y:0}
        };
        ImageEditor.cropImage(imageUrl, imageSize, (imageURI) => {
          ImageStore.getBase64ForTag(imageURI, (base64Data) => {
            ImageStore.removeImageForTag(imageURI);
            resolve(base64Data);
          }, (reason) => resolve(null))
        }, (reason) => resolve(null))
      }, (reason) => resolve(null))
    });
	}

}

FeedCellActivityBar.propTypes = propTypes;
FeedCellActivityBar.styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: sc.colors.backgroundGray,
    borderRadius: 30,
  },
  containerCommentCount: {
    flexDirection: 'row',
  },
  textCommentCount: {
		color: sc.colors.white,
		fontFamily: sc.fontFamily.normal,
    fontSize: 15,
    alignSelf: 'center',
    paddingLeft: 5,
  },
  button: {
    flex: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
  buttonImage: {
    width: 24,
    height: 24,
  },
});

export default connect(state => ({
		accountType			: state.app.school.account_type,
		favObjects	    : state.favorites.data['All'],
		pinnedAudioId	  : state.app.pinned_audio && state.app.pinned_audio.id,
		pinnedPhotoId	  : state.app.pinned_photo && state.app.pinned_photo.id,
	}),
	dispatch => ({
		appActions	    : bindActionCreators(appActions, dispatch),
		favActions			: bindActionCreators(favActions, dispatch),
		rewardActions		: bindActionCreators(rewardActions, dispatch),
	}),
	null,
)(FeedCellActivityBar);
