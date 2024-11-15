import * as strings from '../../config/strings';
import * as routes from '../routes/routes';

export default (object) => {
	return {
		canComment					: () => canComment(object),
		canFav							: () => canFav(object),
		canShare        		: () => canShare(object),
		canShareFacebook		: () => canShareFacebook(object),
		canShareTwitter			: () => canShareTwitter(object),
		canShareSms					: () => canShareSms(object),
		canShareEmail				: () => canShareEmail(object),
		canPinHome				  : () => canPinHome(object),
		canDoMore        		: () => canDoMore(object),
		canReplySms					: () => canReplySms(object),
		canReplyPhone				: () => canReplyPhone(object),
		canReplyEmail				: () => canReplyEmail(object),
		canLinkToCalendar		: () => canLinkToCalendar(object),
		canLinkToMap				: () => canLinkToMap(object),
		canParticipate			: () => canParticipate(object),
		canSendUsPhoto			: () => canSendUsPhoto(object),
		canSendUsVideoLink	: () => canSendUsVideoLink(object),
		canGoToWebsite			: () => canGoToWebsite(object),
		canFocus        		: () => canFocus(object),
		isPaid        			: () => isPaid(object),
	};
}

function canComment(object) {
	return Boolean(object.can_comment);
}

function canFav(object) {
	if (object.type == strings.OBJECT_TYPE_CALLBACK
		|| object.type == strings.OBJECT_TYPE_ABOUT) {
		return false;
	}

	return true;
}


function canPinHome(object) {
	return Boolean(object.type == strings.OBJECT_TYPE_PHOTO
		|| object.type == strings.OBJECT_TYPE_AUDIO);
}

function canShare(object) {
	return Boolean(object.type == strings.OBJECT_TYPE_MESSAGE
		|| object.type == strings.OBJECT_TYPE_PHOTO
		|| object.type == strings.OBJECT_TYPE_VIDEO
		|| object.type == strings.OBJECT_TYPE_EVENT);
}

function canShareFacebook(object) {
  return canShare(object);
}

function canShareTwitter(object) {
  return canShare(object);
}

function canShareSms(object) {
  return canShare(object);
}

function canShareEmail(object) {
  return canShare(object);
}


function canDoMore(object) {
	return Boolean(object.type != strings.OBJECT_TYPE_TEXT
    && object.type != strings.OBJECT_TYPE_AUDIO
    && object.type != strings.OBJECT_TYPE_MESSAGE);
}

function canReplySms(object) {
	return Boolean(
    (object.type == strings.OBJECT_TYPE_GROUP || object.type == strings.OBJECT_TYPE_LINK)
      && !! object.phone && (object.phone.length > 0)
  );
}

function canReplyPhone(object) {
	return Boolean(
    (object.type == strings.OBJECT_TYPE_GROUP || object.type == strings.OBJECT_TYPE_LINK)
      && !! object.phone && (object.phone.length > 0)
  );
}

function canReplyEmail(object) {
	return Boolean(
    (object.type == strings.OBJECT_TYPE_GROUP || object.type == strings.OBJECT_TYPE_LINK)
      && !! object.email && (object.email.length > 0)
  );
}

function canLinkToCalendar(object) {
	return Boolean(object.type == strings.OBJECT_TYPE_EVENT && object.start_date);
}

function canLinkToMap(object) {

	if (object.type == strings.OBJECT_TYPE_EVENT) {
		return Boolean((object.location_lon != 0) && (object.location_lat != 0));
	}

	if (object.type == strings.OBJECT_TYPE_LINK) {
		return Boolean(object.address && (object.address != null) && (object.address != ''));
	}

	return false;
}

function canParticipate(object) {
	return Boolean(object.type === strings.OBJECT_TYPE_EVENT && object.can_signup);
}

function canSendUsPhoto(object) {
	return Boolean(object.type === strings.OBJECT_TYPE_PHOTO);
}

function canSendUsVideoLink(object) {
	return Boolean(object.type === strings.OBJECT_TYPE_VIDEO);
}

function canGoToWebsite(object) {
	return Boolean(
    (object.type == strings.OBJECT_TYPE_GROUP || object.type == strings.OBJECT_TYPE_LINK) && object.link
  );
}

function canFocus(object) {
	return Boolean(object.type == strings.OBJECT_TYPE_PHOTO);
}

function isPaid(object) {
	if (object.type == strings.OBJECT_TYPE_AUDIO) {
    return object.id !== 'hccF8tQMJy' // Quick Calm
    && object.id !== 'r4LHoBMM6r' // Breathing Music
    && object.id !== 'OtLB7at6QA' // Riverside
    && object.id !== 'D5Ic7cL31j' // In Harmony
    && object.id !== 'ixHqArf3ie' // Cave Rain
    && object.id !== 'LWmueTSyvS' // Go Coastal
    && object.id !== '6CVE5kKQwL' // Rain On A Window
    && object.id !== 'II8OUTLPc9' // Sleeping Pill
    && object.id !== 'VIYi7esdd1' // Music For Dreaming
    && object.id !== 'fpC9QnKqdl' // Deep State
    && object.id !== 'eVrUHolclC' // Heartbeats
    && object.id !== 'KjN17OJrfx' // Sonata in C Minor
  }

	else if (object.type == strings.OBJECT_TYPE_MESSAGE) {
    if (object.related_screen) {
      const route = Object.keys(routes).find(routeFunc => {
        const route = routes[routeFunc]();
        return Boolean(object.related_screen == route.relatedName && ! route.free);
      });
      if (route) {
        return true;
      }
    }
  }

  return false;
}
