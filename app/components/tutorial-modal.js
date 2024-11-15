import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ListView,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Pages } from 'react-native-pages';
import sc from '../../config/styles';
import * as StoreLib from '../libs/store-lib';
import * as routes from '../routes/routes';
import * as Strings from '../../config/strings';

const propTypes = {
};

class TutorialModal extends Component {
	constructor(props) {
		super(props);

    this.state = {
      visible: false,
    };

    this._isSchool = (this.props.accountType == 'school');

		this.onPressClose = this.onPressClose.bind(this);

    this.loadData();
	}

  async loadData() {
    this.setState({
      visible : ! await StoreLib.getIsWelcomeTutorialShown()
    });
  }

  render() {
		const styles = this.constructor.styles;
    const showCalmcierge = this.hasFeature(routes.home());
    const showSonicSpa = this.hasFeature(routes.audios());
    const showEvents = this.hasFeature(routes.events());
    const showFav = this.hasFeature(routes.chillFavorites());
    const { width, height } = Dimensions.get('window');
    const pages = [];
    pages.push({
      title   : Strings.WELCOME_TUTORIAL_HOMEFEED_TITLE,
      content : Strings.WELCOME_TUTORIAL_HOMEFEED_CONTENT,
      image   : require('../../images/tutorial/home.png'),
    });
    showCalmcierge && pages.push({
      title   : Strings.WELCOME_TUTORIAL_CALMCIERGE_TITLE,
      content : Strings.WELCOME_TUTORIAL_CALMCIERGE_CONTENT,
      image   : require('../../images/tutorial/calmcierge.png'),
    });
    showEvents && pages.push({
      title   : Strings.WELCOME_TUTORIAL_EVENTS_TITLE,
      content : Strings.WELCOME_TUTORIAL_EVENTS_CONTENT,
      image   : require('../../images/tutorial/events.png'),
    });
    showSonicSpa && pages.push({
      title   : Strings.WELCOME_TUTORIAL_SONICSPA_TITLE,
      content : Strings.WELCOME_TUTORIAL_SONICSPA_CONTENT,
      image   : require('../../images/tutorial/sonicspa.png'),
    });
    showFav && pages.push({
      title   : Strings.WELCOME_TUTORIAL_FAV_TITLE,
      content : Strings.WELCOME_TUTORIAL_FAV_CONTENT,
      image   : require('../../images/tutorial/fav.png'),
    });
    pages.push({
      title   : Strings.WELCOME_TUTORIAL_HR_TITLE,
      content : Strings.WELCOME_TUTORIAL_HR_CONTENT,
      image   : require('../../images/tutorial/hr.png'),
    });

    return (
      <Modal
        animationType={'fade'}
        onRequestClose={() => this.onPressClose()}
        visible={this.state.visible} >

        <Image
          style={[{width, height}, styles.imageBackground]}
          source={require('../../images/chrome/tutorial-background.png')} />

        { this.state.visible &&
          <View style={styles.container}>

            <Pages>
              { this.renderText(
                  Strings.WELCOME_TUTORIAL_WELCOME_TITLE,
                  this.props.welcomeContent,
              )}
              { pages.map((page, index) => this.renderTabFeature(
                  index,
                  page.title,
                  page.content,
                  page.image
                ))
              }
              { this.renderText(
                  Strings.WELCOME_TUTORIAL_GETSTARTED_TITLE,
                  this.props.getStartedContent,
              )}
            </Pages>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.buttonModalClose}
              onPress={this.onPressClose}>
              <View style={styles.containerCloseButton}>
                <Image
                  style={styles.imageClose}
                  source={require('../../images/chrome/close-white-48.png')} />
              </View>
            </TouchableOpacity>
          </View>
        }
      </Modal>
    );
  }

	renderText(title, content) {
		const styles = this.constructor.styles;
    const imgSrc = this._isSchool
      ? require('../../images/stressbusters/icon-120.png')
      : require('../../images/calmcast/icon-120.png');
		return (
      <View style={styles.containerPage}>
        <View style={styles.containerLogo} >
          <Image
            style={styles.imageLogo}
            source={imgSrc} />
        </View>
        <Text style={styles.textTitle}>{title}</Text>
        <Text style={styles.textContent}>{content}</Text>
      </View>
		);
	}

	renderTabFeature(index, title, content, image) {
		const styles = this.constructor.styles;
		return (
      <View key={index} style={styles.containerPage}>
        <Text style={styles.textTitle}>{title}</Text>
        <Image
          style={styles.imagePhone}
          source={image} />
        <Text style={styles.textContent}>{content}</Text>
      </View>
		);
	}

	onPressClose() {
    this.setState({ visible: false });
    StoreLib.setIsWelcomeTutorialShown();
  }

	///////////////
	// Functions //
	///////////////

	hasFeature(route) {
    const ret = this.props.tabs.find(tab => {
      return tab.id == route.id;
    });
    return ret !== undefined;
  }
}

TutorialModal.propTypes = propTypes;
TutorialModal.styles = StyleSheet.create({
	container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
	},
	containerPage: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    margin: 30,
    marginTop: 10,
    marginBottom: 50,
  },
	containerLogo: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    marginBottom: 50,
  },
  containerCloseButton: {
    backgroundColor: '#4B6D6F',
    borderColor: '#4B6D6F',
    borderWidth: 1,
    borderRadius: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  textTitle: {
		color: sc.colors.white,
		fontFamily: 'HelveticaNeue-Bold',
		fontSize: 35,
  },
  textContent: {
		color: sc.colors.white,
		fontFamily: 'HelveticaNeue',
		fontSize: 21,
    marginTop: '10%',
    textAlign: 'center',
  },
  imageBackground: {
    position: 'absolute',
    resizeMode: 'cover',
  },
  imagePhone: {
    height: '50%',
    marginTop: '10%',
    resizeMode: 'contain',
  },
  imageLogo: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  imageClose: {
    width: 24,
    height: 24,
    margin: 20,
  },
  buttonModalClose: {
    alignItems: 'center',
    margin: 30,
  },
});

export default connect(state => ({
		accountType			  : state.app.school.account_type,
    welcomeContent    : state.app.school.tutorial_welcome_content,
    getStartedContent : state.app.school.tutorial_getstarted_content,
		tabs  			      : state.app.school.tabs,
	}),
	dispatch => ({
	})
)(TutorialModal);
