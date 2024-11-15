import * as routeTypes from './route-types';
import * as constants from '../../config/constants';

export function home() {
  return {
    id: routeTypes.HOME,
    icon: require('../../images/section/home.png'),
    relatedName: 'home',
    title: 'Home',
    info: 'Go back to the app’s continuous feed of news, tips and events, updatable by pulling down on the screen.',
    free: true,
  };
}

export function events() {
  return {
    id: routeTypes.EVENTS,
    icon: require('../../images/section/events.png'),
    relatedName: 'events',
    title: 'Events',
    info: 'Stay connected, involved and healthy with the most updated list of local happenings that you can share and instantly put in your calendar for reminders.',
    free: false,
  };
}

export function chill() {
  return {
    id: routeTypes.CHILL,
    relatedName: 'resources',
    title: 'Calmcierge',
    free: true,
  };
}

export function audios() {
  return {
    id: routeTypes.AUDIOS,
    icon: require('../../images/section/audio.png'),
    relatedName: 'audios',
    title: 'Sonic Spa',
    info: 'Take a break, meditate and fall asleep faster with relaxing music, environmental and guided audio tracks.',
    free: true,
  };
}

export function help() {
  return {
    id: routeTypes.HELP,
    icon: require('../../images/section/help.png'),
    relatedName: 'help',
    title: 'Get Help',
    info: 'Need emergency assistance? Dial directly to the resources listed here.',
    free: false,
  };
}

export function about() {
  return {
    id: routeTypes.ABOUT,
    relatedName: 'about',
    title: 'About',
    free: true,
  };
}

export function breath() {
  return {
    id: routeTypes.BREATH,
    icon: require('../../images/section/breath.png'),
    relatedName: 'breather',
    title: 'Breather',
    info: 'Get balanced and back on track by inhaling and exhaling with Anita, Justin and the orb.',
    free: true,
  };
}

export function library(schoolId) {
  return {
    id: routeTypes.LIBRARY,
    icon:
      schoolId === constants.LOCATION_ID_SMH ||
      schoolId === constants.LOCATION_ID_X93
        ? require('../../images/section/library_ta.png')
        : require('../../images/section/library.png'),
    relatedName: 'library',
    title:
      schoolId === constants.LOCATION_ID_SMH
        ? 'Teaching Assistant'
        : schoolId === constants.LOCATION_ID_X93
        ? 'Coach Guide'
        : 'Cafe 411',
    info:
      schoolId === constants.LOCATION_ID_SMH
        ? 'Get support presenting and teaching stress reduction techniques to students, colleagues and others.'
        : 'Get clear and even peace-of-mond with info and help on a variety of wellness topics.',
    free: false,
  };
}

export function libfinedining() {
  return {
    id: routeTypes.LIBRARY_FINE_DINING,
    icon: require('../../images/section/libfinedining.png'),
    relatedName: 'libfinedining',
    title: 'Fine Dining',
    info: 'Experience Blue Karma Secrets and Bali cuisine, even from afar.',
    free: false,
  };
}

export function libbkswellness() {
  return {
    id: routeTypes.LIBRARY_BKS_WELLNESS,
    icon: require('../../images/section/libbkswellness.png'),
    relatedName: 'libbkswellness',
    //title: 'BKS Wellness',
    title: 'Ukraine Relief',
    info: 'Find info and resources for Ukrainians and volunteers. Send resources to info@thestresscoach.com',
    free: false,
  };
}

export function libbkscollection() {
  return {
    id: routeTypes.LIBRARY_BKS_COLLECTION,
    icon: require('../../images/section/libbkscollection.png'),
    relatedName: 'libbkscollection',
    title: 'BKS Collection',
    info: 'Tour our stunning Bali villas, heavenly hillside hotel and luxurious Phinis ship.',
    free: false,
  };
}

export function libsuicideprevention() {
  return {
    id: routeTypes.LIBRARY_SUICIDE_PREVENTION,
    icon: require('../../images/section/libsuicideprevention.png'),
    relatedName: 'libsuicideprevention',
    title: 'Suicide Prevention',
    info: 'Tour our stunning Bali villas, heavenly hillside hotel and luxurious Phinis ship.',
    free: false,
  };
}

export function phone() {
  return {
    id: routeTypes.PHONE,
    icon: require('../../images/section/phone.png'),
    relatedName: 'phone',
    title: 'Phone a Friend',
    info: 'Create your go-to support crew for instant contact when you’re really stressed.',
    free: true,
  };
}

