import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, ImageBackground, KeyboardAvoidingView, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as routes from '../routes/routes';
import * as appActions from '../actions/app-actions';
import * as notesActions from '../actions/notes-actions';
import SlidingTabBarView from '../components/sliding-tab-bar/sliding-tab-bar';
import FeedView from '../components/feed/feed';
import sc from '../../config/styles';
import * as strings from '../../config/strings';
import * as constants from '../../config/constants';

const propTypes = {
  navigator: PropTypes.any,
};

const edittorState = {
  editId: undefined, // is set when editting
  modal: 'hidden',
  category: undefined,
  content: '',
};

class Notes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...edittorState,
      filter: this.props.filters[0],
    };

    this._feedView = null;

    this.props.notesActions.loadFeed();

    this.selectFilter = this.selectFilter.bind(this);
    this.onPressGotIt = this.onPressGotIt.bind(this);
    this.onPressAdd = this.onPressAdd.bind(this);
    this.onPressEdit = this.onPressEdit.bind(this);
    this.onPressSubmit = this.onPressSubmit.bind(this);
    this.onPressClose = this.onPressClose.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.appActions.selectScreen(routes.notes().id);
  }

  componentDidMount() {
    this.selectFilter(this.state.filter);
  }

  componentWillUnmount() {
    this.props.appActions.deselectScreen(routes.notes().id);
  }

  render() {
    const styles = this.constructor.styles;
    const { filter } = this.state;
    const { dataByFilter, filters } = this.props;
    return (
      <View style={styles.container}>
        <SlidingTabBarView
          filter={this.state.filter}
          filters={filters}
          onPressFilter={(selected) => this.selectFilter(selected)} />

        <View style={{ height: 10 }} />
        <FeedView
          ref={component => this._feedView = component}
          routeId={routes.notes().id}
          data={dataByFilter[filter]}
          onPressNoteEdit={this.onPressEdit} />

        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.buttonAdd}
            onPress={this.onPressAdd}>
            <Image
              style={styles.imageAdd}
              source={require('../../images/chrome/add-64.png')} />
          </TouchableOpacity>
        </View>

        <Modal
          visible={this.state.modal != 'hidden'}
          animationType={'slide'}
          onRequestClose={() => this.onPressClose()} >

          <ImageBackground
            source={require('../../images/chrome/notes-background.png')}
            resizeMode={'repeat'}
            style={styles.container}>

            <KeyboardAvoidingView style={styles.containerModal} behavior="padding">
              <Text style={styles.textModalHeader}>
                {this.state.editId ? 'Edit a Note' : 'Add a Note'}
              </Text>

              <View style={styles.containerModalContent}>
                {(this.state.modal == 'instruction') &&
                  <View style={{ flex: 1 }}>
                    <Text style={styles.textHeader}>The information that you enter into My Notes will only be visible to you and may be deleted if you remove the app from your device.</Text>

                    <TouchableOpacity
                      style={styles.buttonSubmit}
                      onPress={() => this.onPressGotIt()}>
                      <Text style={styles.textButtonSubmit}>Got It</Text>
                    </TouchableOpacity>
                  </View>}

                {(this.state.modal == 'picker') &&
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      style={styles.buttonType}
                      onPress={() => this.onSelectCategory(constants.NOTE_TYPES.Note)}>
                      <Text style={styles.textButtonType}>{constants.NOTE_TYPES.Note.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonType}
                      onPress={() => this.onSelectCategory(constants.NOTE_TYPES.Journal)}>
                      <Text style={styles.textButtonType}>{constants.NOTE_TYPES.Journal.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonType}
                      onPress={() => this.onSelectCategory(constants.NOTE_TYPES.Goal)}>
                      <Text style={styles.textButtonType}>{constants.NOTE_TYPES.Goal.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonType}
                      onPress={() => this.onSelectCategory(constants.NOTE_TYPES.Resource)}>
                      <Text style={styles.textButtonType}>{constants.NOTE_TYPES.Resource.name}</Text>
                    </TouchableOpacity>
                  </View>}

                {(this.state.modal == 'compose') &&
                  <View style={{ flex: 1 }}>
                    <TextInput
                      autoCorrect={true}
                      autoFocus={true}
                      multiline={true}
                      style={styles.textInput}
                      onChangeText={(content) => this.setState({ content })}
                      value={this.state.content}
                    />

                    <TouchableOpacity
                      style={styles.buttonSubmit}
                      onPress={this.onPressSubmit}>
                      <Text style={styles.textButtonSubmit}>
                        {this.state.editId ? 'Save' : 'Add'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                }

              </View>

              <TouchableOpacity
                style={styles.buttonModalClose}
                onPress={this.onPressClose}>
                <Image
                  style={styles.imageModalClose}
                  source={require('../../images/chrome/close-64.png')} />
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </ImageBackground>
        </Modal>

      </View>
    );
  }

  ///////////////
  // Functions //
  ///////////////

  selectFilter(filter) {
    // console.log(filter);
    this.setState({ filter });
    console.log(this.props.dataByFilter[filter])
    if (this.props.dataByFilter[filter] && this.props.dataByFilter[filter].length > 0) {
      this.props.notesActions.loadFeed(filter);
    }
    // this._feedView.getWrappedInstance().scrollTo({y: 0, animated:false});
  }

  onSelectCategory(noteCategory) {
    this.setState({ modal: 'compose', category: noteCategory.category });
  }

  onPressGotIt() {
    this.setState({ modal: 'picker', content: '' });
    this.props.notesActions.markInstructionShown();
  }

  onPressAdd() {
    this.props.isInstructionShown
      ? this.setState({ modal: 'picker', content: '' })
      : this.setState({ modal: 'instruction', content: '' });
  }

  onPressEdit(data) {
    this.setState({
      modal: 'compose',
      editId: data.id,
      category: data.category,
      content: data.content,
    });
  }

  onPressSubmit() {
    if (this.state.content.trim() == '') { return; }

    // edit
    if (this.state.editId) {
      this.props.notesActions.editNote({
        id: this.state.editId,
        content: this.state.content,
      });
    }
    // add
    else {
      this.props.notesActions.addNote({
        type: strings.OBJECT_TYPE_NOTE,
        id: Date.now(),
        date: Date.now(),
        content: this.state.content,
        categories: [this.state.category],
      });


    }

    this.props.notesActions.loadFeed();

    this.setState({ ...edittorState });
  }

  onPressClose() {
    this.setState({ ...edittorState });
  }
}

