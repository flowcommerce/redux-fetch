import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchDataForRoutes } from '../actions';
import { getError, getReadyState } from '../selectors';
import FetchRenderer from '../components/FetchRenderer';

function mapStateToProps(state, props) {
  const { getFetchState } = props;
  return {
    error: getError(getFetchState)(state),
    readyState: getReadyState(getFetchState)(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchDataForRoutes,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FetchRenderer);
