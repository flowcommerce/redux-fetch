import url from 'url';
import { createAction } from 'redux-actions';

import ActionTypes from '../constants/ActionTypes';
import checkHttpStatus from '../utilities/checkHttpStatus';
import normalizeResponse from '../utilities/normalizeResponse';

const fetchHomeTimelineRequest = createAction(ActionTypes.FETCH_HOME_TIMELINE_REQUEST);
const fetchHomeTimelineSuccess = createAction(ActionTypes.FETCH_HOME_TIMELINE_SUCCESS);
const fetchHomeTimelineFailure = createAction(ActionTypes.FETCH_HOME_TIMELINE_FAILURE);

export default function fetchHomeTimeline() {
  return (dispatch, getState) => {
    const state = getState();

    const fetchUrl = url.format({
      protocol: 'http',
      host: 'localhost:7051',
      pathname: '/api/statuses/home_timeline.json',
    });

    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${state.authorization.token}`,
      },
    };

    dispatch(fetchHomeTimelineRequest());

    return fetch(fetchUrl, fetchOptions)
      .then(normalizeResponse)
      .then(checkHttpStatus)
      .then((response) => {
        dispatch(fetchHomeTimelineSuccess(response.data));
      })
      .catch((error) => {
        const payload = error.response ? error.response.data : error;
        dispatch(fetchHomeTimelineFailure(payload));
      });
  };
}
