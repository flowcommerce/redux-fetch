import defaultsDeep from 'lodash/defaultsDeep';
import createMockComponent from './createMockComponent';

const defaultRouteConfig = {
  component: createMockComponent(),
  path: 'search/cats',
  exact: false,
  strict: false,
  routes: [],
};

export default function createMockRouteConfig(routeConfig) {
  return defaultsDeep(routeConfig, defaultRouteConfig);
}
