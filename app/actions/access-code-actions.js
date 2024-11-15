import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNIap from 'react-native-iap';
import * as types from './action-types';
import * as constants from '../../config/constants';
import * as apiClient from '../libs/api-client';
import * as appActions from './app-actions';
import AnalyticsLib from '../libs/analytics-lib';

// Load access code
export function loadAccessCodeFromDisk() {
  return async (dispatch, getState) => {
    dispatch(loadingAccessCodeFromDisk());

    console.info('loadingAccessCodeFromDisk');
    AsyncStorage.getItem('accessCode', async (err, result) => {
      console.info('loaded', result);
      dispatch(loadedAccessCodeFromDisk(result));
    });
  };
}

export function loadingAccessCodeFromDisk() {
  return {
    type: types.ACCESS_CODE_LOADING_FROM_DISK,
  };
}

export function loadedAccessCodeFromDisk(code) {
  return {
    type: types.ACCESS_CODE_LOADED_FROM_DISK,
    code: code,
  };
}

export function showModal() {
  return {
    type: types.ACCESS_CODE_SHOW_MODAL,
  };
}

export function hideModal() {
  return {
    type: types.ACCESS_CODE_HIDE_MODAL,
  };
}

// Use free/paid version
export function useFree() {
  return async (dispatch, getState) => {
    const appState = getState().app;
    const schoolId = constants.LOCATION_ID_CALMCAST;
    const code = '__FREE__';

    AsyncStorage.setItem('accessCode', code, () => { });
    dispatch(loadedAccessCodeFromDisk(code));

    if (!appState.school || appState.school.id !== schoolId) {
      AsyncStorage.setItem('schoolId', schoolId, () => { });
      dispatch(appActions.loadSchoolWithSchoolId(schoolId));
    }
  };
}

export function usePaid() {
  return async (dispatch, getState) => {
    const appState = getState().app;
    const schoolId = constants.LOCATION_ID_CALMCAST;
    const code = '__PAID__';

    AsyncStorage.setItem('accessCode', code, () => { });
    dispatch(loadedAccessCodeFromDisk(code));

    if (!appState.school || appState.school.id !== schoolId) {
      AsyncStorage.setItem('schoolId', schoolId, () => { });
      dispatch(appActions.loadSchoolWithSchoolId(schoolId));
    }
  };
}

// Use access code
export function useCode(email, code) {
  return async (dispatch, getState) => {
    dispatch(useCodeLoading(response));

    const path = 'use_access_code';
    const response = await apiClient.post(path, { email, code });
    if (response.error) {
      dispatch(usedCodeError(response));
    }
    else {
      const code = response.code;
      const schoolId = response.school;
      AsyncStorage.setItem('accessCode', code, () => { });
      AsyncStorage.setItem('schoolId', schoolId, () => { });
      dispatch(appActions.loadSchoolWithSchoolId(schoolId));
      dispatch(usedCodeSuccess(response));
    }
  };
}

export function useCodeLoading(response) {
  return {
    type: types.ACCESS_CODE_USE_LOADING,
  };
}

export function usedCodeSuccess(response) {
  return {
    type: types.ACCESS_CODE_USE_SUCCESS,
    code: response.code,
  };
}

export function usedCodeError(response) {
  return {
    type: types.ACCESS_CODE_USE_ERROR,
    error: response.error,
    message: response.message,
  };
}

// Check access code validity
export function checkCodeValidity() {
  return async (dispatch, getState) => {
    const code = getState().accessCode.access_code;
    if (code == null) { return; }
    // Case 1: free Calmcast
    if (code == '__FREE__') { return; }
    // Case 2: paid Calmcast
    if (code == '__PAID__') {
      // check is valid
      let isValid = false;
      if (Platform.OS === 'ios') {
        const receiptData = await RNIap.getReceiptIOS();
        if (receiptData) {
          isValid = await validateReceipt(receiptData);
        }
        // override
        isValid = true;
      }
      else {
        const productId = constants.SUBSCRIPTION_IDENTIFIER_ANDROID_MONTHLY;
        const details = await InAppBilling.getSubscriptionTransactionDetails(productId);
        isValid = (details.purchaseState != 'Canceled'
          && details.purchaseState != 'Refunded'
          && details.purchaseState != 'SubscriptionExpired');
      }
      // handle invalid
      if (!isValid) {
        const code = '__FREE__';
        AsyncStorage.setItem('accessCode', code, () => { });
        dispatch(loadedAccessCodeFromDisk(code));
      }
    }
    // Case 3: verify access code
    else {
      const path = 'validate_access_code';
      const response = await apiClient.post(path, { code: code });
      if (response.error) {
        AsyncStorage.removeItem('accessCode');
        AsyncStorage.removeItem('schoolId');
        dispatch(checkCodeValidityError(response));
      }
    }
  };
}

export function checkCodeValidityError(response) {
  return {
    type: types.ACCESS_CODE_VALIDATION_ERROR,
  };
}

async function validateReceipt(receiptData) {
  const password = '320c20dc55f5428ab7a93b1f6de2b5bf';
  const isProduction = !__DEV__;

  try {
    const validationData = await RNIap.validateReceiptIos({
      'receipt-data': receiptData,
      password,
    }, isProduction);
    const isValid = validationData['latest_receipt_info'][0].expires_date_ms > Date.now();
    AnalyticsLib.track('Receipt validationData', { isValid, validationData });
    return isValid;
  } catch (err) {
    AnalyticsLib.track('Receipt validate failure', { err });
    console.warn(err);
    console.log(err.valid, err.error, err.message)
  }

  return true;
}
