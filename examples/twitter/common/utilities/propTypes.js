import PropTypes from 'prop-types';

const {
  arrayOf, number, object, string, shape,
} = PropTypes;

export const errorShape = shape({
  statusCode: number,
  error: string,
  message: string.isRequired,
  attributes: arrayOf(object),
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
