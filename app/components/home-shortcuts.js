import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Dimensions,
	Image,
  InteractionManager,
  Modal,
  StatusBar,
	StyleSheet,
  Text,
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
import FastImage from 'react-native-fast-image';
import sc from '../../config/styles';
import * as strings from '../../config/strings';
import * as constants from '../../config/constants';
import * as appActions from '../actions/app-actions';
import * as audioActions from '../actions/audio-actions';
import * as rewardActions from '../actions/reward-actions';
import AnalyticsLib from '../libs/analytics-lib';
import * as BreathLib from '../libs/breath-lib';

const propTypes = {
};

class HomeShortcuts extends Component {
	constructor(props) {
		super(props);

    this._focusImageOpacity = null;
    this._focusTimer = null;
    this._voiceInhaleTimer = null;
    this._voiceExhaleTimer = null;
    this._voiceLoopTimer = null;

    this.state = {
      isBreathing: false,
      isFocusImageShown: false,
    };
	}

	componentDidMount() {
    // TrackPlayer.setupPlayer();
	}

	render() {

    return (
      <View style={styles.container}>
        <Text style={styles.textTitle}>Your Rapid Relaxers</Text>
        <View style={styles.containerRow}>
          { this.renderAudioButton() }
          { this.renderImageButton() }
          { this.renderBreathButton() }
        </View>
      </View>
    );
  }

  renderAudioButton() {
		const { pinnedAudio, currentTrackObject, currentMode } = this.props;
    const data = this.props.pinnedAudio || {
      "audio_link": 'https://s3.amazonaws.com/stressbuster/audios/hccF8tQMJy.mp3',
      "categories": "Popular,Guided",
      "content": "guided deep breathing for fast anxiety and stress relief",
      "created_at": 1384251149,
      "flip_side_image_height": 652,
      "flip_side_image_link": 'https://s3.amazonaws.com/stressbuster/images/1588702231894448.jpg',
      "flip_side_image_width": 540,
      "fullscreen_image_height": 810,
      "fullscreen_image_link": 'https://s3.amazonaws.com/stressbuster/images/1576785441453768.jpg',
      "fullscreen_image_width": 523,
      "id": "hccF8tQMJy",
      "image_link": 'https://s3.amazonaws.com/stressbuster/images/hccF8tQMJy.jpg',
      "is_on_home": true,
      "length": "3:43",
      "loop": false,
      "promoted_at": 1584218546,
      "sort_index": 2,
      "title": "Quick Calm",
      "type": "audio"
    };

		const isCurrentTrack = currentTrackObject && (data.id == currentTrackObject.id);
    const isPlaying = isCurrentTrack && currentMode == 'play';
		const playImageSrc = require('../../images/chrome/audio-simple-play-48.png');
		const stopImageSrc = require('../../images/chrome/audio-simple-stop-48.png');
    return (
      // <ImageCacheProvider
      //   urlsToPreload={[ data.fullscreen_image_link ]} >
        <TouchableWithoutFeedback
          onPress={() => isPlaying ? this.onAudioStop(data) : this.onAudioPlay(data) }>
          <View style={styles.containerButton}>
            <Image
              style={styles.imageBackground}
              source={{uri:data.fullscreen_image_link}} />
            <Image
              style={styles.imageControl}
              source={ isPlaying ? stopImageSrc : playImageSrc} />
          </View>
        </TouchableWithoutFeedback>
      // </ImageCacheProvider>
    );
  }

  renderImageButton() {
		const { pinnedPhoto } = this.props;
    const data = pinnedPhoto || {
      "analytical_title": "PHO ocean sky orange blur",
      "categories": "",
      "content": "",
      "created_at": 1610614813,
      "featured_till": 1610640000,
      "flip_side_image_height": 0,
      "flip_side_image_width": 0,
      "id": "IPk8DNGxEv",
      "image_height": 701,
      "image_link": "https://s3.amazonaws.com/stressbuster/images/1610584352884124.jpeg",
      "image_width": 426,
      "is_on_home": true,
      "is_title_hidden": false,
      "poster_session": "super",
      "title": "",
      "type": "photo"
    };

    return (
      <View>
        <TouchableWithoutFeedback
          onPress={() => this.onImageFocus(data) }>
          <View style={styles.containerButton}>
            <Image
              style={styles.imageBackground}
              source={{uri:data.image_link}} />
            <Image
              style={[ styles.imageControl, { bottom: 7, width: 38, height: 38 } ]}
              source={require('../../images/cell-activity-bar/focus-48.png')} />
          </View>
        </TouchableWithoutFeedback>

        <Modal
          visible={this.state.isFocusImageShown || false}
          animationType={'fade'}
          transparent={true}
          onDismiss={() => this.onImageUnfocus()} >

          <Animated.View style={{ opacity: this._focusImageOpacity, backgroundColor:'black' }}>
            <StatusBar animated={true} hidden={true} />
            <TouchableWithoutFeedback
              onPress={() => this.onImageUnfocus()}>
              {/* <CachedImage
                style={styles.imageFullscreen}
                resizeMode={ 'cover' }
                source={{uri:data.image_link}} /> */}
              <Image
                style={styles.imageFullscreen}
                resizeMode={'cover'}
                source={{ uri: data.image_link }}
              />
            </TouchableWithoutFeedback>
          </Animated.View>
        </Modal>
      </View>
    );
  }

