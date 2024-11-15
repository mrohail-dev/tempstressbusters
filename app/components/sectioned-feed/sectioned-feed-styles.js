import sc from '../../../config/styles';

export default {
	container: {
		flex: 1,
	},
	sectionHeaderContainer: {
		height: 50,
		backgroundColor: 'black',
		alignItems: 'center',
		justifyContent: 'center',
	},
	sectionHeaderText: {
		...sc.textSectionHeader,
		marginLeft: 10,
	},
	cellContainer: {
		flex: 0,
	},
	separator: {
		height: 1,
		backgroundColor: 'grey',
		marginTop: 5,
		marginBottom: 5,
		marginLeft: 10,
		marginRight: 10,
	},
	separatorLast: {
		height: 0,
	},
	activityButton: {
		position: 'absolute',
		top: 12,
		right: 10,
	},
	activityButtonImage: {
		width: 24,
		height: 24,
	},
}
