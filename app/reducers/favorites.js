import * as types from '../actions/action-types';
import * as routes from '../routes/routes';
import * as strings from '../../config/strings';

const defaultFilters = [
	'All',
	'Messages',
	'Events',
	'Videos',
	'Audios',
	'Photos',
	'Health Links',
	'Groups',
];
const initialState = {
	is_loading					: false,
	data								: {},
	filter							: 'All',
	filters							: ['All'],
};

export default function tool(state = initialState, action = {}) {
  switch (action.type) {

    case types.CHILL_FAV_SELECT_FILTER:
			return {...state,
				filter		: action.filter,
			};

    case types.CHILL_FAV_FEED_LOAD:
			return {...state,
				is_loading: true,
			};

    case types.CHILL_FAV_FEED_LOADED:
			return {...buildState(state, action.response),
				is_loading: false,
			};

    case types.CHILL_FAV_UPDATED:
			return buildState(state, action.objects);

    default:
      return state;
  }

}

function buildState(state, favs) {
	let filters = ['All'];
  let favAll = [];
	let favMessages = [];
	let favEvents = [];
	let favVideos = [];
	let favAudios = [];
	let favPhotos = [];
	let favLinks = [];
	let favGroups = [];

	favs.forEach((datum) => {
    // Note: need to re-create 'All' array so components subscribed to the array will
    // receive new props. Otherwise, the array address is the same.
    favAll.push(datum);

		switch (datum.type) {
			case strings.OBJECT_TYPE_MESSAGE:
				(filters.indexOf('Messages') == -1) && filters.push('Messages');
				favMessages.push(datum);
				break;
			case strings.OBJECT_TYPE_EVENT:
				(filters.indexOf('Events') == -1) && filters.push('Events');
				favEvents.push(datum);
				break;
			case strings.OBJECT_TYPE_VIDEO:
				(filters.indexOf('Videos') == -1) && filters.push('Videos');
				favVideos.push(datum);
				break;
			case strings.OBJECT_TYPE_AUDIO:
				(filters.indexOf('Audios') == -1) && filters.push('Audios');
				favAudios.push(datum);
				break;
			case strings.OBJECT_TYPE_PHOTO:
				(filters.indexOf('Photos') == -1) && filters.push('Photos');
				favPhotos.push(datum);
				break;
			case strings.OBJECT_TYPE_LINK:
				(filters.indexOf('Health Links') == -1) && filters.push('Health Links');
				favLinks.push(datum);
				break;
			case strings.OBJECT_TYPE_GROUP:
				(filters.indexOf('Groups') == -1) && filters.push('Groups');
				favGroups.push(datum);
				break;
		}
	});

	return {...state,
		data		:	{
			'All'					: favAll,
			'Messages'		: favMessages,
			'Events'			: favEvents,
			'Videos'			: favVideos,
			'Audios'			: favAudios,
			'Photos'			: favPhotos,
			'Health Links': favLinks,
			'Groups'			: favGroups,
		},
		filters	:	filters,
	};
}
