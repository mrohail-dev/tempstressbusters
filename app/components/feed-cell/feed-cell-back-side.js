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
import sc from '../../../config/styles';

const propTypes = {
	data			: PropTypes.any,
};

class FeedCellBackSideView extends Component {

  constructor(props) {
    super(props);
  }

	render() {
		const styles = this.constructor.styles;
		const { data } = this.props;
		const width = '100%';
		const height = '100%';

		return (
      // <ImageCacheProvider
      //   urlsToPreload={ [ data.flip_side_image_link ] } >

        <View style={styles.container}>
          {/* <CachedImage
            style={{ width, height }}
            source={{uri:data.flip_side_image_link}} /> */}
           <Image
            style={{ width, height }}
            source={{uri:data.flip_side_image_link}} /> 
        </View>

      // </ImageCacheProvider>
		);
	}

}

FeedCellBackSideView.propTypes = propTypes;
FeedCellBackSideView.styles = StyleSheet.create({
	container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: sc.colors.white,
    borderRadius: 30,
    overflow: 'hidden',
  },
	containerText: {
		flex: 1,
    marginVertical: 10,
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
	imageFullscreen: {
    width: sc.dimension.wp(100),
    height: sc.dimension.hp(100),
	},
});

export default connect(state => ({
	}),
	dispatch => ({
	})
)(FeedCellBackSideView);
