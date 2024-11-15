import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';
import sc from '../../../config/styles';
import base from '../../base-styles';


const propTypes = {
	filter				: PropTypes.string,
	filters				: PropTypes.array.isRequired,
	onPressFilter	: PropTypes.func.isRequired,
};

export default class SlidingTabBar extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		const styles = this.constructor.styles;
		const onPress = this.props.onPressFilter;
		const selectedFilter = this.props.filter;
    // Note: current longest filiter is reminder's 'Affirmations' 12 characters
    const isShortFilterTags = this.props.filters.every(filter => filter.length < 15);
		const contentContainerStyle = (this.props.filters.length <= 5 && isShortFilterTags)
			? styles.containerContentFitToWidth
			: styles.containerContentOverflow;

		return (
      <View style={styles.container}>
        <ScrollView
          horizontal={true}
          scrollsToTop={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={contentContainerStyle}>

          {this.props.filters.map(function(filter, i) {
            const textStyle = (filter == selectedFilter)
              ? styles.buttonTextHighlight
              : styles.buttonText ;

            return (
              <TouchableHighlight
                key={filter}
                style={styles.button}
                onPress={() => onPress(filter)}
                underlayColor={sc.buttonHighlightColor}>
                  <Text style={textStyle}>{filter}</Text>
              </TouchableHighlight>
            );
          })}

        </ScrollView>
      </View>
		);
	}


	///////////////////////
	// Delegate Callback //
	///////////////////////

	onAuthModalCancel() {
		this.props.onFormAuthDismiss();
	}

	////////////////////
	// Event Callback //
	////////////////////

	///////////////
	// Functions //
	///////////////

	handleSubmitForm() {
	}

}

SlidingTabBar.propTypes = propTypes;
SlidingTabBar.styles = StyleSheet.create({
	container: {
		height: sc.filterBarHeight,
		flex: 0,
		backgroundColor: sc.filterBarBackgroundColor,
	},
	containerContentOverflow: {
		alignSelf: 'center',
	},
	containerContentFitToWidth: {
		flex: 1,
		alignSelf: 'center',
		justifyContent: 'space-around',
	},
	button: {
		marginLeft: 10,
		marginRight: 10,
	},
	buttonText: {
		...base.text,
		marginRight: 10,
	},
	buttonTextHighlight: {
		...base.text,
		color: sc.textHighlightColor,
		marginRight: 10,
	},
});
