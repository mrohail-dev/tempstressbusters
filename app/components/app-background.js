import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, InteractionManager, Platform, StyleSheet, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sc from '../../config/styles';
import * as routes from '../routes/routes';

const propTypes = {
  transitionOpacity    : PropTypes.object.isRequired,
};

class AppBackground extends Component {
  constructor(props) {
    super(props);

    this.getImageUrl = this.getImageUrl.bind(this);
  }

  render() {
    const { transitionOpacity, selectedTab, selectedScreen, previousTab } = this.props;
    const styles = AppBackground.styles;
    const animatedStyles = [ styles.container, {opacity: transitionOpacity} ];

    // iOS
	  if (Platform.OS === 'ios') {

      return (
        <View style={styles.container}>
          {this.props.tabs.map((tab, index) => {
            const isSelected = (tab.id == selectedTab);
            const imageSource = this.getImageUrl(tab.id, isSelected, selectedScreen);
            return <View
                key={index}
                style={[styles.container, {zIndex: isSelected ? 2 : 1}]} >

                <Image
                  style={styles.backgroundImage}
                  source={imageSource.source} />

                <Animated.View style={animatedStyles}>
                  <Image
                    style={styles.backgroundImage}
                    blurRadius={imageSource.blurRadius}
                    source={imageSource.blurSource} />
                </Animated.View>

              </View>
          })}

          <View style={styles.darkOverlay} />
        </View>
      );

    }

    // Android
	  else {
      const imageSource = this.getImageUrl(selectedTab, true, selectedScreen);
      return (
        <View style={styles.container}>
          <Image
            style={styles.backgroundImage}
            source={imageSource.source} />

          <Animated.View style={animatedStyles}>
            <Image
              style={styles.backgroundImage}
              blurRadius={imageSource.blurRadius}
              source={imageSource.blurSource} />
          </Animated.View>

          <View style={styles.darkOverlay} />
        </View>
      );

    }
  }

  getImageUrl(tab, isTabSelected, selectedScreen) {
    // Case 1: tab is selected, and selectedScreen is notes
    // ie. notes is the selected screen, need to override the background image
    if (isTabSelected && selectedScreen === routes.notes().id) {
      return {
        source: require('../../images/chrome/notes-background.png'),
        blurSource: require('../../images/chrome/notes-background.png'),
        blurRadius: 0
      };
    }
    
    let uri;
    switch (tab) {
      case routes.home().id:
        uri = this.props.homeImageUrl;
        break;
      case routes.events().id:
        uri = this.props.eventsImageUrl;
        break;
      case routes.chill().id:
        // Note: currently business don't have chill tab image url.
        // After all businesses have chill image url, remove this hack.
        uri = (this.props.accountType == 'business')
          ? this.props.videosTabImageUrl
          : this.props.chillImageUrl;
        break;
      case routes.help().id:
        uri = this.props.helpImageUrl;
        break;
      case routes.audios().id:
        // Note: currently schools don't have audio tab image url.
        // After all schools have audio image url, remove this hack.
        uri = (this.props.accountType == 'school')
          ? this.props.meImageUrl
          : this.props.audiosTabImageUrl;
        break;
      case routes.chillVideos().id:
        uri = this.props.videosTabImageUrl;
        break;
      case routes.chillFavorites().id:
        uri = this.props.favsTabImageUrl;
        break;
      default:
        uri = this.props.homeImageUrl;
        break;
    }
    return {
      source: { uri },
      blurSource: require('../../images/chrome/app-background.png'),
      blurRadius: 5,
    };
  }
}

AppBackground.propTypes = propTypes;
AppBackground.styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  darkOverlay: {
    backgroundColor: sc.appBackgroundColor,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default connect(state => ({
    previousTab        : state.app.previous_tab,
    selectedTab        : state.app.selected_tab,
    selectedScreen     : state.app.selected_screen_route_id,
		tabs  			       : state.app.school.tabs,
    accountType        : state.app.school.account_type,
    homeImageUrl       : state.app.school.home_image_link,
    eventsImageUrl     : state.app.school.events_image_link,
    chillImageUrl      : state.app.school.resources_image_link,
    meImageUrl         : state.app.school.me_image_link,
    helpImageUrl       : state.app.school.help_image_link,
    audiosTabImageUrl  : state.app.school.audios_tab_image_link,
    videosTabImageUrl  : state.app.school.videos_tab_image_link,
    favsTabImageUrl    : state.app.school.favs_tab_image_link,
  }),
  dispatch => ({
  })
)(AppBackground);
