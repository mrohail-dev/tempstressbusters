import { Platform } from 'react-native';
import sc from '../../../config/styles';

export default {
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: sc.appBackgroundColor,
	},
	inner: {
		flex: 1,
		backgroundColor: 'white',
    borderRadius: 8,
		marginTop: 50,
		marginLeft: 20,
		marginRight: 20,
		padding: 20,
	},
  title: {
		...sc.textFormTitle,
    alignSelf: 'center',
		marginBottom: 20,
  },
  buttonText: {
		...sc.textActionBtton,
    alignSelf: 'center',
  },
  button: {
    height: 48,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
		marginTop: 10,
  },
	icon: {
		width: 32,
		height: 32,
	},
  iconButton: {
		position: 'absolute',
		// note: Android does not support -ve absolute position
		top: (Platform.OS === 'ios') ? -12 : 0,
		right: (Platform.OS === 'ios') ? -12 : 0,
  },
}
