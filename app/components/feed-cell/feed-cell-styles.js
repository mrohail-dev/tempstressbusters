import sc from '../../../config/styles';

export default {
	// common
	container: {
		flex: 1,
	},
	textContainer: {
		flex: 1,
		padding: 10,
		paddingRight: 40,
	},
	textTitle: {
		...sc.textBold,
		paddingBottom: 10,
	},
	textContent: {
		...sc.text,
	},
	// events
	eventsTextDate: {
		...sc.textInfoItalic,
	},
	eventsTextLocation: {
		...sc.textInfoItalic,
		marginBottom: 10,
	},
	// callback
  callbackButton: {
    height: 48,
    backgroundColor: sc.bookButtonColor,
    borderColor: sc.bookButtonColor,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
		marginTop: 10,
  },
	callbackButtontext: {
		...sc.textBold,
    alignSelf: 'center',
	},
	// help
	helpContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	helpTextContainer: {
		flex: 1,
		padding: 10,
	},
	helpControlImage: {
		width: 36,
		height: 36,
		marginRight: 20,
		marginTop: 20,
	},
	// reminder
	reminderContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	reminderTextContainer: {
		flex: 1,
		padding: 10,
	},
	reminderTextTitle: {
		...sc.text,
		fontSize: 18,
	},
	reminderControlImage: {
		width: 20,
		height: 20,
		marginRight: 20,
		marginTop: 15,
	},
	// reward
	rewardContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	rewardTextContainer: {
		flex: 1,
		padding: 10,
	},
	rewardTextPoint: {
		...sc.textBold,
		flex: 0,
		marginRight: 10,
		marginTop: 10,
	},
	// about
	aboutSchoolContent: {
		...sc.text,
		marginTop: 30,
	},
}
