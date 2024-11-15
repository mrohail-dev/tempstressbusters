import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Pages } from 'react-native-pages';
import * as AlertLib from '../libs/alert-lib'
import sc from '../../config/styles';
import PickerModal from './picker-modal'
import * as rewardActions from '../actions/reward-actions'
import * as apiClient from '../libs/api-client'

const propTypes = {
};

class ChillRewardsGive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      isDonating: false,
    };
  }

  ////////////////////
  // Event Callback //
  ////////////////////

  onScrollEnd = currentPage => {
    this.setState({ currentPage });
  }

  handleGiveStart() {
    this.setState({ isDonating: true });
  }

  handleGiveSubmit(item) {
    const point = item.value;
    const donee = this.props.donees[this.state.currentPage];

    AlertLib.showGiveRewardPointsConfirm(donee.title, item.label, () => {
      this.handleGiveConfirm(item);
    });
  }

  async handleGiveConfirm(item) {
    const point = item.value;
    const donee = this.props.donees[this.state.currentPage];

    // update donee's total donated points
    donee.points_donated += point;

    // update db
    await apiClient.post('donate_points', {
      data: JSON.stringify({
        id: donee.id,
        points: point,
      })
    });

    // update user's point
    this.props.rewardActions.give(donee, point);
    this.setState({ isDonating: false });
  }

  handleGiveCancel() {
    this.setState({ isDonating: false });
  }

  render() {
    const styles = this.constructor.styles;
    const points = this.props.points;
    const options = [];
    for (let i = 100; i <= 1000; i += 100) {
      options.push({ label: i.toString(), value: i, enabled: points >= i });
    }

    return (
      <View style={styles.container}>
        <Text style={styles.textInstruction}>
          Select an organization, tap give, and choose the amount of your Health Rewards you’d like to donate to them. For every 100 Health Rewards donated, we’ll give an app to that organization to provide those it supports.
        </Text>

        <Pages
          onScrollEnd={this.onScrollEnd}>
          {this.props.donees.map((donee, index) => this.renderDonee(donee, index))}
        </Pages>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={points < 100}
          style={points < 100 ? styles.buttonGiveDisabled : styles.buttonGive}
          onPress={() => this.handleGiveStart()}>
          <Text style={styles.textButton}>Give</Text>
        </TouchableOpacity>

        {this.state.isDonating &&
          <PickerModal
            options={options}
            onPressItem={(item) => this.handleGiveSubmit(item)}
            onPressCancel={() => this.handleGiveCancel()} />
        }
      </View>
    );
  }

  renderDonee(donee, index) {
    const styles = this.constructor.styles;
    const totalDonatedPoints = donee.points_donated;
    const userDonatedPoints = this.props.donatedPoints[donee.id] || 0;
    return (
      <View key={index} style={styles.containerPage}>
        <View style={styles.containerPageInfoSection}>
          <Image
            style={styles.imageDonee}
            source={{ uri: donee.image_link }} />
          <Text style={styles.textTitle}>{donee.title}</Text>
          <Text style={styles.textContent}>{donee.content}</Text>
        </View>
        <View style={styles.containerPagePointsSection}>
          <View style={styles.containerPagePoints}>
            <Text style={styles.textPoint}>{userDonatedPoints}</Text>
            <Text style={styles.textPointCaption}>You've given</Text>
          </View>
          <View style={styles.containerPagePoints}>
            <Text style={styles.textPoint}>{totalDonatedPoints}</Text>
            <Text style={styles.textPointCaption}>Total given</Text>
          </View>
        </View>
      </View>
    );
  }

}

ChillRewardsGive.propTypes = propTypes;
ChillRewardsGive.styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginBottom: 0,
  },
  containerPage: {
    flex: 1,
    backgroundColor: sc.colors.white,
    marginTop: 20,
    marginBottom: 40,
    marginHorizontal: sc.dimension.wp(5),
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: sc.colors.black,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
  },
  containerPageInfoSection: {
    flex: 1,
    alignItems: 'center',
    marginTop: 5,
  },
  containerPagePointsSection: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  containerPagePoints: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageDonee: {
    width: 96,
    height: 96,
    marginVertical: 5,
  },
  textInstruction: {
    ...sc.text,
    fontSize: 14,
    marginVertical: 10,
    alignSelf: 'center',
  },
  textTitle: {
    ...sc.textBlackBold,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  textContent: {
    ...sc.textBlack,
    fontSize: 14,
  },
  textPoint: {
    ...sc.textBlackBold,
    fontSize: 28,
  },
  textPointCaption: {
    ...sc.textBlackBold,
    fontSize: 12,
  },
  textButton: {
    color: sc.colors.textBlack,
    fontFamily: sc.fontFamily.bold,
    fontSize: 18,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  buttonGive: {
    flex: 0,
    backgroundColor: sc.colors.buttonWhite,
    borderWidth: 0,
    borderRadius: 16,
    shadowColor: sc.colors.black,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    marginHorizontal: sc.dimension.wp(10),
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonGiveDisabled: {
    flex: 0,
    backgroundColor: sc.colors.gray,
    borderWidth: 0,
    borderRadius: 16,
    shadowColor: sc.colors.black,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    marginHorizontal: sc.dimension.wp(10),
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
});

export default connect(state => ({
  donees: state.app.school.reward_donees,
  points: state.rewards.points,
  donatedPoints: state.rewards.donated_points,
}),
  dispatch => ({
    rewardActions: bindActionCreators(rewardActions, dispatch),
  })
)(ChillRewardsGive);
