import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
// import { Camera, useCameraDevice} from 'react-native-vision-camera';
import AnalyticsLib from '../libs/analytics-lib';
import sc from '../../config/styles';
import * as chillRewardsActions from '../actions/chill-rewards-actions';

const ChillRewardsScan = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [deniedPermission, setDeniedPermission] = useState(false);
  const isProcessingScan = useSelector(state => state.chillRewards.is_processing_scan);
  const processingError = useSelector(state => state.chillRewards.processing_error);
  const processingSuccess = useSelector(state => state.chillRewards.processing_success);
  const dispatch = useDispatch();
  // const device = useCameraDevice('back')

  const checkAuthorizationStatus = useCallback(async () => {
	if (Platform.OS === 'ios') {
		// try {
		//   const isAuthorized = await Camera.checkVideoAuthorizationStatus();
		//   this.setState({
		//     showCamera: isAuthorized,
		//     deniedPermission: isAuthorized === false,
		//   });
		// } catch (e) {
		//   this.setState({showCamera: true});
		// }
	  } else  if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'Health Rewards would like to use your camera for scanning QR code.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      AnalyticsLib.track(`Scan Camera Permission [${Platform.OS}]`, {
        result,
      });
      if (result === PermissionsAndroid.RESULTS.GRANTED || result === true) {
        setShowCamera(true);
      } else {
        setShowCamera(false);
        setDeniedPermission(true);
      }
    }
  }, []);

  useEffect(() => {
    checkAuthorizationStatus();
  }, [checkAuthorizationStatus]);

  const onBarCodeRead = useCallback((frame) => {
    if (isProcessingScan || !frame.data) {
      return;
    }

    const code = frame.data.codeStringValue;
    dispatch(chillRewardsActions.processScan(code));
  }, [isProcessingScan, dispatch]);

  const styles = ChillRewardsScan.styles;
  return (
    <View style={styles.container}>
      {/* {showCamera  && (
        <Camera
        style={styles.preview}
        device={device}
        isActive={true}
        frameProcessorFps={5}
        audio={false}
        enableZoomGesture={true}
        // torch={torch ? 'on' : 'off'}
      />
)} */}
      {deniedPermission && (
        <View style={[styles.preview, { backgroundColor: 'black' }]}>
          <View style={styles.messageInnerContainer}>
            <Text style={styles.text}>
              Please allow Health Rewards to use your camera for scanning QR code.
            </Text>
          </View>
        </View>
      )}
      {isProcessingScan && <View style={styles.overlay} />}
      {processingError && (
        <View style={styles.messageContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch(chillRewardsActions.processScanRetry())}>
            <View style={styles.messageInnerContainer}>
              <Text style={styles.text}>{processingError} Click to retry.</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {processingSuccess && (
        <View style={styles.messageContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch(chillRewardsActions.processScanRetry())}>
            <View style={styles.messageInnerContainer}>
              <Text style={styles.text}>{processingSuccess} Click to scan again.</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

ChillRewardsScan.propTypes = {
  // Define PropTypes if needed
};

ChillRewardsScan.styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: sc.cameraOverlayColor,
  },
  messageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  messageInnerContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
  },
  text: {
    ...sc.text,
  },
});

export default ChillRewardsScan;
