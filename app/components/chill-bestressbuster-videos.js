import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Dimensions,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import WebView from 'react-native-webview';
import sc from '../../config/styles';

const propTypes = {
};

export default class ChillBeStressbusterVideos extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const styles = this.constructor.styles;
		const { width } = Dimensions.get('window');
		const height = width / 1.5;
		const title = "Become A Stressbuster";
		const content = "\"We are like rock stars on campus!\" Stressbusters from schools around the country talk about the program and why they love it so much.";
		const youtubeId = "_1OFp5eI8p8";

		const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: black;
        }
        #player-container {
          position: relative;
          width: 100vw;
          height: 56.25vw; /* Maintain 16:9 aspect ratio */
          overflow: hidden;
        }
        iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <div id="player-container">
        <div id="playerId"></div>
      </div>
      <script type="text/javascript" src="https://www.youtube.com/iframe_api"></script>
      <script type="text/javascript">
        var ytplayer;

        // This function is called when the IFrame API is ready
        function onYouTubeIframeAPIReady() {
          ytplayer = new YT.Player('playerId', {
            height: '100%',
            width: '100%',
            videoId: '${youtubeId}',
            playerVars: {
              autoplay: 0,
              rel: 0,
              playsinline: 1,
              showinfo: 0,
              modestbranding: 1,
              controls: 1,
            },
            events: {
              onReady: onPlayerReady,
            },
          });
        }

        // Called when the player is ready
        function onPlayerReady(event) {
          console.log('YouTube Player is ready.');
          // Example: Play the video automatically
          // event.target.playVideo();
        }
      </script>
    </body>
  </html>
`;


		return (
			<View style={styles.container}>
				<View style={styles.textContainer}>
					<Text style={styles.textTitle}>{title}</Text>
					<Text style={styles.textContent}>{content}</Text>
				</View>
				<WebView
					allowsInlineMediaPlayback={true}
					scrollEnabled={false}
					style={{ width: width, height: height }}
					source={{ html: html }}

				/>
			</View>
		);
	}


	////////////////////
	// Event Callback //
	////////////////////

}

ChillBeStressbusterVideos.propTypes = propTypes;
ChillBeStressbusterVideos.styles = StyleSheet.create({
	container: {
		flex: 0,
	},
	textContainer: {
		padding: 20,
	},
	textTitle: {
		...sc.textBold,
	},
	textContent: {
		...sc.text,
	},
});
