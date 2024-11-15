import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
	Dimensions,
  Image,
  Platform,
  StyleSheet,
	TouchableWithoutFeedback,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as rewardActions from '../actions/reward-actions';

const propTypes = {
	youtubeId			    : PropTypes.any,
	youtubeList	      : PropTypes.any,
	startTime	        : PropTypes.any,
	onPlay	          : PropTypes.any,
	onEnded	          : PropTypes.any,
};

const rewardTimeMark = 60;

class YouTubeView extends Component {

	constructor(props) {
		super(props);

    this._webView;
    this.state = {
      // Note: do not render loader for Android, b/c loader triggers YouTube
      // video not start playing
      isWebViewLoaded   : false,
      isPlaying         : false,
      isRewarded        : this.props.startTime > rewardTimeMark,
    };
	}

	render() {
		return (
      <View style={{flex:1}} >
        { this._renderVideo() }
        { ! this.state.isPlaying && this._renderPlayButton() }
        { /* this.state.isPlaying && this._renderPausedButton() */}
      </View>
		);
  }

  _renderPlayButton() {
    const { youtubeId } = this.props;
    // calculate width and height inn 1.77778 aspect ratio
    const width = Dimensions.get('window').width - 20;
    const height = width / 1.5;
    const left = 0;
//    const widthOri = Dimensions.get('window').width - 20;
//    const height = widthOri / 1.5;
//    const width = height * 1.777778;
//    const left = (widthOri - width) / 2;
    return (
      <View style={{top:0, left:0, right:0, bottom:0, position:'absolute'}} >
        <TouchableWithoutFeedback
          style={{flex:1}}
          onPress={() => {
            this._webView.injectJavaScript(`
              ytplayer.playVideo();
            `);
            this.props.onPlay();
            this.setState({isPlaying:true});
          }}
        >
          <View style={{flex:1}}>
            <Image
              style={{left, width, height}}
              resizeMode={ 'cover' }
              source={{uri:'https://img.youtube.com/vi/'+youtubeId+'/0.jpg'}} />
            <View style={{top:0, bottom:0, left:0, right:0, position:'absolute', alignItems:'center', justifyContent:'center'}}>
              <Image
                style={{width:92, height:92}}
                source={require('../../images/chrome/youtube-256.png')} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  _renderPausedButton() {
    return (
      <View style={{top:0, left:0, right:0, bottom:40, position:'absolute', justifyContent:'center', alignItems:'center'}}>
        <TouchableWithoutFeedback
          onPress={() => {
            this._webView.injectJavaScript(`
              (ytplayer.getPlayerState() == YT.PlayerState.PLAYING)
                ? ytplayer.pauseVideo()
                : ytplayer.playVideo();
            `);
          }}
        >
          <View style={{top:0, left:0, right:0, bottom:0, position:'absolute'}} />
        </TouchableWithoutFeedback>
      </View>
    );
  }

	_renderVideo() {
    const { isAppActive } = this.props;
		const html = (isAppActive)
      ? this._getActiveWebViewHtml()
      : this._getInactiveWebViewHtml();

    // Note: scale to fit for Android
    return (
      <WebView
        ref={component => this._webView = component}
        allowsInlineMediaPlayback={true}
        injectedJavaScript={`
          window.setInterval(() => {
            document.getElementsByClassName("ytp-chrome-top")[0].remove();
            document.getElementsByClassName("ytp-pause-overlay")[0].remove();
          }, 1000);
        `}
        injectedJavaScriptForMainFrameOnly={false}
        scalesPageToFit={(Platform.OS !== 'ios')}
        scrollEnabled={false}
        style={{flex:1}}
        mediaPlaybackRequiresUserAction={false}
        onMessage={(e) => {
          // Handle YouTube event
          let message;
          try {
            message = JSON.parse(decodeURIComponent(decodeURIComponent(e.nativeEvent.data)));
          } catch(err) {
            return;
          }
          if (message.action == 'onPageLoaded') {
            this.setState({isWebViewLoaded:true});
          }
          else if (message.action == 'onPlay') {
          }
          else if (message.action == 'onPause') {
          }
          else if (message.action == 'onEnded') {
            this.setState({isPlaying:false});
            this.props.onEnded();
            this._webView.injectJavaScript(`
              ytplayer.stopVideo(0);
            `);
          }
          else if (message.action == 'onCurrentTime') {
            if (( ! this.state.isRewarded) && (message.time > rewardTimeMark)) {
              this.props.rewardActions.earnViaVideoPlay();
              this.setState({isRewarded:true});
            }
          }
        }}
        source={{html:html}} />
    );
  }

  _getActiveWebViewHtml() {
    const { youtubeId, youtubeList, startTime } = this.props;
    const startTimeInt = Math.floor(startTime);

    // Temporarily disable YouTube list b/c of the bug where the YouTube
    // player shows the "Video unavailable" error after the video finish
    // playing
    const youtubeListQs = "";
    //const youtubeListQs = youtubeId
    //  ? `list=RDEMTB63z0qhnihj3oNEZqO0jQ&`
    //  : "";

    return `
      <html>
        <body style='margin:0px;padding:0px;background-color:black;'>
          <script type='text/javascript' src='http://www.youtube.com/iframe_api'></script>
          <script type='text/javascript'>

            function onYouTubeIframeAPIReady() {
              ytplayer=new YT.Player('playerId', {
                events: {
                  onReady:onPlayerReady,
                  onStateChange:onPlayerStateChange,
                },
              })
            }

            function onPlayerReady(a) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              action: 'onPageLoaded',
            }));


              window.setInterval(onInterval, 5000);

//              ytplayer.playVideo();
//              document.getElementById('button').onclick = function() {
//                (ytplayer.getPlayerState() == YT.PlayerState.PLAYING)
//                  ? ytplayer.pauseVideo()
//                  : ytplayer.playVideo();
//              }
            }

            function onPlayerStateChange(a) {
              if (ytplayer.getPlayerState() == YT.PlayerState.PLAYING) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  action: 'onPlay',
                }));
              }
              else if (ytplayer.getPlayerState() == YT.PlayerState.PAUSED) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  action: 'onPause',
                }));
              }
              else if (ytplayer.getPlayerState() == YT.PlayerState.ENDED) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  action: 'onEnded',
                }));
              }
            }

            function onInterval() {
              if (ytplayer) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  action: 'onCurrentTime',
                  time: ytplayer.getCurrentTime(),
                }));
              }
            }

          </script>
          <div style='width:100%; height:100%; position:relative;'>
            <iframe id='playerId' type='text/html' width='100%' height='100%' src='https://www.youtube.com/embed/${youtubeId}?${youtubeListQs}enablejsapi=1&playsinline=1&rel=0&modestbranding=1&autohide=1&autoplay=1&controls=1&iv_load_policy=3' frameborder='0' allowfullscreen></iframe>
          </div>
        </body>
      </html>
    `;
  }

  _getInactiveWebViewHtml() {
    return "<html><body style='background-color:black'></body></html>";
  }
}

YouTubeView.propTypes = propTypes;
YouTubeView.styles = StyleSheet.create({
});

export default connect(state => ({
		isAppActive					  : state.app.is_app_active,
	}),
	dispatch => ({
		rewardActions	    	: bindActionCreators(rewardActions, dispatch),
	}),
	null,
	{ forwardRef: true }
)(YouTubeView);
