  // Chặn FOUC (Flash Of Wrong Theme)
  (function () {
    const t = localStorage.getItem("app-theme");
    if (t) document.documentElement.setAttribute("data-theme", t);
  })();

window.App = window.App || {}
App.Theme = (function () {
  const STORAGE_THEME_KEY = "app-theme";

  const root = document.documentElement;

  const media = matchMedia("(prefers-color-scheme: dark)");

  const listeners = new Set();

  const getSystemTheme = () => media.matches ? "dark" : "light";

  const getUserTheme = () => localStorage.getItem(STORAGE_THEME_KEY);

  const getResolvedTheme = () => getUserTheme() || getSystemTheme();

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    notify(theme);
  }

  function setUserTheme(theme) {
    localStorage.setItem(STORAGE_THEME_KEY, theme);
    applyTheme(theme);
  }

  function toggle() {
    const next = getResolvedTheme() === "dark" ? "light" : "dark";
    setUserTheme(next);
    return next;
  }

  function resetToSystem() {
    localStorage.removeItem(STORAGE_THEME_KEY);
    root.removeAttribute("data-theme");
    notify(getSystemTheme());
  }

  function notify(theme) {
    listeners.forEach(fn => fn(theme));
  }

  function onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  media.addEventListener("change", e => {
    if (!getUserTheme()) {
      notify(getSystemTheme());
    }
  });

  function init() {
    const user = getUserTheme();
    if (user) applyTheme(user);
  }

  return {
    init,
    toggle,
    setUserTheme,
    resetToSystem,
    getResolvedTheme,
    onChange
  };
})();