import * as types from './action-types';

export function show(object) {
  return {
    type: types.SUBMIT_INSTRUCTION_SHOW,
		object: object,
  };
}

export function hide() {
  return {
    type: types.SUBMIT_INSTRUCTION_HIDE,
  };
}
