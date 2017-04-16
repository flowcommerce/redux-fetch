import PropTypes from 'prop-types';

const { number, string, shape } = PropTypes;

export const errorShape = shape({
  code: number,
  message: string.isRequired,
});

export const userShape = shape({
  user: shape({
    name: string.isRequired,
    screen_name: string.isRequired,
  }),
});

export const timelineShape = shape({
  text: string,
  user: shape({
    name: string,
  }),
});
