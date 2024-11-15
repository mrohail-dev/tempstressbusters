import * as routeTypes from '../routes/route-types';
import { APP_TYPES } from '../../config/constants';

export function getAppType(accountType, schoolId) {
  if (accountType == 'school') {
    return schoolId == 'lXfzoolpNe'
      ? APP_TYPES.PENN
      : APP_TYPES.SB;
  }

  return APP_TYPES.CALMCAST;
}

export function hasHomeTab(menus) {
  return menus.some(menu => (menu.id == routeTypes.HOME));
}
export function hasEventsTab(menus) {
  return menus.some(menu => (menu.id == routeTypes.EVENTS));
}
export function hasChillTab(menus) {
  return menus.some(menu => (menu.id == routeTypes.CHILL));
}
export function hasAudiosTab(menus) {
  return menus.some(menu => (menu.id == routeTypes.AUDIOS));
}
export function hasFavoritesTab(menus) {
  return menus.some(menu => (menu.id == routeTypes.CHILL_FAVORITES));
}
export function hasHelpTab(menus) {
  return menus.some(menu => (menu.id == routeTypes.HELP));
}
export function hasRemindersTab(menus) {
  return menus.some(menu => (menu.id == routeTypes.CHILL_REMINDERS));
}

