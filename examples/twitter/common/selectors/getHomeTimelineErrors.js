export default function getHomeTimelineErrors(state) {
  let errors = [];

  if (state.user.error) {
    errors = errors.concat(state.user.error.errors);
  }

  if (state.homeTimeline.error) {
    errors = errors.concat(state.homeTimeline.error.errors);
  }

  return errors;
}
