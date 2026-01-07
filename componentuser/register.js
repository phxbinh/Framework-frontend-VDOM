

/*
//✳️ ĐĂNG KÝ TÀI KHOẢN USER MỚI -----
function Register() {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [payload, setPayload] = useState({ name: "", role: role });

  useEffect(() => {
    setPayload({ name: input, role });
  }, [input, role]);

  const handleRegister = () => {
    if (!input || !password) return alert('Nhập đủ tên user và password');

    const saved = storage.get(DataNew.USERS, []);
    if (saved.some(u => u.name === input)) return alert('User đã tồn tại');

    const newUser = { name: input, password, role };

    storage.set(DataNew.USERS, [...saved, newUser]);

    App.Actions.Auth.login(payload);

    alert('Đăng ký thành công');
  };

  return h('div', { className:'auth-form' },
    h('h2', {}, 'Đăng ký'),
    h('input', { placeholder:'Tên user', value:input, onInput:e=>setInput(e.target.value) }),
    h('input', { type:'password', placeholder:'Mật khẩu', value:password, onInput:e=>setPassword(e.target.value) }),
    h('select', { value:role, onChange:e=>setRole(e.target.value) },
      h('option', { value:'user' }, 'Người dùng'),
      h('option', { value:'admin' }, 'Admin')
    ),
    h('button', { onClick: handleRegister }, 'Đăng ký'),
    h('button', { onClick:()=>App.Router.navigateTo('/') }, 'Huỷ')
  );
}
*/



/*
Register
 ├─ useRegisterLogic        (state + derive payload)
 ├─ useRegisterController   (validate + storage + auth)
 └─ RegisterForm            (UI thuần)
*/

function useRegisterLogic() {
  const { useState, useEffect } = App.Hooks;

  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [payload, setPayload] = useState({ name: '', role: 'user' });

  useEffect(() => {
    setPayload({ name: input, role });
  }, [input, role]);

  return {
    input, setInput,
    password, setPassword,
    role, setRole,
    payload
  };
}

function useRegisterController() {
  const logic = useRegisterLogic();

  function handleRegister() {
    const { input, password, role, payload } = logic;

    if (!input || !password) {
      alert('Nhập đủ tên user và password');
      return;
    }

    const saved = storage.get(DataNew.USERS, []);
    if (saved.some(u => u.name === input)) {
      alert('User đã tồn tại');
      return;
    }

    const newUser = { name: input, password, role };
    storage.set(DataNew.USERS, [...saved, newUser]);

    App.Actions.Auth.login(payload);

    alert('Đăng ký thành công');
  }

  function handleCancel() {
    App.Router.navigateTo('/');
  }

  return {
    ...logic,
    onRegister: handleRegister,
    onCancel: handleCancel
  };
}

function RegisterForm({
  input, setInput,
  password, setPassword,
  role, setRole,
  onRegister,
  onCancel
}) {
  return h('div', { className: 'auth-form' }, [

    h('h2', null, 'Đăng ký'),

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

    h('select', {
      value: role,
      onchange: e => setRole(e.target.value)
    }, [
      h('option', { value: 'user' }, 'Người dùng'),
      h('option', { value: 'admin' }, 'Admin')
    ]),

    h('button', { onclick: onRegister }, 'Đăng ký'),
    h('button', { onclick: onCancel }, 'Huỷ')
  ]);
}

function Register() {
  const controller = useRegisterController();
  return h(RegisterForm, controller);
}