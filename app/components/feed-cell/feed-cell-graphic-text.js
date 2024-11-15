import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Image,
  Text,
	StyleSheet,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import sc from '../../../config/styles';
import * as dateLib from '../../libs/date-lib';

const propTypes = {
	data			: PropTypes.any,
};

class FeedCellGraphicTextView extends Component {
	constructor(props) {
		super(props);

    this._isSchool = (this.props.accountType == 'school');
	}

	render() {
		const styles = this.constructor.styles;
		const { data } = this.props;
		const dateStr = dateLib.formatRelativeDate(data.created_at);
    const logoSource = (data.template_icon == 'brand')
      ? ( this._isSchool
          ? require('../../../images/stressbusters/icon-120.png')
          : require('../../../images/calmcast/icon-120.png')
        )
      : {uri:this.props.logoImageLink};

		return (
			<View style={styles.container}>
        <View style={styles.containerBackground}>
          <Image
            style={styles.image}
            resizeMode={'stretch'}
            source={require('../../../images/chrome/message-backgroud.png')} />
        </View>
				<View style={styles.containerContent}>
          <View style={styles.containerContentTemplate}>
            <Image
              style={{width:50, height:50, borderRadius:10}}
              source={logoSource} />
            <Text style={styles.textTemplate}>{data.template}</Text>
          </View>
          <View style={styles.separator} />
          <Text style={styles.textTitle}>{data.title}</Text>
          <Text style={styles.textContent}>{data.content}</Text>
          <Text style={styles.textDate}>{dateStr}</Text>
				</View>
			</View>
		);
	}

}

FeedCellGraphicTextView.propTypes = propTypes;
FeedCellGraphicTextView.styles = StyleSheet.create({
	container: {
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: sc.colors.backgroundGray,
    borderRadius: 30,
    overflow: 'hidden',
  },
	containerBackground: {
		position: 'absolute',
		top: 0,
		left: 10,
		bottom: 0,
		right: 10,
	},
	containerContent: {
		flex:1,
    marginVertical:20,
    marginHorizontal:30,
	},
	containerContentTemplate: {
		flex:1,
    flexDirection:'row',
    alignItems: 'flex-end',
	},
  image: {
    flex:1,
    width:null,
    height:null,
    borderWidth: 3,
    borderRadius: 8,
    borderColor: '#909090',
  },
	separator: {
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'black',
    marginVertical: 15,
  },
	textTemplate: {
		color: 'black',
		fontFamily: 'HelveticaNeue',
		fontSize: 38,
    marginLeft: 8,
	},
	textTitle: {
		color: 'black',
		fontFamily: 'HelveticaNeue-Bold',
		fontStyle: 'italic',
		fontSize: 28,
    marginBottom: 15,
	},
	textContent: {
		color: 'black',
		fontFamily: 'HelveticaNeue',
		fontSize: 20,
    marginBottom: 15,
	},
	textDate: {
		color: 'black',
		fontFamily: 'HelveticaNeue',
		fontSize: 20,
    alignSelf: 'flex-end',
	},
});

export default connect(state => ({
		accountType			: state.app.school.account_type,
		logoImageLink 	: state.app.school.logo_image_link,
	}),
	dispatch => ({
	})
)(FeedCellGraphicTextView);
