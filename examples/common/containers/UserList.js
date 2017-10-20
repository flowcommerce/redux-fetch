import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withFetch } from '@flowio/redux-fetch';

import { fetchUsers } from '../actions';
import { getUsers } from '../selectors';
import UserList from '../components/UserList';

const fetchData = dispatch => dispatch(fetchUsers());

const mapStateToProps = createStructuredSelector({
  users: getUsers,
});

export default withFetch(fetchData)(connect(mapStateToProps)(UserList));
