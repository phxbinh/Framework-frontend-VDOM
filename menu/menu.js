// 🎾Logic menu --------
const BURGER_SUBMENUS = [
  {
    id: "posts",
    title: "Posts",
    links: [
      { to: "/postsnew", label: "Posts New" },
      { to: "/posts/drafts", label: "Drafts" },
      { to: "/posts/environment", label: "Environment" },
      { to: "/posts/airtreatment", label: "Air treatment" }
    ]
  },
  {
    id: "services",
    title: "Services",
    links: [
      { to: "/services/educate", label: "Educate" },
      { to: "/services/solid", label: "Solid" },
      { to: "/services/logistic", label: "Logistic" }
    ]
  }
];

function useBurgerMenuLogic({ submenus }) {
  // chỉ quản lý UI state
  const [openId, setOpenId] = useState(null);

  const toggleSubmenu = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return {
    submenus,
    openId,
    toggleSubmenu
  };
}

function useBurgerMenuController({ auth }) {

  const isLoggedIn = !!auth?.user;

  // có thể filter menu theo role ở đây
  const submenus = BURGER_SUBMENUS;

  return useBurgerMenuLogic({
    submenus
  });
}

function BurgerMenuRight({ open, onClose, auth }) {

  const {
    submenus,
    openId,
    toggleSubmenu
  } = useBurgerMenuController({ auth });

  return h("div", { class: "burger-root" }, [

    open &&
      h("div", {
        class: "burger-overlay",
        onClick: onClose
      }),

    h("aside", {
      class: open
        ? "burger-sidebar-right open"
        : "burger-sidebar-right"
    }, [

      h("div", { class: "burger-header" }, [
        h('div',{
          style: {
            display: 'flex',
            flexDirection: 'row',
            gap: '10px'
          }
        }, [
          h("span", null, "Menu"),
          h('span', {id: 'themeStatus'})
        ]),

        h("button", { onClick: onClose }, "×")
      ]),

      h("nav", { class: "burger-nav" }, [

        h(Link, { to: "/", children: "Home" }),
        h(Link, { to: "/counter", children: "Counter" }),
        !auth.user && h(Link, { to: "/register", children: "Register" }),

        ...submenus.flatMap(menu => {
          const isOpen = openId === menu.id;

          return [
            h("div", {
              class: "submenu-title",
              onClick: () => toggleSubmenu(menu.id)
            }, [
              h("span", null, menu.title),
              h("span", {
                class: isOpen ? "arrow up" : "arrow"
              }, "▸")
            ]),

            h("div", {
              class: isOpen
                ? "submenu-box open"
                : "submenu-box"
            }, menu.links.map(link =>
              h(Link, {
                to: link.to,
                children: link.label
              })
            ))
          ];
        }),

        // Chỉ hiển thi lên menu khi đăng nhập thành công
        auth.user && h(Link, { to: "/settings", children: "Settings" }),

        h(Link, { to: "/userslist", children: "Users list" }),
        h(Link, { to: "/postslist", children: "Posts list" }),
        h(Link, { to: "/renderobjectusers", children: "Render Object user" }),
        h(Link, { to: "/authlogin", children: "Auth login" }),
        h(Link, { to: "/debugpanel", children: "Debug panel" }),

        h(Link, { to: "/composertest", children: "Composer Test" })
      ])
    ])
  ]);
}
// --------------------------------⛳️ //

// 🎾Component image login ---
function InfoLabel({auth, logout}) {
  function handleLogout() {
     logout();
     App.Router.navigateTo('/');
  }
  return h('div', {class: "infoLabel"}, [ 
    h('img', {
      style: { width:'24px', height:'24px', borderRadius:'50%' },
      src: auth?.avatar || '/default-avatar.png',
      alt: auth?.user?.name || 'User'
    }),
/*
    h("button", { onClick: handleLogout }, 
      `Logout ([${auth.user.name}]-[${auth.role}]-[${auth.token}])`
    )
*/

h("button", { onClick: handleLogout }, 
      `Logout ([${auth.user.name}]-[${auth.role}])`)

  ]);
}
// --------------------------------⛳️ //

// 🎾Theme logic and component UI -----
function ThemeSwitch({toggleTheme}) {
  return h(
    'button',
    {
      class: 'tv-theme-switch',
      'aria-label': 'Toggle theme',
      onclick: toggleTheme
    },
    [
      h('i', { class: 'fa-solid fa-moon' }),
      h('i', { class: 'fa-solid fa-sun' }),
      h('span', { class: 'switch-thumb' })
    ]
  );
}

function ThemeAuto({ getThemeSystem }) {
  return h(
    'button',
    {
      id: 'themeAuto',
      type: 'button',
      onclick: getThemeSystem,
    },
    [
      h('i', { class: 'fa-solid fa-rotate', 'aria-hidden': 'true' }),
      h('span', { class: 'label' }, 'OS'),
    ]
  );
}

function useNavLogic({
  auth,
  logout,
  toggleTheme,
  getThemeSystem
}) {
  const [open, setOpen] = useState(false);

  return {
    auth,
    open,
    setOpen,
    logout,
    toggleTheme,
    getThemeSystem
  };
}

function useNavController() {
  const auth = App.useStore(s => s.auth);

  return useNavLogic({
    auth,
    logout: App.Actions.Auth.logout,
    toggleTheme: () => {
      const next = App.Theme.toggle();
      updateStatus(next);
    },
    getThemeSystem: () => {
      App.Theme.resetToSystem();
      updateStatus(App.Theme.getResolvedTheme());
    }
  });
}

function Nav() {
  const {
    auth, open, setOpen,
    logout, toggleTheme, getThemeSystem
  } = useNavController();
  updateStatus(App.Theme.getResolvedTheme())

  return h("nav", { class: "nav" }, [

    // Left title
    h("span", {}, "My App"),

    // Lấy theme theo OS của thiết bị
    h(ThemeAuto, {getThemeSystem}),

    // Thay đổi theme của App - toggle
    h(ThemeSwitch, { toggleTheme }),

    // Right buttons area
    h("div", { class: "nav-right" }, [
      !auth.user && h(Link, {to:'/login', children: 'Login'}),

      // hiện thông tin khi login success
      auth.user && h(InfoLabel, {auth, logout}),

      // Đóng mở memu
      h("button", {
        class: "burger-btn",
        onClick: () => setOpen(true)
      }, "☰"),
    ]),

    // Right slide menu
    h(BurgerMenuRight, {
      open,
      onClose: () => setOpen(false),
      auth
    }),

    // Back To Top: backToTop.js
    //h(App.Components.BackToTop)
  ]);
}

// MOUNT MENU:
App.Router.navbarDynamic({ navbar: Nav })