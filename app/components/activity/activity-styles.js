import sc from '../../../config/styles';

export default {
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	buttonsContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
    alignItems: 'center',
		paddingBottom: 20,
	},
	backgroundButton: {
		flex:1,
	},
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: 'transparent',
	},
	dialog: {
		width: 88,
		backgroundColor: sc.activityBarBackgroundColor,
		borderRadius: 5,
		paddingTop: 20,
	},
}
