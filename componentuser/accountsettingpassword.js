

//🅾️✅✅✳️❤️🅾️✅🅾️🅾️✳️❤️✳️✳️✳️
// ===========
// Password Form for Edit user password
// Làm việc ở backend
// ===========
App.Services = App.Services || {};
App.Services.Account = {
  changePassword({ auth, oldPw, newPw, confirmPw }) {
 
    const users = storage.get(DataNew.USERS, []);
    const currentUser = auth.user?.name;

    const userIndex = users.findIndex(u => u.name === currentUser);

    if (!oldPw || !newPw || !confirmPw) return alert('Nhập đủ thông tin');
    if (newPw !== confirmPw) return alert('Mật khẩu mới không khớp');
    if (users[userIndex].password !== oldPw) return alert('Mật khẩu cũ sai');

    // Thay đổi pw của user
    users[userIndex].password = newPw;

    // Lưu users vào DB giả lập
    storage.set(DataNew.USERS, users);

    alert('✅ Đổi mật khẩu thành công!');
    App.Router.navigateTo('/');
  }
};

// Component thay đổi pass word ---
// 🎾Logic thay đổi password -----
function usePasswordForm({ auth }) {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (!oldPw || !newPw || !confirmPw) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (newPw !== confirmPw) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await App.Services.Account.changePassword({
        auth,
        oldPw,
        newPw,
        confirmPw
      });
    } catch (e) {
      setError(e.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return {
    oldPw, newPw, confirmPw,
    setOldPw, setNewPw, setConfirmPw,
    submit,
    loading,
    error
  };
}

function PasswordForm({ auth }) {
  const f = usePasswordForm({ auth });

  return h('div', { className: 'account-section' }, [
    h('label', null, 'Mật khẩu hiện tại'),
    h('input', {
      type: 'password',
      value: f.oldPw,
      onInput: e => f.setOldPw(e.target.value)
    }),

    h('label', null, 'Mật khẩu mới'),
    h('input', {
      type: 'password',
      value: f.newPw,
      onInput: e => f.setNewPw(e.target.value)
    }),

    h('label', null, 'Xác nhận mật khẩu mới'),
    h('input', {
      type: 'password',
      value: f.confirmPw,
      onInput: e => f.setConfirmPw(e.target.value)
    }),

    f.error && h('p', { class: 'error' }, f.error),

    h('button', {
      onClick: f.submit,
      disabled: f.loading
    }, f.loading ? 'Đang xử lý...' : '🔐 Đổi mật khẩu')
  ]);
}