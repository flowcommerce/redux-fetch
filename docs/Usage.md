# Usage

Apply the `useFetch` router middleware and create fetch containers for each of
your route components:

```javascript
import { applyMiddleware } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useFetch, withFetch } from '@flowio/redux-fetch';
import Application from './app/components/Application';
import IssueList from './app/components/IssueList';
import Issue from './app/components/Issue';

const fetchIssueListState = (dispatch) => Promise.all([
  dispatch(fetchNotifications()),
  dispatch(fetchRepos()),
  dispatch(fetchIssueList()),
]);

const fetchIssueState = (dispatch, getState, props) =>
  dispatch(fetchIssue(props.params.issueId));

const IssueListContainer = compose(
  withFetch(fetchIssueListState),
  connect(/* ... */),
)(IssueList);

const IssueContainer = compose(
  withFetch(fetchIssueState),
  connect(/* ... */),
)(Issue);

ReactDOM.render(
  <Router history={history} render={applyRouterMiddleware(useFetch)}>
    <Route path="/" component={Application} />
      <Route path="issues">
        <IndexRoute component={IssueListContainer} />
        <Route path=":issueId" component={IssueContainer} />
      </Route>
    </Route>
  </Router>
)
```
