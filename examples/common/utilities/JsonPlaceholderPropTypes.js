import PropTypes from 'prop-types';

const { bool, number, string, shape } = PropTypes;

const Geolocation = shape({
  lat: string,
  lng: string,
});

const Address = shape({
  street: string,
  suite: string,
  city: string,
  zipcode: string,
  geo: Geolocation,
});

const Company = shape({
  name: string,
  catchPhrase: string,
  bs: string,
});

const Post = shape({
  userId: number,
  id: number,
  title: string,
  body: string,
});

const User = shape({
  id: number,
  name: string,
  username: string,
  email: string,
  address: Address,
  phone: string,
  website: string,
  company: Company,
});

const Comment = shape({
  postId: number,
  id: number,
  name: string,
  email: string,
  body: string,
});

const Album = shape({
  userId: number,
  id: number,
  title: string,
});

const Photo = shape({
  albumId: number,
  id: number,
  title: string,
  url: string,
  thumbnailUrl: string,
});

const Todo = shape({
  userId: number,
  id: number,
  title: string,
  completed: bool,
});

const JsonPlaceholderPropTypes = {
  Post,
  User,
  Comment,
  Album,
  Photo,
  Todo,
};

export default JsonPlaceholderPropTypes;
