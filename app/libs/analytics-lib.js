import RNAmplitude from 'react-native-amplitude-analytics';
// import Analytics from 'react-native-analytics'
import Mixpanel from 'react-native-mixpanel';
import * as constants from '../../config/constants';

let superProperties = {};
let amplitude;

export default {

  setup: function () {
    amplitude = new RNAmplitude(constants.AMPLITUDE_API_KEY);
  //  Analytics.setup(constants.SEGMENT_API_KEY);
    Mixpanel.sharedInstanceWithToken(constants.MIXPANEL_TOKEN);
  },

  identify: function (traits) {
    amplitude.setUserProperties(traits);
  //  Analytics.identify(null, traits);
    Mixpanel.registerSuperProperties(traits);
  },

  registerSuperProperties: function (props) {
    superProperties = props;
  },

  track: function (event, props = {}) {
    props = {...props, ...superProperties};
    amplitude.logEvent(event, props);
  //  Analytics.track(event, props);
    Mixpanel.trackWithProperties(event, props);
  },

  trackObject: function (event, object, props = {}) {
    props = {...props, ...superProperties};
    amplitude.logEvent(event, {
      ...props,
      object_id   : object.id,
      object_type : object.type,
      object_title: object.analytical_title || object.title,
    });
  //  Analytics.track(event, {
  //    ...props,
  //    object_id   : object.id,
  //    object_type : object.type,
  //    object_title: object.analytical_title || object.title,
  //  });
    Mixpanel.trackWithProperties(event, {
      ...props,
      object      : object.id,
      object_id   : object.id,
      object_type : object.type,
      object_title: object.analytical_title || object.title,
    });
  },
}