export function notes() {
  return {
    id: routeTypes.NOTES,
    icon: require('../../images/section/notes.png'),
    relatedName: 'notes',
    title: 'My Notes',
    info: 'Make your health a priority by seting goals, journaling and remembering resources.',
    free: false,
  };
}

export function badges() {
  return {
    id: routeTypes.BADGES,
    icon: require('../../images/section/badges.png'),
    relatedName: 'badges',
    title: 'Badges',
    navTitle: 'Health Rewards',
    info: 'Earn colorful palm trees which will automatically display when you reach distinct Health Rewards point levels.',
    free: true,
  };
}

export function contact() {
  return {
    id: routeTypes.CONTACT,
    icon: require('../../images/section/contact.png'),
    relatedName: 'contact',
    title: 'Contact',
    info: 'Email The Stress Coach (app producer) with comments, questions, content submissions and any technical issues.',
    free: true,
  };
}

export function chillVideos() {
  return {
    id: routeTypes.CHILL_VIDEOS,
    icon: require('../../images/section/video.png'),
    relatedName: 'videos',
    title: 'Videostream',
    info: 'Get motivated, smarter and mellow with expert, how-to and tranquil videos updated daily.',
    free: false,
  };
}

export function chillPhotos() {
  return {
    id: routeTypes.CHILL_PHOTOS,
    icon: require('../../images/section/photo.png'),
    relatedName: 'photos',
    title: 'Instacalm',
    info: 'Chill by focusing on serene, feel-good and inspiring shots from across the world and around the corner.',
    free: false,
  };
}

export function chillLinks(schoolId) {
  return {
    id: routeTypes.CHILL_LINKS,
    icon: require('../../images/section/links.png'),
    relatedName: 'links',
    title:
      schoolId === constants.LOCATION_ID_BKS ? 'Help Links' : 'Health Links',
    info: 'From one easy place, browse and connect campus with community resources that support your health and success.',
    free: false,
  };
}

export function chillGroups() {
  return {
    id: routeTypes.CHILL_GROUPS,
    icon: require('../../images/section/groups.png'),
    relatedName: 'groups',
    title: 'Groups',
    info: 'Make friends, get support or take action in campus and community groups updated here.',
    free: false,
  };
}

export function chillCaps() {
  return {
    id: routeTypes.CHILL_CAPS,
    icon: require('../../images/events/video-120.png'),
    relatedName: 'caps',
    title: 'CAPS Call Back',
    free: false,
  };
}

export function chillAbout() {
  return {
    id: routeTypes.CHILL_ABOUT,
    icon: require('../../images/section/about.png'),
    relatedName: 'about',
    title: 'About',
    info: 'Learn more about how the app works and contact us with your comments, questions and ideas.',
    free: true,
  };
}

export function chillReminders() {
  return {
    id: routeTypes.CHILL_REMINDERS,
    icon: require('../../images/section/reminders.png'),
    relatedName: 'reminders',
    title: 'Reminders',
    info: 'Choose from wellness-boosting activities that we’ll remind you to do.',
    free: false,
  };
}

export function chillHealthRewards() {
  return {
    id: routeTypes.CHILL_HEALTH_REWARDS,
    icon: require('../../images/section/rewards.png'),
    relatedName: 'rewards',
    title: 'Health Rewards',
    info: 'Watch your Health Rewards rise and earn palm tree badges as you use the app and participate in wellness activities (location and version dependent).',
    free: true,
  };
}

export function chillFavorites() {
  return {
    id: routeTypes.CHILL_FAVORITES,
    icon: require('../../images/section/favorites.png'),
    relatedName: 'favorites',
    title: 'My Favorites',
    info: 'Your shortcut to calm where your favorited (starred) app content is saved.',
    free: true,
  };
}

export function chillAmStressbuster() {
  return {
    id: routeTypes.CHILL_AM_STRESSBUSTER,
    icon: require('../../images/section/am_one.png'),
    relatedName: 'am_one',
    title: "I'm A Stressbuster",
    info: 'Get Stressbusters volunteer happenings, sign up for events, review videos and contact program coordinators (password required).',
    free: false,
  };
}

export function chillBeStressbuster() {
  return {
    id: routeTypes.CHILL_BE_STRESSBUSTER,
    icon: require('../../images/section/be_one.png'),
    relatedName: 'be_one',
    title: 'Be A Stressbuster',
    info: 'Learn about Stressbusters program benefits, requirements, and complete a fast application to join the group that’s improving campus life.',
    free: false,
  };
}

export function comments() {
  return {
    id: routeTypes.COMMENTS,
  };
}
