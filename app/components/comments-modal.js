import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as rewardActions from '../actions/reward-actions';
import AnalyticsLib from '../libs/analytics-lib';
import * as apiClient from '../libs/api-client';
import * as StoreLib from '../libs/store-lib';
import * as routes from '../routes/routes';
import FeedView from './feed/feed';
import sc from '../../config/styles';
import * as Constants from '../../config/constants';
import * as Strings from '../../config/strings';

const propTypes = {
	object	      : PropTypes.object,
	onPressClose	: PropTypes.func,
};

class CommentsModal extends Component {
	constructor(props) {
		super(props);

    this.state = {
      mode: 'feed',
      screenName: '',
      content: '',
      parent: undefined,
    };

		this._feedView = null;

		this.onPressAddComment = this.onPressAddComment.bind(this);
		this.onPressSubmitScreenName = this.onPressSubmitScreenName.bind(this);
		this.onPressSubmitComment = this.onPressSubmitComment.bind(this);
		this.onPressCommentReply = this.onPressCommentReply.bind(this);
		this.onPressClose = this.onPressClose.bind(this);

    this.loadScreenName();
	}

  async loadScreenName() {
    this.setState({
      screenName : await StoreLib.getScreenName() || ''
    });
  }

  render() {
    const { object } = this.props;
		const styles = this.constructor.styles;
    // flatten comments
    const comments = [];
    object.comments.forEach(parent => {
      comments.push(parent);
      comments.push(...parent.comments);
    });
    // render
    return (
      <Modal
        visible={ !! object}
        animationType={'slide'}
        onRequestClose={() => this.onPressClose()} >

        <KeyboardAvoidingView style={styles.container} behavior="padding">

          <View style={styles.containerModalContent}>
            { (this.state.mode === 'feed') &&
                <View style={{flex: 1}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textTitle}>{
                      object.title && object.title.length > 0
                        ? object.title
                        : 'Comments'
                    }</Text>

                    <FeedView
                      ref={component => this._feedView = component}
                      routeId={routes.comments().id}
                      data={comments}
                      onPressCommentReply={parent => this.onPressCommentReply(parent)} />

                  </View>
                  <View style={{flex: 0}}>
                    <TouchableOpacity
                      style={styles.buttonSubmit}
                      onPress={() => this.onPressAddComment()}>
                      <Text style={styles.textButtonSubmit}>Add a comment</Text>
                    </TouchableOpacity>
                  </View>
                </View>}

            { (this.state.mode === 'create_screen_name') &&
                <View style={{flex: 1}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textTitle}>Create a Screen Name</Text>
                    <Text style={styles.textContent}>Create a screen name to appear with this and future comments. You can change your screen name by reinstalling the app (other content such as your Journal entries and Health Reward points may be deleted during reinstallation).</Text>

                    <TextInput
                      autoCapitalize={'none'}
                      autoCorrect={false}
                      autoFocus={true}
                      maxLength={Constants.SCREEN_NAME_MAX_LENGTH}
                      multiline={false}
                      style={styles.textInputScreenName}
                      placeholder={`Enter a screen name`}
                      onChangeText={(screenName) => this.setState({screenName})}
                      value={this.state.screenName}
                    />
                  </View>

                  <View style={{flex: 0}}>
                    <TouchableOpacity
                      style={styles.buttonSubmit}
                      onPress={() => this.onPressSubmitScreenName()}>
                      <Text style={styles.textButtonSubmit}>Create screen name</Text>
                    </TouchableOpacity>
                  </View>
                </View>}

            { (this.state.mode === 'create_comment') &&
                <View style={{flex: 1}}>
                  <View style={{flex: 0}}>
                    <Text style={styles.textTitle}>{
                      object.title && object.title.length > 0
                        ? object.title
                        : 'Comments'
                    }</Text>

                  </View>

                  <TextInput
                    autoCorrect={true}
                    autoFocus={true}
                    multiline={true}
                    style={styles.textInputComment}
                    onChangeText={(content) => this.setState({content})}
                    value={this.state.content}
                  />

                  <View style={{flex: 0}}>
                    <TouchableOpacity
                      style={styles.buttonSubmit}
                      onPress={this.onPressSubmitComment}>
                      <Text style={styles.textButtonSubmit}>Submit comment</Text>
                    </TouchableOpacity>
                  </View>
                </View>}
          </View>

          <TouchableOpacity
            style={styles.buttonModalClose}
            onPress={this.onPressClose}>
            <Image
              style={styles.imageModalClose}
              source={require('../../images/chrome/close-64.png')} />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

	///////////////
	// Functions //
	///////////////

	onPressAddComment() {
    this.state.screenName || this.state.screenName !== ''
      ? this.setState({ mode:'create_comment', content:'', parent:undefined })
      : this.setState({ mode:'create_screen_name', content:'', parent:undefined });
	}

	async onPressSubmitScreenName() {
    const { screenName } = this.state;

    if (screenName.trim() === '') { return; }

    await StoreLib.setScreenName(screenName);

    this.setState({ mode:'create_comment' });
	}

	async onPressSubmitComment() {
    const { screenName, content, parent } = this.state;
    const { object, schoolId, anonymousId } = this.props;

    if (content.trim() === '') { return; }

    const path = 'create_comment';
    const rawComment = {
      anonymous_id  : anonymousId,
      school        : schoolId,
      ancestor_type : object.type,
      ancestor_id   : object.id,
      content       : content,
      screen_name   : screenName,
      parent_id     : parent ? parent.id : undefined,
    };
		const response = await apiClient.post(path, {
      data: JSON.stringify(rawComment)
    });

    AnalyticsLib.trackObject('Comment', rawComment);
    await this.props.rewardActions.earnViaComment();

    if (parent) {
      parent.comments.push(response.comment);
      object.comment_count ++;
    }
    else {
      object.comments.push(response.comment);
      object.comment_count ++;
    }

    this.setState({ mode: 'feed' });
	}

	onPressCommentReply(parent) {
    this.state.screenName || this.state.screenName !== ''
      ? this.setState({ mode:'create_comment', content:'', parent })
      : this.setState({ mode:'create_screen_name', content:'', parent });
  }

	onPressClose() {
    if (this.state.mode === 'feed') {
      this.props.onPressClose();
    }
    else {
      this.setState({ mode: 'feed' });
    }
	}
}

CommentsModal.propTypes = propTypes;
CommentsModal.styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: sc.colors.backgroundNavy,
    padding: 20,
    paddingTop: 20 + sc.statusBarHeight,
  },
  containerModalContent: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
	textButtonSubmit: {
    flex: 0,
		...sc.text,
		fontSize: 23,
	},
	buttonSubmit: {
    flex: 0,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: sc.colors.white,
    padding: 10,
    margin: 20,
    marginBottom: 40,
    alignItems: 'center',
	},
	buttonModalClose: {
    position: 'absolute',
    top: 30,
    right: 20,
    paddingLeft: 20,
	},
	imageModalClose: {
    flex: 0,
		width: 32,
    height: 32,
	},
	textTitle: {
		...sc.textBold,
		fontSize: 20,
    marginHorizontal: 10,
    marginBottom: 30,
    alignSelf: 'center',
	},
	textContent: {
		...sc.text,
		fontSize: 18,
    marginHorizontal: 10,
    marginBottom: 30,
    alignSelf: 'center',
	},
	textInputScreenName: {
    flex: 0,
    backgroundColor: sc.colors.white,
    borderWidth: 0,
    marginHorizontal: 10,
    padding: 10,
		color: sc.colors.black,
		fontFamily: sc.fontFamily.normal,
    fontSize: 15,
  },
	textInputComment: {
    flex: 1,
    ...sc.text,
    fontSize: 15,
    borderWidth: 0,
    borderColor: sc.colors.grey,
    borderRadius: 5,
  },
});

export default connect(state => ({
		schoolId			  : state.app.school.id,
		anonymousId			: state.app.anonymous_id,
	}),
	dispatch => ({
		rewardActions	  : bindActionCreators(rewardActions, dispatch),
	})
)(CommentsModal);
