import URI from 'urijs';
import * as constants from '../../config/constants';

export async function get(uri, schoolId = null) {
  return await getWithParams(uri, { school_id: schoolId });
}

export async function getWithParams(uri, values) {
  values.anonymous_id = global.anonymousId;

	try {
		const link = URI(constants.APP_API_HOST + uri).query(values).toString();
		const options = {method : 'GET'}
		console.log('api hit',link, options);
		const response = await fetch(link, options);
		const responseText = await response.text();
		return JSON.parse(responseText);
	}
	catch(error) {
		console.warn(error);
	}
}

export async function post(uri, values) {
  values.anonymous_id = global.anonymousId;

	let body = new FormData();
	for (let key in values){
		body.append(key, values[key]);
	}

	try {
		const link = constants.APP_API_HOST + uri;
		const options = {
			method: 'POST',
			body: body
		};

		const response = await fetch(link, options);
		const responseText = await response.text();
		return JSON.parse(responseText);
	}
	catch(error) {
		console.warn(error);
	}
}
