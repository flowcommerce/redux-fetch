import createMockComponent from './createMockComponent';
import withFetch from '../../src/components/withFetch';

export default function createMockFetchContainer(fetchData) {
  const Component = createMockComponent();
  return withFetch(fetchData)(Component);
}
