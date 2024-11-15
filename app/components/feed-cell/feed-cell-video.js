import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	WebView,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import YouTubeView from '../youtube-view';
import AnalyticsLib from '../../libs/analytics-lib';
import sc from '../../../config/styles';

const propTypes = {
	data  			    : PropTypes.any,
};

const width = Dimensions.get('window').width - 20;
const height = width / 1.5;

class FeedCellVideoView extends Component {

	constructor(props) {
		super(props);

    this.onPlay = this.onPlay.bind(this);
    this.onEnded = this.onEnded.bind(this);

    // Note: track which YouTube video has been clicked,
    //       render YouTubeView only if clicked
    this._youtubeView;
    this.state = {
      isVideoRendered   : false,
      isThumbRendered   : true,
    };
	}

	render() {
		const styles = this.constructor.styles;
    const { data } = this.props;
		return (
      <View style ={styles.container}>
        <View style={styles.containerText}>
          { (data.title != '') &&
              <Text style={styles.textTitle}>{data.title}</Text>
          }
          { (data.content != '') &&
              <Text style={styles.textContent}>{data.content}</Text>
          }
        </View>
        <View style={{width, height, backgroundColor:'black'}}>
          <YouTubeView
            ref={component => this._youtubeView = component}
            youtubeId={this.props.data.youtube_id}
            youtubeList={this.props.data.youtube_list}
            onPlay={this.onPlay}
            onEnded={this.onEnded}
          />
        </View>
      </View>
		);
	}

	//////////////////////
	// Public Functions //
	//////////////////////

	onPlay() {
    AnalyticsLib.trackObject('Video Play', this.props.data);
  }

	onEnded() {
    this.setState({ isVideoRendered:false, isThumbRendered:true });
  }

}

FeedCellVideoView.propTypes = propTypes;
FeedCellVideoView.styles = StyleSheet.create({
	container: {
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: sc.colors.backgroundGray,
    borderRadius: 30,
    overflow: 'hidden',
  },
	containerText: {
		flex: 1,
    marginTop: 10,
    marginBottom: 10,
		paddingVertical: 10,
		paddingHorizontal: 20,
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
});

export default connect(state => ({
	}),
	dispatch => ({
	}),
	null,
	{ forwardRef: true }
)(FeedCellVideoView);

