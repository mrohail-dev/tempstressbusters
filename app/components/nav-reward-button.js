import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import sc from '../../config/styles';
import { useNavigation } from '@react-navigation/native';
import { BADGES, CHILL_HEALTH_REWARDS } from '../routes/route-types';


const NavRewardButton = () => {
  const healthReward = useSelector(state=> state.rewards.points)
  const navigation = useNavigation()
  const onRewardsClick = () => {
    // dispatch(chillHealthRewards.select())
    navigation.navigate('Calmcierge', { screen: CHILL_HEALTH_REWARDS });
  };

  const onBadgeClick = () => {
    // appActions.jumpToRoute(routes.chill(), routes.badges());
    // navigation.navigate(BADGES)
  };

  const getBadgeIcon = (healthReward) => {
    if (healthReward < 1000) {
      return;
    } else if (healthReward < 2500) {
      return require('../../images/chrome/badges/white-palm-tree-48.png');
    } else if (healthReward < 5000) {
      return require('../../images/chrome/badges/blue-palm-tree-48.png');
    } else if (healthReward < 10000) {
      return require('../../images/chrome/badges/silver-palm-tree-48.png');
    } else if (healthReward < 25000) {
      return require('../../images/chrome/badges/gold-palm-tree-48.png');
    } else if (healthReward < 50000) {
      return require('../../images/chrome/badges/navy-palm-tree-48.png');
    }
    return require('../../images/chrome/badges/purple-palm-tree-48.png');
  };

  const formatReward = (num) => {
    if (num < 1000) {
      return num;
    }

    const kPart = Math.floor(num / 1000).toString();
    const dPart = '000' + num % 1000;
    return kPart + ',' + dPart.substr(dPart.length - 3);
  };

  const size = healthReward >= 10000 ? 16 : 22;

  return (
    <View style={styles.container}>
      {healthReward >= 1000 && (
        <TouchableOpacity style={styles.button} onPress={onBadgeClick}>
          <View style={styles.containerBadge}>
            <Image style={styles.imageBadge} source={getBadgeIcon(healthReward)} />
          </View>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.button} onPress={onRewardsClick}>
        <View style={styles.containerPoints}>
          <Text style={[styles.healthScore, { fontSize: size }]}>{formatReward(healthReward)}</Text>
          <Text style={styles.healthLabel}>Health Rewards</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: sc.colors.backgroundGray,
    borderRadius: 10,
		// note: reward point # is bottom clipped on Android if set to 3
    marginRight: sc.isSmallScreen ? 6 : 10,
    padding: 4,
    paddingLeft: 2,
    // marginTop:10
  },
  containerBadge: {
    flex: 0,
    paddingRight: 5,
  },
  containerPoints: {},
  button: {
    flex: 0,
  },
  healthScore: {
    ...sc.textNavRewardPoint,
    // flex: 1,
    alignSelf: 'flex-end',
    textAlignVertical: 'top',
    paddingTop: Platform.OS === 'ios' ? -2 : 0,
  },
  healthLabel: {
    ...sc.textNavTitleSubtext,
    flex: 0,
    // alignSelf: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 2 : 0,
  },
  imageBadge: {
    width: sc.isSmallScreen ? 18 : 24,
    height: sc.isSmallScreen ? 18 : 24,
  },
});


export default NavRewardButton;
