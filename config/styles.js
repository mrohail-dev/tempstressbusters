import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const dimension = {
  wp: (perc) => Math.round((perc * viewportWidth) / 100),
  hp: (perc) => Math.round((perc * viewportHeight) / 100),
}
const isShortScreen = viewportHeight < 700;
const isSmallScreen = viewportWidth < 350;

const heights = {
	statusBarHeight: 20,
	navBarHeight: 60,
	tabBarHeight: 79,
	filterBarHeight: 30,
};

const textColors = {
	textColor: 'white',
	textHighlightColor: 'rgb(0, 122, 255)',
};

const backgroundColors = {
	appBackgroundColor: 'rgba(0, 0, 0, 0.3)',
	navBarBackgroundColor: 'rgba(0, 0, 0, 0.0)',
	filterBarBackgroundColor: 'rgba(0, 0, 20, 0.5)',
	tabBarBackgroundColor: 'rgba(0, 0, 20, 0.5)',
	activityBarBackgroundColor: 'rgba(0, 0, 20, 0.6)',
	pickerBackgroundColor: 'rgba(0, 0, 0, 0.5)',
	cameraOverlayColor: 'rgba(0, 0, 0, 0.7)',
	pickerHeaderSeparatorColor: 'rgba(0, 0, 0, 0.5)',
	menuFeedSeparatorColor: 'rgba(255, 255, 255, 0.5)',
};

const buttonColors = {
	buttonHighlightColor: 'transparent',
	bookButtonColor: '#48BBEC',
	bookButtonHighlightColor: '#99d9f4',
};

const styles = {
	colorWhite: 'white',
	text: {
		color: textColors.textColor,
		fontFamily: 'HelveticaNeue',
		fontSize: 14,
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2,
		textShadowColor: '#000000',
	},
	textBold: {
		color: textColors.textColor,
		fontFamily: 'HelveticaNeue-Bold',
		fontSize: 14,
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2,
		textShadowColor: '#000000',
	},
	textSchoolPickerText: {
		color: textColors.textColor,
		fontFamily: 'HelveticaNeue',
		fontSize: 18,
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2,
		textShadowColor: '#000000',
	},
	textNavTitle: {
		color: textColors.textColor,
		fontFamily: 'HelveticaNeue',
		fontSize: 22,
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2,
		textShadowColor: '#000000',
	},
	textNavRewardPoint: {
		color: textColors.textColor,
		fontFamily: 'HelveticaNeue-Bold',
		fontSize: 20,
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2,
		textShadowColor: '#000000',
	},
	textNavTitleSubtext: {
		color: textColors.textColor,
		fontFamily: 'HelveticaNeue',
		fontSize: 8,
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2,
		textShadowColor: '#000000',
	},
	textMenuButton: {
		color: textColors.textColor,
		fontFamily: 'HelveticaNeue',
		fontSize: 26,
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2,
		textShadowColor: '#000000',
	},
	textSectionHeader: {
		color: textColors.textColor,
		fontFamily: 'HelveticaNeue-Bold',
		fontSize: 18,
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2,
		textShadowColor: '#000000',
	},
	textInfoItalic: {
		color: textColors.textColor,
		fontFamily: 'HelveticaNeue',
		fontStyle: 'italic',
		fontSize: 12,
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2,
		textShadowColor: '#000000',
	},
	textFormTitle: {
		color: 'black',
		fontFamily: 'HelveticaNeue-Bold',
		fontSize: 18,
	},
	textFormContent: {
		color: 'black',
		fontFamily: 'HelveticaNeue',
		fontSize: 14,
	},
	textBlack: {
		color: 'black',
		fontFamily: 'HelveticaNeue',
		fontSize: 14,
	},
	textBlackBold: {
		color: 'black',
		fontFamily: 'HelveticaNeue-Bold',
		fontSize: 14,
	},
	textActionBtton: {
		color: textColors.textColor,
		fontFamily: 'HelveticaNeue',
		fontSize: 18,
	},
};

export default {
  viewportWidth,
  viewportHeight,
	...heights,
	...textColors,
	...backgroundColors,
	...buttonColors,
	...styles,
  dimension   : dimension,
  isShortScreen : isShortScreen,
  isSmallScreen : isSmallScreen,
  inactive    : {
    opacity : 0.5,
  },
  fontFamily  : {
		normal: 'HelveticaNeue',
		bold  : 'HelveticaNeue-Bold',
  },
  fontSize    : {
    plain             : 15,
    library           : 15,
    phone             : 15,
    phoneContactName  : 18,
    phoneModalTitle   : 23,
  },
  colors      : {
    black           : 'rgba(0, 0, 0, 0.9)',
    blackTint       : 'rgba(0, 0, 0, 0.2)',
    white           : 'rgba(255, 255, 255, 0.9)',
    gray            : 'rgba(128, 128, 128, 0.9)',
    spinnerWhite    : 'rgba(255, 255, 255, 0.9)',
    highlightBlue   : 'rgb(0, 122, 255)',
    backgroundNavy  : 'rgba(11, 35, 88, 1.0)',
    backgroundBlack : 'rgba(0, 0, 0, 0.7)',
    backgroundGray  : 'rgba(0, 0, 20, 0.7)',
    rowTintDark     : 'rgba(0, 0, 20, 0.2)',
    buttonWhite     : 'rgba(255, 255, 255, 0.9)',
    buttonRed       : 'rgba(237, 77, 61, 0.9)',
    textBlack       : 'rgba(0, 0, 0, 0.9)',
  },
  textShadow      : {
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2,
		textShadowColor: '#000000',
  }
};
