import { ActionTypes } from '../constants';

export function validate() {
  return { type: ActionTypes.FETCH_VALIDATE };
}

export function invalidate() {
  return { type: ActionTypes.FETCH_INVALIDATE };
}
