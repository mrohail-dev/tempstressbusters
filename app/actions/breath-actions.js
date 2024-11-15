import * as types from './action-types';

export function select() {
  return {
    type: types.BREATH_SELECT,
  };
}

export function close() {
  return {
    type: types.BREATH_CLOSE,
  };
}
