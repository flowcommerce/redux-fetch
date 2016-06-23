import url from 'url';
import { createAction } from 'redux-actions';
import { checkStatus, parseJSON } from '../utilities/fetch';

export const fetchUserTimelineRequest = createAction('FETCH_USER_TIMELINE_REQUEST');
export const fetchUserTimelineSuccess = createAction('FETCH_USER_TIMELINE_SUCCESS');
export const fetchUserTimelineFailure = createAction('FETCH_USER_TIMELINE_FAILURE');

export function fetchUserTimeline() {
  return (dispatch, getState) => {
    const state = getState();

    const fetchUrl = url.format({
      protocol: 'http',
      host: 'localhost:9000',
      pathname: '/statuses/user_timeline.json',
      query: {
        user_id: state.authorization.user_id,
      },
    });

    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${state.authorization.token}`,
      },
    };

    dispatch(fetchUserTimelineRequest());

    return fetch(fetchUrl, fetchOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then(response => dispatch(fetchUserTimelineSuccess(response)))
    // Should always handle errors surfaced while fetching initial route state.
    .catch(error => dispatch(fetchUserTimelineFailure(error)));
  };
}
