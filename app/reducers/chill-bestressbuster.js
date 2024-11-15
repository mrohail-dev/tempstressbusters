import * as types from '../actions/action-types';
import * as routes from '../routes/routes';

const initialState = {
	filter							: 'About Stressbusters',
	filters							: [
		'About Stressbusters',
		'Videos',
		'Apply Now',
	],
	bottomInset					: 0,
	questions						: [
		'How did you hear about Stressbusters?',
		'Why do you want to be part of the Stressbusters program?',
		'Briefly describe a situation where you helped someone by providing information or a service, or when you benefitted from someone else\'s help. Please include how either experience made you feel.',
		'How do you manage or reduce your stress?',
		'Do you have any questions or ideas for the Stressbusters program?',
	],
	isSignedUp					: false,
};

export default function chillBeStressbuster(state = initialState, action = {}) {
  switch (action.type) {

    case types.CHILL_BESTRESSBUSTER_SELECT_FILTER:
			return {...state,
				filter		: action.filter,
			};

    case types.CHILL_BESTRESSBUSTER_UPDATE_BOTTOM_INSET:
			return {...state,
				bottomInset	: action.height,
			};

    case types.CHILL_BESTRESSBUSTER_SIGNEDUP:
			return {...state,
				isSignedUp	: true,
			};

    default:
      return state;
  }
}
