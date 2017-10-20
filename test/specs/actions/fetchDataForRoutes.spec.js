import { fetchCanceled, fetchLoading, fetchFulfilled, fetchRejected, fetchDataForRoutes } from '../../../src/actions';
import CancellationTokenSource from '../../../src/utilities/CancellationTokenSource';
import createMockFetchContainer from '../../helpers/createMockFetchContainer';
import createMockRouteConfig from '../../helpers/createMockRouteConfig';
import createMockStore from '../../helpers/createMockStore';

describe('fetchDataForRoutes', () => {
  const { dispatch, getActions, clearActions } = createMockStore();
  const pathname = '/search/people';

  const createSubject = (fetchData, cancelToken) => {
    const Component = fetchData ? createMockFetchContainer(fetchData) : undefined;
    const routes = [createMockRouteConfig({
      path: pathname,
      component: Component,
    })];
    return dispatch(fetchDataForRoutes(routes, pathname, cancelToken));
  };

  beforeEach(() => {
    clearActions();
  });

  it('should dispatch FULFILLED action when promise is fulfilled', () => {
    const fetchData = sinon.stub().returns(Promise.resolve());
    const promise = createSubject(fetchData);
    return expect(promise).to.be.fulfilled.then(() => {
      expect(getActions()).to.deep.equal([
        fetchLoading(pathname),
        fetchFulfilled(pathname),
      ]);
    });
  });

  it('should dispatch REJECTED action when promise is rejected', () => {
    const error = { message: 'Invalid data provided' };
    const fetchData = sinon.stub().returns(Promise.reject(error));
    const promise = createSubject(fetchData);
    return expect(promise).to.be.fulfilled.then(() => {
      expect(getActions()).to.deep.equal([
        fetchLoading(pathname),
        fetchRejected(pathname, error),
      ]);
    });
  });

  it('should dispatch CANCELED action when promise is resolved after it is canceled', () => {
    const fetchSource = new CancellationTokenSource();
    fetchSource.cancel();
    const fetchData = sinon.stub().returns(Promise.resolve());
    const promise = createSubject(fetchData, fetchSource.token);
    return expect(promise).to.be.fulfilled.then(() => {
      expect(getActions()).to.deep.equal([
        fetchLoading(pathname),
        fetchCanceled(pathname),
      ]);
    });
  });

  it('should dispatch CANCELED action when promise is rejected after it is canceled', () => {
    const fetchSource = new CancellationTokenSource();
    fetchSource.cancel();
    const fetchData = sinon.stub().returns(Promise.reject());
    const promise = createSubject(fetchData, fetchSource.token);
    return expect(promise).to.be.fulfilled.then(() => {
      expect(getActions()).to.deep.equal([
        fetchLoading(pathname),
        fetchCanceled(pathname),
      ]);
    });
  });

  it('should dispatch FULFILLED action when a route component is not defined', () => {
    const promise = createSubject();
    return expect(promise).to.be.fulfilled.then(() => {
      expect(getActions()).to.deep.equal([
        fetchLoading(pathname),
        fetchFulfilled(pathname),
      ]);
    });
  });
});
