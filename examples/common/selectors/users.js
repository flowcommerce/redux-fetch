import { createSelector } from 'reselect';
import get from 'lodash/get';
import pick from 'lodash/pick';
import values from 'lodash/values';

export const getUsersEntities = state =>
  get(state, 'entities.users');

export const getUsers = createSelector(
  getUsersEntities,
  users => values(users),
);

export const getUserById = userId => createSelector(
  getUsersEntities,
  users => pick(users, userId),
);