  renderBreathButton() {
		const { pinnedVoice } = this.props;
    const data = this.props.pinnedVoice || 'justin';

    return (
      <TouchableWithoutFeedback
        onPress={() => this.state.isBreathing ? this.onBreathStop() : this.onBreathStart(pinnedVoice) }>
        <View style={styles.containerButton}>
          <Image
            style={styles.imageBackground}
            source={require('../../images/chrome/home-shortcuts-breather-background.jpg')} />
          <Image
            style={styles.imageControl}
            source={this.state.isBreathing
              ? require('../../images/chrome/audio-simple-stop-48.png')
              : require('../../images/chrome/home-shortcuts-ball-48.png')
            } />
        </View>
      </TouchableWithoutFeedback>
    );
  }

	////////////////////
	// Event Callback //
	////////////////////

	async onAudioPlay(data) {
    // Stop breather
    this.onBreathStop();

		this.props.audioActions.play(data);
	}

	onAudioStop(data) {
		const { currentTrackObject } = this.props;
		if (currentTrackObject && data.id == currentTrackObject.id) {
			this.props.audioActions.stop(data);
		}
	}

	async onImageFocus(object) {
    AnalyticsLib.trackObject('Focus', object);

    this.playChimeSound();

    this.setState({ isFocusImageShown: true });

    this._focusImageOpacity = new Animated.Value(0);

    InteractionManager.runAfterInteractions(() => {
      Animated.timing( this._focusImageOpacity, {
        toValue: 1,
        duration: 600,
				useNativeDriver: true,
      }).start();
    });

    this._focusTimer = setTimeout(() => {
      this.onImageUnfocus()
      this.props.rewardActions.earnViaFocus();
    }, 60000);
	}

	async onImageUnfocus() {
    // Note: when disabling via focusTimer, this function gets called twice. The 1st time
    //       is from the timer. The 2nd time is likely from modal dismiss.
    if (this.state.isFocusImageShown === false) { return; }

    this._focusTimer && clearTimeout(this._focusTimer);

    this.playChimeSound();

    InteractionManager.runAfterInteractions(() => {
      Animated.timing( this._focusImageOpacity, {
        toValue: 0,
        duration: 600,
				useNativeDriver: true,
      }).start(() => {
        this.setState({ isFocusImageShown: false });
      });
    });
	}

	async onBreathStart(voice) {
    // Stop sonic spa tracks
    this.props.audioActions.stop();

    this.setState({ isBreathing: true });

    const mp3Resources = BreathLib.getBreathMp3Resources(voice);

    this.startBreathCycle(mp3Resources);
	}

	async onBreathStop() {
    this.setState({ isBreathing: false });
    this._voiceInhaleTimer && clearTimeout(this._voiceInhaleTimer);
    this._voiceExhaleTimer && clearTimeout(this._voiceExhaleTimer);
    this._voiceLoopTimer && clearTimeout(this._voiceLoopTimer);
	}

	///////////////
	// Functions //
	///////////////

	async playChimeSound() {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: 'chime',
      url: require('../../audios/chime.mp3'),
      title: 'chime',
      artist: 'Instacalm',
    });
    await TrackPlayer.play();
	}

  startBreathCycle(mp3Resources) {
    this._voiceInhaleTimer = setTimeout(async () => {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'inhale',
        url: mp3Resources.inhale,
        title: 'inhale',
        artist: 'Breather',
      });
      await TrackPlayer.play();
    }, 1500);

    this._voiceExhaleTimer = setTimeout(async () => {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'exhale',
        url: mp3Resources.exhale,
        title: 'exhale',
        artist: 'Breather',
      });
      await TrackPlayer.play();
    }, 10000);

    this._voiceLoopTimer = setTimeout(async () => {
      await this.startBreathCycle(mp3Resources);
    }, 15000);
  }
}

HomeShortcuts.propTypes = propTypes;
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  textTitle: {
		...sc.textBold,
		fontSize: 20,
    marginBottom: 10,
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
	imageFullscreen: {
    width: sc.dimension.wp(100),
    height: sc.dimension.hp(100),
	},
  imageBackground: {
		width: Math.round((Dimensions.get('window').width - 20) / 3) - 5,
		height: Math.round((Dimensions.get('window').width - 20) / 3) - 5,
  },
  imageControl: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
  },
});

export default connect(state => ({
		currentTrackObject	: state.audio.object,
		currentMode					: state.audio.mode,
		pinnedAudio	        : state.app.pinned_audio,
		pinnedPhoto	        : state.app.pinned_photo,
		pinnedVoice	        : state.app.pinned_voice,
	}),
	dispatch => ({
		appActions	    : bindActionCreators(appActions, dispatch),
		audioActions		: bindActionCreators(audioActions, dispatch),
		rewardActions		: bindActionCreators(rewardActions, dispatch),
	}),
	null,
)(HomeShortcuts);
