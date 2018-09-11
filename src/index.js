const Store = require('./store');

const store = new Store({count: 0});
store.subscribe(() => {
  console.log('update');
});

const logger = store => next => (action, payload) => {
  console.log('-----------------------------');
  console.log('prev state', store.getState());
  console.log(`[RUN] action: ${action.name}, payload: ${payload}`);
  const ret = next(action, payload);
  console.log('next state', store.getState());
  return ret;
};

store.addMiddleware(logger);

const commit = nextState => d => d.commit(nextState);

const increment = (n = 1) => state =>
  commit({
    count: state.count + n,
  });

const incrementAfter = secs => () => dispatch => {
  return new Promise(resolve => {
    setTimeout(() => {
      dispatch(increment);
      resolve();
    }, secs * 1000);
  });
};

store.dispatch(incrementAfter, 1);
store.dispatch(increment);
store.dispatch(increment);