Notes.propTypes = propTypes;
Notes.styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerHeader: {
    flex: 0,
    marginHorizontal: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  containerButton: {
    position: 'absolute',
    bottom: 50,
    right: 10,
  },
  buttonAdd: {
    flex: 1,
    backgroundColor: sc.colors.buttonWhite,
    borderWidth: 0,
    borderRadius: 16,
    shadowColor: sc.colors.black,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  imageAdd: {
    flex: 0,
    width: 32,
    height: 32,
  },
  // Modal
  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 20 + sc.statusBarHeight,
  },
  containerModalContent: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 50,
  },
  textModalHeader: {
    ...sc.text,
    fontSize: 23,
    flex: 0,
  },
  textButtonType: {
    ...sc.text,
    fontSize: 23,
    flex: 0,
  },
  textButtonSubmit: {
    ...sc.text,
    fontSize: 23,
    flex: 0,
  },
  buttonType: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: sc.colors.white,
    padding: 10,
    paddingLeft: 30,
    margin: 10,
  },
  buttonSubmit: {
    flex: 0,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: sc.colors.white,
    padding: 10,
    margin: 20,
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
  textHeader: {
    ...sc.text,
    fontSize: 18,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  textInput: {
    ...sc.text,
    fontSize: 15,
    flex: 1,
    borderWidth: 0,
    borderColor: sc.colors.grey,
    borderRadius: 5,
  },
});

export default connect(state => ({
  dataByFilter: state.notes.dataByFilter,
  filters: state.notes.filters,
  isLoading: state.notes.is_loading,
  isInstructionShown: state.notes.is_instruction_shown,
}),
  dispatch => ({
    appActions: bindActionCreators(appActions, dispatch),
    notesActions: bindActionCreators(notesActions, dispatch),
  })
)(Notes);

