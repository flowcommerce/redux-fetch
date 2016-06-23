import url from 'url';
import { createAction } from 'redux-actions';
import { checkStatus, parseJSON } from '../utilities/fetch';

export const fetchHomeTimelineRequest = createAction('FETCH_HOME_TIMELINE_REQUEST');
export const fetchHomeTimelineSuccess = createAction('FETCH_HOME_TIMELINE_SUCCESS');
export const fetchHomeTimelineFailure = createAction('FETCH_HOME_TIMELINE_FAILURE');

export function fetchHomeTimeline() {
  return (dispatch, getState) => {
    const state = getState();

    const fetchUrl = url.format({
      protocol: 'http',
      host: 'localhost:9000',
      pathname: '/statuses/home_timeline.json',
    });

    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${state.authorization.token}`,
      },
    };

    dispatch(fetchHomeTimelineRequest());

    return fetch(fetchUrl, fetchOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then(response => dispatch(fetchHomeTimelineSuccess(response)))
    // Should always handle errors surfaced while fetching initial route state.
    .catch(error => dispatch(fetchHomeTimelineFailure(error)));
  };
}
