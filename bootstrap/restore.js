// ==========================
// 5) useStore tối ưu
// Sử dụng để lấy dữ liệu thuộc tính của auth, counter, posts, ... trong initialState như: auth.user, auth.role; counter.value; postsA.postsDemo; ...
// ==========================
App.useStore = function(selector) {

  const { useState, useEffect, useRef } = App.Hooks;

  const [value, setValue] = useState(() => selector(App.Store.getState()));

  const prev = useRef(value);

  useEffect(() => {
    return App.Store.subscribe((s) => {
      const newValue = selector(s);
      if (!Object.is(prev.current, newValue)) {
        prev.current = newValue;
        setValue(newValue);
      }
    });
  }, []);

  return value;
};