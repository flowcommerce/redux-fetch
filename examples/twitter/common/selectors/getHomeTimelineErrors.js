export default function getHomeTimelineErrors(state) {
  let errors = [];

  if (state.user.error) {
    errors = errors.concat(state.user.error);
  }

  if (state.homeTimeline.error) {
    errors = errors.concat(state.homeTimeline.error);
  }

  return errors;
}
