import url from 'url';
import { createAction } from 'redux-actions';

import ActionTypes from '../constants/ActionTypes';
import checkHttpStatus from '../utilities/checkHttpStatus';
import normalizeResponse from '../utilities/normalizeResponse';

const fetchUserTimelineRequest = createAction(ActionTypes.FETCH_USER_TIMELINE_REQUEST);
const fetchUserTimelineSuccess = createAction(ActionTypes.FETCH_USER_TIMELINE_SUCCESS);
const fetchUserTimelineFailure = createAction(ActionTypes.FETCH_USER_TIMELINE_FAILURE);

export default function fetchUserTimeline() {
  return (dispatch, getState) => {
    const state = getState();

    const fetchUrl = url.format({
      protocol: 'http',
      host: 'localhost:7051',
      pathname: '/api/statuses/user_timeline.json',
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
      .then(normalizeResponse)
      .then(checkHttpStatus)
      .then((response) => {
        dispatch(fetchUserTimelineSuccess(response.data));
      })
      .catch((error) => {
        const payload = error.response ? error.response.data : error;
        dispatch(fetchUserTimelineFailure(payload));
      });
  };
}
