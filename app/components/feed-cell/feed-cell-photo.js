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

class FeedCellPhotoView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isFullscreenShown: false,
    };
  }

	onPressFullscreenShow = () => {
    this.setState({ isFullscreenShown: true });

    this._opacity = new Animated.Value(0);

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
		const styles = this.constructor.styles;
		const { data } = this.props;
		const width = Dimensions.get('window').width - 20;
    // Ideally we want to set the height so the image plus the activity bar below it takes
    // the entire page above the home feed shortcuts. But on smaller phones, if height is
    // too short, the minimum will be the width of the image.
		const height = data.is_image_thumbnail_cropped
        ? Math.max(Dimensions.get('window').height - 430, width)
        : width / data.image_width * data.image_height;
		const hasTitle = data.title && (data.title != '') && ! data.is_title_hidden;
		const imageView = () => (
			// <CachedImage
			// 	style={{width:width, height:height}}
			// 	source={{uri:data.image_link}} />\
   			<Image
          style={{width:width, height:height}}
          source={{uri:data.image_link}} />
		);

		return (
      // <ImageCacheProvider
      //   urlsToPreload={ [ data.image_link ] } >

        <View style={styles.container}>
          {hasTitle &&
            <View style={styles.containerText}>
              { (data.title != '') &&
                  <Text style={styles.textTitle}>{data.title}</Text>
              }
              { (data.content != '') &&
                  <Text style={styles.textContent}>{data.content}</Text>
              }
            </View>
          }
          <View>
            {(() => {
              if (data.related_screen) {
                return imageView()
              }
              else {
                return (
                  <TouchableWithoutFeedback
                    onPress={this.onPressFullscreenShow}>
                    { imageView() }
                  </TouchableWithoutFeedback>
                )
              }
            })()}
          </View>

          <Modal
            visible={this.state.isFullscreenShown}
            animationType={'fade'}
            transparent={true}
            onDismiss={this.onPressFullscreenHide} >

            <Animated.View style={{ opacity:this._opacity, backgroundColor:'black' }}>
              <StatusBar animated={true} hidden={true} />
              <TouchableWithoutFeedback
                onPress={this.onPressFullscreenHide}>

                {/* <CachedImage
                  style={styles.imageFullscreen}
                  resizeMode={ data.type === 'photo' ? 'cover' : 'contain' }
                  source={{uri:data.image_link}} /> */}
                 <Image
                  style={styles.imageFullscreen}
                  resizeMode={ data.type === 'photo' ? 'cover' : 'contain' }
                  source={{uri:data.image_link}} /> 

              </TouchableWithoutFeedback>
            </Animated.View>

          </Modal>
        </View>

      // </ImageCacheProvider>
		);
	}

}

FeedCellPhotoView.propTypes = propTypes;
FeedCellPhotoView.styles = StyleSheet.create({
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
    marginVertical: 10,
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	containerFullscreen: {
		flex:0,
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
	imageFullscreen: {
    width: sc.dimension.wp(100),
    height: sc.dimension.hp(100),
	},
});

export default connect(state => ({
		currentTrackObject	  : state.audio.object,
		currentMode					  : state.audio.mode,
	}),
	dispatch => ({
		audioActions				  : bindActionCreators(audioActions, dispatch),
	})
)(FeedCellPhotoView);
