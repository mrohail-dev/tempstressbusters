import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NavRewardButton from '../components/nav-reward-button';
import NavLogoButton from '../components/nav-logo-button';
import sc from '../../config/styles';
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {CHILL_ABOUT} from '../routes/route-types';

const tabRoutes = [
  'HOME',
  'Events',
  'CHILL',
  'Sonic Spa',
  'Favorites',
  'Reminders',
  'About',
];

const NavBar = ({logoUrl, navtitle, titleButton, onPress}) => {
  const navigation = useNavigation();
  const {tabs} = useSelector(state => state.app.school);

  const route = useRoute();
  let title;
  if (navtitle) {
    title = navtitle;
  } else {
    if (route.params) {
      const tabTitle = (route.params?.tabs || []).find(
        i => i.id === route.name,
      );
      const screenTitle = (route.params?.routes || []).find(
        i => i.id === route.name,
      );
      title = tabTitle ? tabTitle.title : screenTitle.title;
    } else if (route.name) {
      title = route.name;
    } else {
      title = 'Hello';
    }
  }

  const goBack = route => {
    if (route === 'CHILL_HEALTH_REWARDS') {
      navigation.navigate('CHILL');
    } else if (tabRoutes.includes(route)) {
      if (tabs.find(i => i.title === 'Hello')) {
        navigation.navigate('Hello', {screen: 'About'});
      } else {
        navigation.navigate('Home', {screen: 'About'});
      }
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.bar}>
      <TouchableOpacity
        // style={styles.buttonLeft}
        onPress={() => goBack(route.name)}>
        {tabRoutes.includes(route.name) ? (
          // <NavLogoButton logoUrl={logoUrl} />
          <Image source={{uri: logoUrl}} style={styles.logo} />
        ) : (
          <Image source={require('../../images/chrome/arrow-left-white.png')} />
        )}
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {/* {titleButton} */}
      </View>
      <NavRewardButton />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent:"space-between",
    alignItems: 'center',
    paddingLeft:'4%',
    // alignContent: 'center',
    // alignSelf: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
    height: sc.navBarHeight,
    // paddingHorizontal: "3.5%",
    width: '100%',
    marginTop: Platform.OS === 'ios' ? '10%' : '0%',
  },
  buttonLeft: {
    alignItems: 'flex-start',
  },
  titleContainer: {
    // flex: 1,
    // flexDirection: 'row',
    textAlign:"center",
    // alignItems: 'center',
    // alignContent: 'space-between',
    // justifyContent: 'center',
    // paddingLeft: "15%",
    // marginRight: "15%",
  },
  title: {
    color: sc.colors.white,
    fontFamily: 'HelveticaNeue',
    fontSize: sc.isSmallScreen ? 18 : 22,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    textShadowColor: '#000000',
  },
  logo: {
    width: 42,
    height: 42,
  },
});

export default NavBar;
