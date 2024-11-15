import React, { Component } from 'react';
import { Animated, Dimensions, Easing, Image, InteractionManager, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AnalyticsLib from '../libs/analytics-lib';
import * as BreathLib from '../libs/breath-lib';
import * as appActions from '../actions/app-actions';
import * as audioActions from '../actions/audio-actions';
import * as breathActions from '../actions/breath-actions';
import * as rewardActions from '../actions/reward-actions';
import sc from '../../config/styles';

const minBallSize = sc.dimension.wp(0.3);
const maxBallSize = sc.dimension.wp(0.8);

const propTypes = {
};

class Breath extends Component {
  constructor(props) {
    super(props);

    this._chromeOpacity = new Animated.Value(0);
    this._ballSize = new Animated.Value(1);
    this._inhaleLabelOpacity = new Animated.Value(0);
    this._exhaleLabelOpacity = new Animated.Value(0);
    this._loops = 0;
    this._startTime = Date.now();
    this._voiceInhaleTimer = null;
    this._voiceExhaleTimer = null;
    this.state = {
      voice: null,
    };

    this.onPressClose = this.onPressClose.bind(this);
  }

  componentDidMount() {
    // Stop sonic spa tracks
    this.props.audioActions.stop();

    // Initialize player
    // TrackPlayer.setupPlayer();

    const { width } = Dimensions.get('window');

    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this._chromeOpacity, {
        delay: 0,
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      Animated.timing(this._ballSize, {
        toValue: minBallSize,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        this.cycleBallAnimation(minBallSize, maxBallSize);
      });
    });
  }

  componentWillUnmount() {
    TrackPlayer.stop();
  }

  render() {
    const styles = this.constructor.styles;
    const chromeAnimatedStyles = [styles.container, { opacity: this._chromeOpacity }];
    return (
      <Animated.View style={chromeAnimatedStyles}>
        <View style={styles.containerBall}>
          {/* <Animated.Image
            // style={{width:this._ballSize, height:this._ballSize}}
            source={require('../../images/chrome/breath-ball.png')} /> */}
          <Animated.View style={{ transform: [{ scale: this._ballSize }] }}>
            <Image
              source={require('../../images/chrome/breath-ball.png')}
              style={styles.ballImage} // Style for consistent initial size
            />
          </Animated.View>
        </View>

        <View style={styles.containerInstruction}>
          <Animated.View style={{ position: 'absolute', opacity: this._inhaleLabelOpacity }}>
            <Text style={styles.textLabel}>inhale</Text>
          </Animated.View>
          <Animated.View style={{ position: 'absolute', opacity: this._exhaleLabelOpacity }}>
            <Text style={styles.textLabel}>exhale</Text>
          </Animated.View>
        </View>

        <View style={styles.containerVoices}>
          <ScrollView
            horizontal={true}
            scrollsToTop={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{}} >

            {this.renderVoiceButton('anita', 'Anita')}
            {this.renderVoiceButton('justin', 'Justin')}
            {this.renderVoiceButton('serena', 'Serena')}
            {this.renderVoiceButton('damien', 'Damien')}
            {this.renderVoiceButton('aiden', 'Aiden')}
          </ScrollView>
        </View>

        <View style={styles.containerControl}>
          <View style={styles.containerControlButton}>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <TouchableHighlight
                underlayColor={sc.buttonHighlightColor}
                onPress={() => this.onPressClose()}>
                <Image
                  style={styles.imageButton}
                  source={require('../../images/chrome/breath-stop.png')} />
              </TouchableHighlight>
            </View>

          </View>
        </View>

      </Animated.View>
    );
  }

  renderVoiceButton(voice, voiceName) {
    const styles = this.constructor.styles;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, }}>
        <TouchableHighlight
          underlayColor={sc.buttonHighlightColor}
          onPress={() => this.onPressVoice(voice)}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={styles.imageVoice}
              resizeMode={'contain'}
              source={this.state.voice === voice
                ? require('../../images/chrome/breath-wave-background-hl-alpha-90.png')
                : require('../../images/chrome/breath-wave-background-alpha-90.png')
              } />
            <Text style={this.state.voice === voice
              ? styles.textVoiceButtonHighlighted
              : styles.textVoiceButton
            }>{voiceName}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
  ////////////////////
  // Event Callback //
  ////////////////////

  ///////////////
  // Functions //
  ///////////////

  cycleBallAnimation(minBallSize, maxBallSize) {

    this._voiceInhaleTimer = setTimeout(async () => {
      if (this.state.voice !== null) {
        const mp3Resources = BreathLib.getBreathMp3Resources(this.state.voice);
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: 'inhale',
          url: mp3Resources.inhale,
          title: 'inhale',
          artist: 'Breather',
        });
        await TrackPlayer.play();
      }
    }, 1500);

    this._voiceExhaleTimer = setTimeout(async () => {
      if (this.state.voice !== null) {
        const mp3Resources = BreathLib.getBreathMp3Resources(this.state.voice);
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: 'exhale',
          url: mp3Resources.exhale,
          title: 'exhale',
          artist: 'Breather',
        });
        await TrackPlayer.play();
      }
    }, 10000);

    Animated.parallel([
      // Icon animation (1.5 + 5 + 3.5 + 5 = 15 sec)
      Animated.sequence([
        Animated.timing(this._ballSize, {
          toValue: maxBallSize,
          duration: 5000,
          delay: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(this._ballSize, {
          toValue: minBallSize,
          duration: 5000,
          delay: 3500,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
      ]),
      // Label animation (3 + 1.5 + 1 + 1.5 + 1 + 3 + 3 + 1.5 = 15 sec)
      Animated.sequence([
        Animated.timing(this._inhaleLabelOpacity, {
          toValue: 1,
          duration: 3000,
          delay: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(this._inhaleLabelOpacity, {
          toValue: 0,
          duration: 1000,
          delay: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(this._exhaleLabelOpacity, {
          toValue: 1,
          duration: 1000,
          delay: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(this._exhaleLabelOpacity, {
          toValue: 0,
          duration: 3000,
          delay: 1500,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
      ]),
    ]).start((data) => {
      // handle animation cancelled (finished flag NOT set) => stop
      if (!data.finished) { return; }

      this._loops++;

      // reward 50 points
      if (this._loops == 3) {
        this.props.rewardActions.earnViaBreath();
      }

      this.cycleBallAnimation(minBallSize, maxBallSize);
    });
  }

  onPressVoice(voice) {
    if (this.state.voice === voice) {
      this.setState({ voice: null });
    }
    else {
      AnalyticsLib.track('Breather Voice', { voice });
      this.setState({ voice });
      this.props.appActions.pinVoice(voice);
    }
  }

  onPressClose() {
    const duration = Math.round((Date.now() - this._startTime) / 1000);
    AnalyticsLib.track('Breather View', { duration: duration });

    this._chromeOpacity.setValue(1);
    this._ballSize.stopAnimation();
    this._voiceInhaleTimer && clearTimeout(this._voiceInhaleTimer);
    this._voiceExhaleTimer && clearTimeout(this._voiceExhaleTimer);

    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this._chromeOpacity, {
        delay: 0,
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => this.props.breathActions.close());
    });
  }

}

Breath.propTypes = propTypes;
Breath.styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: sc.colors.backgroundNavy,
  },
  ballImage: {
    width: 100,  // Base width
    height: 100, // Base height
    resizeMode: 'contain', // Ensure it scales proportionally
  },
  containerBall: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 3,
  },
  containerInstruction: {
    flex: 1,
    alignItems: 'center',
  },
  containerVoices: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerControlButton: {
    justifyContent: 'center',
  },
  textLabel: {
    backgroundColor: 'transparent',
    color: sc.colors.white,
    fontFamily: sc.fontFamily.normal,
    fontSize: 40,
  },
  textVoiceButton: {
    backgroundColor: 'transparent',
    color: sc.colors.white,
    fontFamily: sc.fontFamily.normal,
    fontSize: 26,
  },
  textVoiceButtonHighlighted: {
    backgroundColor: 'transparent',
    color: sc.colors.highlightBlue,
    fontFamily: sc.fontFamily.normal,
    fontSize: 26,
  },
  imageButton: {
    width: 48,
    height: 48,
  },
  imageVoice: {
    position: 'absolute',
    width: 72,
    height: 72,
  },
});

export default connect(state => ({
}),
  dispatch => ({
    appActions: bindActionCreators(appActions, dispatch),
    audioActions: bindActionCreators(audioActions, dispatch),
    breathActions: bindActionCreators(breathActions, dispatch),
    rewardActions: bindActionCreators(rewardActions, dispatch),
  })
)(Breath);
