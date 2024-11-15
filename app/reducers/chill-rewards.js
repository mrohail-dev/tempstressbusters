import * as types from '../actions/action-types';
import * as routes from '../routes/routes';
import * as strings from '../../config/strings';

const filtersWithoutGive = [ 'Earn', 'Spend', 'Scan', 'Badges' ];
const filtersWithGive = [ 'Earn', 'Spend', 'Scan', 'Give', 'Badges' ];
const initialState = {
	is_loading					: false,
	data								: {
    'Badges'  : [
      {
        type    : strings.OBJECT_TYPE_BADGE,
        title   : 'White Palm Tree Badge',
        content : 'It’s a breeze to earn 1,000 Health Rewards and a white palm tree badge. Just open the app, listen to Sonic Spa tracks, watch videos, etc., and your furst tree will appear in no time!',
        points  : '1,000 points',
      },
      {
        type    : strings.OBJECT_TYPE_BADGE,
        title   : 'Light Blue Palm Tree Badge',
        content : 'A light blue palm tree says that you’ve made chill and wellness an important part of your day, and it’s also a great motivator toward your next badge. Go blue!',
        points  : '2,500 points',
      },
      {
        type    : strings.OBJECT_TYPE_BADGE,
        title   : 'Silver Palm Tree Badge',
        content : 'Silver says that you are serious about making your health a priority and will be awarded a silver palm for your impressive and inspiring efforts.',
        points  : '5,000 points',
      },
      {
        type    : strings.OBJECT_TYPE_BADGE,
        title   : 'Gold Palm Tree Badge',
        content : 'You’ll be a poster child for chill and better health after you rack up 10,000 Health Rewards, and you’ll have earned the right to take a long snooze under your silver palm.',
        points  : '10,000 points',
      },
      {
        type    : strings.OBJECT_TYPE_BADGE,
        title   : 'Deep Blue Palm Tree Badge',
        content : 'Deep blue is the color of cool, and you will be one of the coolest—and possibly healthiest—appsters anywhere when your app lights up with 25,000+ Health Rewards.',
        points  : '25,000 points',
      },
      {
        type    : strings.OBJECT_TYPE_BADGE,
        title   : 'Purple Palm Tree Badge',
        content : 'Everyone will go coconuts when you reach 50,000 Health Rewards, the highest badge level currently available and symbolized by the coveted purple palm tree.',
        points  : '50,000 points',
      },
    ],
  },
	filter							: 'Earn',
	filters							: filtersWithoutGive,
	is_processing_scan	: false,
	processing_error		: null,
	processing_success	: null,
};

export default function chillRewards(state = initialState, action = {}) {
  switch (action.type) {

    case types.CHILL_REWARDS_ADD_GIVE_FILTER:
			return {...state,
				filters		: filtersWithGive,
			};

    case types.CHILL_REWARDS_SELECT_FILTER:
			return {...state,
				filter		: action.filter,
			};

    case types.CHILL_REWARDS_FEED_LOAD:
			return {...state,
				is_loading: true,
			};

    case types.CHILL_REWARDS_FEED_LOADED: {
      const data = { ...state.data };
			data[action.filter] = action.response;

			return {...state,
        data,
				is_loading: false,
			};
    }

    case types.CHILL_REWARDS_SCAN_STARTED:
			return {...state,
				is_processing_scan: true,
				processing_error: null,
				processing_success: null,
			};

    case types.CHILL_REWARDS_SCAN_FAILED:
			return {...state,
				processing_error: action.msg,
				processing_success: null,
			};

    case types.CHILL_REWARDS_SCAN_SUCEEDED:
			return {...state,
				processing_error: null,
				processing_success: action.msg,
			};

    case types.CHILL_REWARDS_SCAN_RETRY:
			return {...state,
				is_processing_scan: false,
				processing_error: null,
				processing_success: null,
			};

    default:
      return state;
  }
}
