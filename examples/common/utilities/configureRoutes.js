import BasicExample from '../components/BasicExample';
import Home from '../components/Home';
import NotFound from '../components/NotFound';
import OverlaySpinnerExample from '../components/OverlaySpinnerExample';
import Post from '../containers/Post';
import PostList from '../containers/PostList';
import UserList from '../containers/UserList';

export default function configureRoutes() {
  return [{
    path: '/',
    exact: true,
    component: Home,
  }, {
    path: '/examples/basic',
    component: BasicExample,
    routes: [{
      path: '/examples/basic/users',
      component: UserList,
    }, {
      path: '/examples/basic/posts',
      exact: true,
      component: PostList,
    }, {
      path: '/examples/basic/posts/:id',
      component: Post,
    }],
  }, {
    path: '/examples/overlay-spinner',
    component: OverlaySpinnerExample,
    routes: [{
      path: '/examples/overlay-spinner/users',
      component: UserList,
    }, {
      path: '/examples/overlay-spinner/posts',
      exact: true,
      component: PostList,
    }, {
      path: '/examples/overlay-spinner/posts/:id',
      component: Post,
    }],
  }, {
    component: NotFound,
  }];
}
