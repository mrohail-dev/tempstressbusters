import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Contacts from 'react-native-contacts'; 
import * as routes from '../routes/routes';
import * as phoneActions from '../actions/phone-actions';
import FeedView from '../components/feed/feed';
import sc from '../../config/styles';
import * as strings from '../../config/strings';

const propTypes = {
	navigator		        : PropTypes.any,
};

class Phone extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      modalVisible: false,
      contacts    : undefined,
    };

		this.props.phoneActions.loadFeed();

		this.onPressAdd = this.onPressAdd.bind(this);
		this.onPressAddContact = this.onPressAddContact.bind(this);
		this.onPressClose = this.onPressClose.bind(this);
  }

  render() {
		const styles = this.constructor.styles;
		const { data } = this.props;
    return (
			<View style={styles.container}>
				<View style={styles.containerHeader}>
          <Text style={styles.textHeader}>Create your go-to crew of friends, relatives, colleagues and others who will support you when you feel stressed, anxious, upset or overwhelmed. Swipe left to remove contacts which will only appear on your device.</Text>
          <View style={styles.containerHeaderButton}>
            <TouchableOpacity
              style={styles.buttonHeader}
              onPress={this.onPressAdd}>
              <Text style={styles.textButton}>Add a Friend</Text>
            </TouchableOpacity>
          </View>
        </View>
				<FeedView
          routeId={routes.phone().id}
					data={data} />

        <Modal
          visible={this.state.modalVisible}
          animationType={'slide'}
          onRequestClose={() => this.onPressClose()} >

          <View style={styles.containerModal}>
            <Text style={styles.textModalHeader}>Add a Friend</Text>

            <View style={styles.containerModalContent}>
              { this.state.contacts &&
                <FeedView
                  routeId={routes.phone().id}
                  data={this.state.contacts}
                  onPressShortcut={(contact) => this.onPressAddContact(contact)}/> }

              { ! this.state.contacts &&
                <ActivityIndicator
                   size="large"
                   color={sc.colors.spinnerWhite}
                /> }
            </View>

            <TouchableOpacity
              style={styles.buttonModalClose}
              onPress={this.onPressClose}>
              <Image
                style={styles.imageModalClose}
                source={require('../../images/chrome/close-64.png')} />
            </TouchableOpacity>
          </View>
        </Modal>

			</View>
    );
  }

	///////////////
	// Functions //
	///////////////

	onPressAdd() {
    if ( ! this.state.contacts) {
      // Contacts.getAll( (err, contacts) => {
        const contacts = (this.state.contacts || [])
          .filter(contact => (contact.phoneNumbers.length > 0))
          .map(contact => ({
            type          : strings.OBJECT_TYPE_PHONE_CONTACT,
            recordId      : contact.recordID,
            firstName     : contact.givenName,
            lastName      : contact.familyName,
            label         : contact.phoneNumbers[0].label,
            number        : contact.phoneNumbers[0].number,
            hasThumbnail  : contact.hasThumbnail,
            thumbnailPath : contact.thumbnailPath,
          }))
          .sort((a, b) => {
            var nameA = a.firstName.toUpperCase();
            var nameB = b.firstName.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
        this.setState({ contacts: contacts });
      // })
    }
    this.setState({ modalVisible: true });
	}

	onPressAddContact(contact) {
    contact.type = strings.OBJECT_TYPE_PHONE_FRIEND,
    this.setState({ modalVisible: false });
		this.props.phoneActions.addFriend(contact);
  }

	onPressClose() {
    this.setState({ modalVisible: false });
  }
}

Phone.propTypes = propTypes;
Phone.styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	containerHeader: {
		flex: 0,
    marginHorizontal: 10,
    marginVertical: 10,
    alignItems: 'center',
	},
	containerHeaderButton: {
    flexDirection:'row',
		marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 50,
  },
	textHeader: {
		...sc.text,
		fontSize: sc.fontSize.phone,
	},
	textButton: {
		color: sc.colors.textBlack,
    fontFamily: sc.fontFamily.bold,
		fontSize: 18,
    marginHorizontal: 10,
    marginVertical: 10,
	},
	buttonHeader: {
    flex: 1,
    backgroundColor: sc.colors.buttonWhite,
    borderWidth: 0,
    borderRadius: 16,
    shadowColor: sc.colors.black,
    shadowRadius: 5,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
	},
  // Modal
  containerModal: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
	textModalHeader: {
		...sc.text,
		fontSize: sc.fontSize.phoneModalTitle,
    flex: 0,
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
});

export default connect(state => ({
		accountType			        : state.app.school.account_type,
		data				            : state.phone.data,
		isLoading		            : state.phone.is_loading,
	}),
	dispatch => ({
		phoneActions            : bindActionCreators(phoneActions, dispatch),
	})
)(Phone);

