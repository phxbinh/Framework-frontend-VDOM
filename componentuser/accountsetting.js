


/*
// Sau khi đăng nhập thành công thì sẽ gọi được component này: (route: /settings)
function AccountSetting() {
  //const { h, Hooks } = App.VDOM;
  //const { useState } = Hooks;
  const auth = App.useStore(s=>s.auth)

  const [tab, setTab] = useState('profile');
  const currentUser = auth.user?.name;

  if (!currentUser) {
    return h('div', { className: 'account-box' },
      h('p', { style: { color: '#888' } }, '⚠️ Vui lòng đăng nhập để chỉnh sửa tài khoản.')
    );
  }

  return h('div', { className: 'account-box' },
    h('h3', {}, `⚙️ Quản lý tài khoản - ${currentUser}`),

    h('div', { className: 'account-tabs' },
      ['profile', 'password'].map(t =>
        h('button', {
          className: tab === t ? 'active' : '',
          onClick: () => setTab(t)
        }, t === 'profile' ? 'Thông tin' : 'Mật khẩu')
      )
    ),

    tab === 'profile' &&
      h(ProfileForm, { auth }),

    tab === 'password' &&
      h(PasswordForm, { auth })
  );
}
*/



/*
AccountSetting
 ├─ useAccountSettingLogic
 └─ AccountSettingView
     ├─ AccountTabs
     └─ TabContent
*/

function useAccountSettingLogic() {
  const { useState } = App.Hooks;
  const auth = App.useStore(s => s.auth);

  const [tab, setTab] = useState('profile');
  const currentUser = auth.user?.name;

  return {
    auth,
    tab,
    setTab,
    currentUser
  };
}

function AccountSettingView({ auth, tab, setTab, currentUser }) {
  if (!currentUser) {
    return h('div', { className: 'account-box' },
      h('p', { style: { color: '#888' } },
        '⚠️ Vui lòng đăng nhập để chỉnh sửa tài khoản.'
      )
    );
  }

  return h('div', { className: 'account-box' }, [
    h('h3', null, `⚙️ Quản lý tài khoản - ${currentUser}`),

    h(AccountTabs, { tab, setTab }),

    h(TabContent, { tab, auth })
  ]);
}

function AccountTabs({ tab, setTab }) {
  return h('div', { className: 'account-tabs' },
    ['profile', 'password'].map(t =>
      h('button', {
        className: tab === t ? 'active' : '',
        onClick: () => setTab(t)
      }, t === 'profile' ? 'Thông tin' : 'Mật khẩu')
    )
  );
}

/*
function TabContent({ tab, auth }) {
  if (tab === 'profile') return h(ProfileForm, { auth });
  if (tab === 'password') return h(PasswordForm, { auth });
  return null;
}
*/

function TabContent({ tab, auth }) {
  return h('div', { className: 'tab-content' }, [
    tab === 'profile' && h(ProfileForm, { auth }),
    tab === 'password' && h(PasswordForm, { auth })
  ]);
}

function AccountSetting() {
  const logic = useAccountSettingLogic();
  return h(AccountSettingView, logic);
}