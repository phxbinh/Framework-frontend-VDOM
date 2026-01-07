

/*
//✳️ ĐĂNG NHẬP ĐỂ VIẾT BÀI -----
function LoginPage() {

  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');

  // Fetch lên server để lấy thông tin user (name, role, token, ...) thể xác thực phiên đăng nhập -----
  const handleLogin = () => {
    if (!input) return alert('Nhập tên user');
    const saved = storage.get(DataNew.USERS, []);
    const found = saved.find(u => u.name === input && u.password === password);
    if (!found) return alert('Sai tên hoặc mật khẩu');

    const payload = {
      user: {role: found.role, name: found.name},
      name: input,
      role: found.role,
      // Token này chỉ sử dụng cho Demo
      token: input+'_abc',
      avatar: found.avatar,
      email: found.email
    }
    App.Actions.Auth.login(payload)

    App.Router.navigateTo('/');
  };

  return h('div', { className:'auth-form' },
    h('h2', {}, 'Đăng nhập'),
    h('input', { placeholder:'Tên user', value:input, onInput:e=>setInput(e.target.value) }),
    h('input', { type:'password', placeholder:'Mật khẩu', value:password, onInput:e=>setPassword(e.target.value) }),

    h('button', { onClick: handleLogin }, 'Đăng nhập'),
    
    h('button', { onClick:()=>App.Router.navigateTo('/') }, 'Huỷ')
  );
}
*/



/*
LoginPage
 ├─ useLoginLogic        (state form)
 ├─ useLoginController   (auth + storage + router)
 └─ LoginForm            (UI thuần)
*/

function useLoginLogic() {
  const { useState } = App.Hooks;

  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');

  return {
    input, setInput,
    password, setPassword
  };
}

function useLoginController() {
  const logic = useLoginLogic();

  function handleLogin() {
    const { input, password } = logic;

    if (!input) {
      alert('Nhập tên user');
      return;
    }

    const saved = storage.get(DataNew.USERS, []);
    const found = saved.find(
      u => u.name === input && u.password === password
    );

    if (!found) {
      alert('Sai tên hoặc mật khẩu');
      return;
    }

    const payload = {
      user: { role: found.role, name: found.name },
      name: input,
      role: found.role,
      token: input + '_abc',
      avatar: found.avatar,
      email: found.email
    };

    App.Actions.Auth.login(payload);
    App.Router.navigateTo('/');
  }

  function handleCancel() {
    App.Router.navigateTo('/');
  }

  return {
    ...logic,
    onLogin: handleLogin,
    onCancel: handleCancel
  };
}

function LoginForm({
  input, setInput,
  password, setPassword,
  onLogin,
  onCancel
}) {
  return h('div', { className: 'auth-form' }, [

    h('h2', null, 'Đăng nhập'),

    h('input', {
      placeholder: 'Tên user',
      value: input,
      oninput: e => setInput(e.target.value)
    }),

    h('input', {
      type: 'password',
      placeholder: 'Mật khẩu',
      value: password,
      oninput: e => setPassword(e.target.value)
    }),

    h('button', { onclick: onLogin }, 'Đăng nhập'),
    h('button', { onclick: onCancel }, 'Huỷ')
  ]);
}

function LoginPage() {
  const controller = useLoginController();
  return h(LoginForm, controller);
}