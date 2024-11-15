import React, {Component, useState} from 'react';
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
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import {
//   CachedImage,
//   ImageCacheProvider
// } from 'react-native-cached-image';
import * as audioActions from '../../actions/audio-actions';
import sc from '../../../config/styles';

const propTypes = {
  data: PropTypes.object.isRequired,
  currentTrackObject: PropTypes.object,
  currentMode: PropTypes.string,
  audioActions: PropTypes.object.isRequired,
};

const ProgressBar = ({ length }) => {
  const [seekingPosition, setSeekingPosition] = useState(null);
  const { position, duration } = useProgress();

  const secondsToTime = (seconds) => {
    const position = Math.round(seconds);
    const positionMin = `${Math.floor(position / 60)}`;
    const positionSec = `${position % 60}`;
    return `${positionMin}:${positionSec.padStart(2, '0')}`;
  };

  const progress = duration > 0
    ? (seekingPosition !== null ? seekingPosition : position) / duration
    : 0;

  return (
    <View style={{ flex: 1, justifyContent: 'center', marginTop: 4 }}>
      <View style={{ marginTop: -4, marginBottom: -10 }}>
        <Slider
          value={progress}
          thumbImage={require('../../../images/cell/audio-track-thumb-12.png')}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#FFFFFF"
          onValueChange={(val) => {
            const position = Math.floor(duration * val);
            setSeekingPosition(position);
          }}
          onSlidingComplete={(val) => {
            const position = Math.floor(duration * val);
            TrackPlayer.seekTo(position);
            setTimeout(() => setSeekingPosition(null), 1000);
          }}
        />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ ...sc.text }}>{secondsToTime(seekingPosition !== null ? seekingPosition : position)}</Text>
        <Text style={{ ...sc.text }}>{length}</Text>
      </View>
    </View>
  );
};


ProgressBar.propTypes = {
  length: PropTypes.string.isRequired,
};

class ProgressBarPlaceholder extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', marginTop: 4 }} pointerEvents="none">
        <View style={{ marginTop: -4, marginBottom: -10 }}>
          <Slider
            value={0}
            thumbImage={require('../../../images/cell/audio-track-thumb-12.png')}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#FFFFFF"
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...sc.text }}>0:00</Text>
          <Text style={{ ...sc.text }}>{this.props.length}</Text>
        </View>
      </View>
    );
  }
}

ProgressBarPlaceholder.propTypes = {
  length: PropTypes.string.isRequired,
};

class FeedCellAudioView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFullscreenShown: false,
    };

    this._opacity = new Animated.Value(0);
  }

  onPressPlay = () => {
    const { data } = this.props;
    this.props.audioActions.play(data);
  }

  onPressPause = () => {
    const { data, currentTrackObject } = this.props;
    if (currentTrackObject && data.id === currentTrackObject.id) {
      this.props.audioActions.pause(data);
    }
  }

  onPressStop = () => {
    const { data, currentTrackObject } = this.props;
    if (currentTrackObject && data.id === currentTrackObject.id) {
      this.props.audioActions.stop(data);
    }
  }

  onPressFullscreenShow = () => {
    this.setState({ isFullscreenShown: true });
    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this._opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  }

  onPressFullscreenHide = () => {
    this.setState({ isFullscreenShown: false });
  }

  render() {
    const { data, currentTrackObject, currentMode } = this.props;
    const isCurrentTrack = currentTrackObject && (data.id === currentTrackObject.id);
    const isPlaying = isCurrentTrack && currentMode === 'play';
    const playImageSrc = isCurrentTrack
      ? require('../../../images/cell/play-hl-64.png')
      : require('../../../images/cell/play-64.png');
    const pauseImageSrc = isCurrentTrack
      ? require('../../../images/cell/pause-hl-64.png')
      : require('../../../images/cell/pause-64.png');
    const hasTitle = data.title && data.title !== '' && !data.is_title_hidden;
    const imageLink = data.fullscreen_image_link || data.image_link;

    const playButton = (
      <TouchableWithoutFeedback onPress={this.onPressPlay}>
        <Image style={styles.imageControl} source={playImageSrc} />
      </TouchableWithoutFeedback>
    );

    const pauseButton = (
      <TouchableWithoutFeedback onPress={this.onPressPause}>
        <Image style={styles.imageControl} source={pauseImageSrc} />
      </TouchableWithoutFeedback>
    );

    const stopButton = (
      <TouchableWithoutFeedback onPress={this.onPressStop}>
        <Image style={styles.imageControl} source={require('../../../images/cell/stop-64.png')} />
      </TouchableWithoutFeedback>
    );

    return (
      // <ImageCacheProvider
      //   urlsToPreload={data.fullscreen_image_link
      //     ? [data.image_link, data.fullscreen_image_link]
      //     : [data.image_link]}>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (isCurrentTrack) {
                this.onPressFullscreenShow();
              }
            }}>
            <Image style={styles.imageInline} source={{ uri: imageLink }} />
          </TouchableWithoutFeedback>

          {hasTitle && (
            <View style={styles.containerText}>
              {data.title !== '' && <Text style={styles.textTitle}>{data.title}</Text>}
              {data.content !== '' && <Text style={styles.textContent}>{data.content}</Text>}
            </View>
          )}

          <View style={styles.containerControls}>
            <View style={styles.containerProgressBar}>
              {isCurrentTrack ? (
                <ProgressBar length={data.length} />
              ) : (
                <ProgressBarPlaceholder length={data.length} />
              )}
            </View>
            {isPlaying ? pauseButton : playButton}
            {stopButton}
          </View>

          <Modal
            visible={this.state.isFullscreenShown}
            animationType={'fade'}
            transparent={true}
            onRequestClose={this.onPressFullscreenHide}>
            <Animated.View style={{ opacity: this._opacity }}>
              <StatusBar animated={true} hidden={true} />
              <TouchableWithoutFeedback onPress={this.onPressFullscreenHide}>
                {/* <CachedImage
                  style={styles.imageFullscreen}
                  resizeMode={'cover'}
                  source={{ uri: data.fullscreen_image_link }}
                /> */}
                <Image 
                  style={styles.imageFullscreen}
                  resizeMode={'cover'}
                  source={{ uri: data.fullscreen_image_link }}
                />
              </TouchableWithoutFeedback>
            </Animated.View>
          </Modal>
        </View>
      // </ImageCacheProvider>
    );
  }
}

FeedCellAudioView.propTypes = propTypes;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: sc.colors.backgroundGray,
    borderRadius: 30,
    overflow: 'hidden',
  },
  containerText: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: sc.colors.backgroundGray,
  },
  containerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: sc.colors.backgroundGray,
    padding: 10,
  },
  containerProgressBar: {
    flex: 1,
    paddingHorizontal: 10,
  },
  containerFullscreen: {
    flex: 0,
    marginTop: 5,
    marginRight: 37,
  },
  textTitle: {
    ...sc.textBold,
    fontSize: 24,
    paddingBottom: 10,
  },
  textContent: {
    ...sc.text,
    fontSize: 18,
  },
  imageInline: {
    width: Dimensions.get('window').width - 20,
    height: (Dimensions.get('window').width - 20) * 1.3,
  },
  imageControl: {
    width: 52,
    height: 52,
    marginLeft: 10,
  },
  imageFullscreen: {
    width: sc.dimension.wp(100),
    height: sc.dimension.hp(100),
  },
});

export default connect(
  state => ({
    currentTrackObject: state.audio.object,
    currentMode: state.audio.mode,
  }),
  dispatch => ({
    audioActions: bindActionCreators(audioActions, dispatch),
  })
)(FeedCellAudioView);
