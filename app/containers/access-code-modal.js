import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RNCommunications from 'react-native-communications';
import * as RNIap from 'react-native-iap';
import AnalyticsLib from '../libs/analytics-lib';
import * as AlertLib from '../libs/alert-lib';
// import tcomb from 'tcomb-form-native';
import * as accessCodeActions from '../actions/access-code-actions';
import sc from '../../config/styles';
import * as constants from '../../config/constants';
import Hr from '../components/hr';
import TextButton from '../components/buttons/text-button';
import LinkButton from '../components/buttons/link-button';
import TitleLabel from '../components/labels/title-label';
import Label from '../components/labels/label';
import RenderForm from './access-code-form';

// const flattenStyle = require('flattenStyle');

const itemSkus = Platform.select({
  ios: [
    constants.SUBSCRIPTION_IDENTIFIER_MONTHLY,
    constants.SUBSCRIPTION_IDENTIFIER_ANNUALLY,
  ],
  android: [
    constants.SUBSCRIPTION_IDENTIFIER_ANDROID_MONTHLY,
    constants.SUBSCRIPTION_IDENTIFIER_ANDROID_ANNUALLY,
  ]
});

const propTypes = {
  defaultVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

const planDetail = {
  monthly: {
    title: 'Monthly Subscription with Free Trial ($1.99/month)',
    content: 'By subscribing to Calmcast below, you will be able to use all of its chill features for free for two weeks. At the end of this trial period, you will be automatically subscribed to Calmcast for $1.99 per month unless you unsubscribe before the trial period has ended.',
    duration: 'One month',
    price: '$1.99 (after free trial)',
    priceRaw: '$1.99',
  },
  annually: {
    title: 'Annual Subscription with Free Trial ($11.99/year)',
    content: 'By subscribing to Calmcast below, you will be able to use all of its chill features for free for two weeks. At the end of this trial period, you will be automatically subscribed to Calmcast for $11.99 per year unless you unsubscribe before the trial period has ended.',
    duration: 'One year',
    price: '$11.99 (after free trial)',
    priceRaw: '$11.99',
  }
};

class AccessCodeModal extends Component {
  constructor(props) {
    super(props);

    this.onPressSubmit = this.onPressSubmit.bind(this);
    this.onPressSubscribe = this.onPressSubscribe.bind(this);
    this.onPressSubscriptionInfoShow = this.onPressSubscriptionInfoShow.bind(this);
    this.onPressSubscriptionInfoHide = this.onPressSubscriptionInfoHide.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.purchaseUpdateSubscription = null;
    this.purchaseErrorSubscription = null;
    this.subscriptions = [];

    this.state = {
      isSubscriptionInfoShown: false,
      subscriptionPlan: null,
      value: {},
    }
  }

  async componentDidMount() {
    // load production
    this.subscriptions = await RNIap.getSubscriptions(itemSkus);

    // add IAP listeners
    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(purchase => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        if (Platform.OS === 'ios') {
          RNIap.finishTransactionIOS(purchase.transactionId);
        }
        else if (Platform.OS === 'android') {
          RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
        }

        RNIap.finishTransaction(purchase);

        this.props.accessCodeActions.hideModal();
        this.props.accessCodeActions.usePaid();
        AnalyticsLib.track(`Subscription Purchase [${Platform.OS}]`, {
          transaction: JSON.stringify(purchase)
        });
      }
    });

    this.purchaseErrorSubscription = RNIap.purchaseErrorListener(async error => {
      console.warn('purchaseErrorListener', error);
      AnalyticsLib.track(`Subscription Failed [${Platform.OS}]`, {
        error: JSON.stringify(error),
      });

      // try restore
      try {
        const purchases = await RNIap.getAvailablePurchases();
        if (purchases.length > 0) {
          this.props.accessCodeActions.hideModal();
          this.props.accessCodeActions.usePaid();
          AnalyticsLib.track(`Subscription Restored [${Platform.OS}]`, {
            purchases: JSON.stringify(purchases)
          });
        }
      } catch (err) {
        AnalyticsLib.track(`Subscription Restore Failed [${Platform.OS}]`, {
          error: JSON.stringify(err),
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  onChange(value) {
    this.state.value = value;
  }

  render() {
    return (
      <Modal
        animationType={'fade'}
        onRequestClose={this.props.onHide}
        transparent={true}
        visible={this.props.defaultVisible || this.props.visible} >

        <View style={styles.container}>
          <View style={styles.containerInner}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={styles.containerHead}>
                <Image
                  style={styles.imageHead}
                  source={require('../../images/calmcast/icon-120.png')} />

                <View style={styles.containerHeadText}>
                  <Text style={styles.textHead} >
                    Welcome to The Chill Factory
                  </Text>
                </View>
              </View>
              {!this.state.isSubscriptionInfoShown &&
                <RenderForm
                  styles={styles}
                  onHide={this.props.onHide}
                  errorMessage={this.props.errorMessage}
                  planDetail={planDetail}
                  onPressSubscriptionInfoShow={this.onPressSubscriptionInfoShow}
                />}
              {this.state.isSubscriptionInfoShown &&
                this.renderSubscriptionInfo()}
            </ScrollView>





          </View>
        </View>
      </Modal>
    );
  }

  renderSubscriptionInfo() {
    const plan = planDetail[this.state.subscriptionPlan];
    return (
      <View style={styles.containerBody}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}>
          <TitleLabel>{plan.title}</TitleLabel>
          <Label>{plan.content}</Label>
          <Label />

          <TitleLabel>Duration:</TitleLabel>
          <Label>{plan.duration}</Label>
          <Label />

          <TitleLabel>Price:</TitleLabel>
          <Label>{plan.price}</Label>
          <Label />

          <TitleLabel>Details:</TitleLabel>
          <View style={{ flexDirection: 'row' }}>
            <Label>• </Label>
            <Label>Payment will be charged to iTunes Account at confirmation of purchase</Label>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Label>• </Label>
            <Label>Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period</Label>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Label>• </Label>
            <Label>Account will be charged for renewal within 24-hours prior to the end of the current period, and identify the cost of the renewal</Label>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Label>• </Label>
            <Label>Subscriptions may be managed by the user and auto-renewal may be turned off by going to the user's Account Settings after purchase</Label>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Label>• </Label>
            <Label>Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that publication, where applicable</Label>
          </View>
          <Label />

          <TitleLabel>Privacy Policy:</TitleLabel>
          <LinkButton
            text={'http://stressbustersappabc.com/?action=calmcast_privacy_policy'}
            fontSize={sc.isShortScreen ? 12 : 14}
            onPress={() => RNCommunications.web('http://stressbustersappabc.com/?action=calmcast_privacy_policy')} />
          <Label />

          <TitleLabel>Terms of Use:</TitleLabel>
          <LinkButton
            text={'http://stressbustersappabc.com/?action=calmcast_tos'}
            fontSize={sc.isShortScreen ? 12 : 14}
            onPress={() => RNCommunications.web('http://stressbustersappabc.com/?action=calmcast_tos')} />
          <Label />
        </ScrollView>
        <View style={{ flex: 0, marginTop: sc.dimension.hp(1) }}>
          <TextButton
            text={'Subscribe'}
            textColor={sc.colors.white}
            backgroundColor={'#234F82'}
            onPress={this.onPressSubscribe} />
          <View style={{ marginTop: sc.dimension.hp(1) }} />
          <TextButton
            text={'Back'}
            textColor={sc.colors.white}
            backgroundColor={sc.colors.gray}
            onPress={this.onPressSubscriptionInfoHide} />
        </View>
      </View>
    );
  }

  ////////////////////
  // Event Callback //
  ////////////////////

  onPressSubmit() {
    if (this.props.isLoading) { return; }

    const values = this.refs.form.getValue();
    if (values) {
      this.props.accessCodeActions.useCode(values.email, values.code);
    }
  }

  onPressSubscriptionInfoShow(subscriptionPlan) {
    this.setState({ isSubscriptionInfoShown: true, subscriptionPlan });
  }

  onPressSubscriptionInfoHide() {
    this.setState({ isSubscriptionInfoShown: false, subscriptionPlan: null });
  }

  async onPressSubscribe() {
    if (Platform.OS === 'ios') {
      const isMonthly = this.state.subscriptionPlan === 'monthly';
      const renewRate = isMonthly
        ? 'per month'
        : 'per year';
      const price = isMonthly
        ? planDetail.monthly.priceRaw
        : planDetail.annually.priceRaw;
      AlertLib.showPurchase(price, renewRate, this.onPressConfirm);
    }
    else if (Platform.OS === 'android') {
      this.onPressConfirm();
    }
  }

  onPressConfirm() {
    const isMonthly = this.state.subscriptionPlan === 'monthly';
    const sku = isMonthly
      ? itemSkus[0]
      : itemSkus[1];
    RNIap.requestSubscription(sku);
  }
}

AccessCodeModal.propTypes = propTypes;
const styles = StyleSheet.create({
  input: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  containerInner: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: '5%',
    marginHorizontal: '2%',
    padding: 20,
    justifyContent: 'flex-end',
  },

  // Head
  containerHead: {
    flex: 0.3,
    alignItems: 'center',
  },
  containerHeadText: {
    flex: 1,
    justifyContent: 'center',
  },
  imageHead: {
    flex: sc.isShortScreen ? 1 : 2,
    resizeMode: 'contain',
  },
  textHead: {
    ...sc.textFormTitle,
  },

  // Body
  containerBody: {
    flex: 0.7,
  },

  textError: {
    ...sc.textFormContent,
    color: '#993031',
  },
  textExplainer: {
    ...sc.textBlack,
    fontSize: sc.isShortScreen ? 10 : 12,
    paddingTop: 10,
  },
  textExplainerLink: {
    color: 'rgba(65, 105, 225, 0.9)',
    textDecorationLine: 'underline',
  },

  // Common
  textButton: {
    alignSelf: 'center',
    color: sc.colors.white,
    fontFamily: sc.fontFamily.normal,
    fontSize: sc.isShortScreen ? 10 : 12,
  },
  button: {
    height: sc.dimension.hp(7),
    backgroundColor: '#234F82',
    borderColor: '#234F82',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
  },
});

export default connect(state => ({
  visible: state.accessCode.is_modal_shown,
  isLoading: state.accessCode.is_loading_use_code,
  errorMessage: state.accessCode.error_message,
}),
  dispatch => ({
    accessCodeActions: bindActionCreators(accessCodeActions, dispatch),
  })
)(AccessCodeModal);
