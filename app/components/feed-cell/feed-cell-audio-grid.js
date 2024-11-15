import React, {Component} from 'react';
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
import TrackPlayer from 'react-native-track-player';
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
	data			: PropTypes.any,
};

class FeedCellAudioGridView extends Component {

  constructor(props) {
    super(props);
  }

	onPressPlay = async () => {
		const { data } = this.props;
		this.props.audioActions.play(data);
	}

	render() {
		const styles = this.constructor.styles;
		const { data } = this.props;
		const hasTitle = data.title && (data.title != '') && ! data.is_title_hidden;
    const imageLink = data.fullscreen_image_link || data.image_link

		return (
      // <ImageCacheProvider
      //   urlsToPreload={ data.fullscreen_image_link
      //     ? [ data.image_link, data.fullscreen_image_link ]
      //     : [ data.image_link ] } >

        <View style={styles.container}>
          { /* Image */ }
          <TouchableWithoutFeedback
            onPress={() => {
              this.onPressPlay();
            }}>
            <Image
              style={styles.imageInline}
              source={{uri:imageLink}} />
          </TouchableWithoutFeedback>

          { /* Title + Content */ }
          {hasTitle &&
            <View style={styles.containerText}>
              <Text style={styles.textTitle}>{data.title}</Text>
            </View>
          }
        </View>

      // {/* </ImageCacheProvider> */}
		);
	}

}

FeedCellAudioGridView.propTypes = propTypes;
FeedCellAudioGridView.styles = StyleSheet.create({
	container: {
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
	containerText: {
	},
	textTitle: {
		...sc.text,
    textAlign: 'center',
		paddingLeft: 10,
		paddingTop: 10,
		paddingBottom: 10,
	},
	imageInline: {
		width: Dimensions.get('window').width / 2 - 20,
		height: Dimensions.get('window').width / 2 - 20,
    borderRadius: 30,
    overflow: 'hidden',
	},
});

export default connect(state => ({
	}),
	dispatch => ({
		audioActions				  : bindActionCreators(audioActions, dispatch),
	})
)(FeedCellAudioGridView);
