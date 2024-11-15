import React, {Component} from 'react';
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

		const html = "<html> <body style='margin:0px;padding:0px;background-color:black;'> <script type='text/javascript' src='http://www.youtube.com/iframe_api'></script> <script type='text/javascript'> function onYouTubeIframeAPIReady() { ytplayer=new YT.Player('playerId',{events:{onReady:onPlayerReady}}) } function onPlayerReady(a) { } </script> <iframe id='playerId' type='text/html' width='" + width + "' height='" + height + "' src='http://www.youtube.com/embed/" + youtubeId + "?enablejsapi=1&rel=0&playsinline=1&&showinfo=0&modestbranding=1&autohide=1&controls=0' frameborder='0'> </body> </html>"

		return (
			<View style={styles.container}>
				<View style={styles.textContainer}>
					<Text style={styles.textTitle}>{title}</Text>
					<Text style={styles.textContent}>{content}</Text>
				</View>
				<WebView
					allowsInlineMediaPlayback={true}
					scrollEnabled={false}
					style={{width:width, height:height}}
					source={{html:html}} />
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
