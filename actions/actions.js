


const AuthActions = () => ({
  login(payload) {
    App.Store.dispatch({ type: "AUTH_LOGIN", payload });
    App.Router.navigateTo('/');
  },
  logout() {
    App.Store.dispatch({ type: "AUTH_LOGOUT" });
    //App.Router.navigateTo('/');
  }
});

const CounterActions = () => ({
  inc: () => App.Store.dispatch({ type: "COUNTER_INC" }),
  dec: () => App.Store.dispatch({ type: "COUNTER_DEC" }),
  reset: () => App.Store.dispatch({ type: "COUNTER_RESET" })
});

const PostAActions = () => ({
  set: () => App.Store.dispatch({ type: "POPULAR_POSTS" }),
  flag: (payload) => App.Store.dispatch({ type: "FLAG_POST", payload }),
  update: (payload) => App.Store.dispatch({ type: "UPDATE_POST", payload }),
  add: (payload) => App.Store.dispatch({ type: "ADD_POST", payload }),
  delete: (payload) => App.Store.dispatch({ type: "DELETE_POST", payload })
});

const UserActions = () => ({
  update: (payload) => App.Store.dispatch({ type: "UPDATE_USER", payload })
});


const createActions = () => ({
  Auth: AuthActions(),
  Counter: CounterActions(),
  PostA: PostAActions(),
  User: UserActions()
});

App.Actions = createActions();

/* Không tối ưu cho test và mở rộng
App.Actions = {
  Auth: AuthActions(),
  Counter: CounterActions(),
  PostA: PostAActions(),
  User: UserActions()
}
*/