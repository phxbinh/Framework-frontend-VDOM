// ==========================
// 3) Store đã tối ưu
// ==========================
App.Store = {
  state: initialState,
  listeners: new Set(),

  // Lấy toàn bộ initialState
  getState() { return this.state; },

  dispatch(action) {
    const next = reducer(this.state, action);
    if (next === this.state) return;

    this.state = next;
    for (const fn of this.listeners) fn(next);
  },

/*
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
*/

subscribe(fn) {
  this.listeners.add(fn);

  let active = true;
  return () => {
    if (!active) return;
    active = false;
    this.listeners.delete(fn);
  };
}
};
