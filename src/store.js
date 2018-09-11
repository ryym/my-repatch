class Store {
  constructor(initialState) {
    this.state = initialState;
    this.dispatch = this.dispatch.bind(this);
    this.commit = this.commit.bind(this);
    this.getState = this.getState.bind(this);

    this.dispatchForAction = (action, payload) =>
      this.dispatch(action, payload);
    this.dispatchForAction.commit = this.commit;

    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  commit(nextState) {
    this.state = nextState;
    this.listeners.forEach(l => l());
  }

  dispatch(action, payload) {
    return action(payload)(this.state)(this.dispatchForAction, this.getState);
  }

  subscribe(listener) {
    this.listeners = [...this.listeners, listener];
    return () =>
      (this.listeners = this.listeners.filter(lis => lis !== listener));
  }

  addMiddleware(...middlewares) {
    this.dispatch = middlewares.reduce((f, m) => m(this)(f), this.dispatch);
  }
}

module.exports = Store;
