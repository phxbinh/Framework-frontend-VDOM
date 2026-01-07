
//🅾️✅✅✳️❤️🅾️✅🅾️🅾️✳️❤️✳️✳️✳️
// ===========
// Profile Form for Edit user profile
// ===========
function useInputRowLogic({ value, onChange }) {
  const handleInput = (e) => {
    onChange && onChange(e.target.value);
  };

  return {
    value,
    handleInput
  };
}

function InputRow({ label, type = "text", value, oninput, disabled }) {
  const { h } = App.VDOM;

  const {
    value: inputValue,
    handleInput
  } = useInputRowLogic({
    value,
    onChange: oninput
  });

  return h('div', { class: 'form-row' }, [
    h('label', null, label),
    h('input', {
      type,
      value: inputValue,
      disabled,
      onInput: handleInput
    })
  ]);
}

function useSelectRowLogic({ value, onChange }) {
  const handleChange = (e) => {
    onChange && onChange(e.target.value);
  };

  return {
    value,
    handleChange
  };
}

function SelectRow({ label, value, onchange, options }) {
  const { h } = App.VDOM;

  const {
    value: selected,
    handleChange
  } = useSelectRowLogic({
    value,
    onChange: onchange
  });

  return h('div', { class: 'form-row' }, [
    h('label', null, label),
    h('select', {
      value: selected,
      onChange: handleChange
    },
      options.map(opt =>
        h('option', { value: opt.value }, opt.label)
      )
    )
  ]);
}

function useProfileController({ auth }) {

  const username = auth?.user?.name;
  if (!username) return { status: "guest" };

  const users = storage.get(DataNew.USERS, []);
  const user = users.find(u => u.name === username);
  if (!user) return { status: "not_found" };

  const saveProfile = (fields) => {
    App.Actions.User.update({
      name: username,
      fields
    });

    // 🔥 chỉ trả kết quả
    return { ok: true };
  };

  return {
    status: "ok",
    user,
    saveProfile
  };
}

function useProfileLogic({ user, onSave }) {

  const [email, setEmail] = useState(user.email || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [password, setPassword] = useState(user.password || '');
  const [role, setRole] = useState(user.role || 'user');

  const [message, setMessage] = useState(null);

  const handleSave = () => {
    const result = onSave({
      email,
      avatar,
      password,
      role
    });

    if (result?.ok) {
      setMessage("✅ Cập nhật thành công!");
    }
  };

  return {
    email, setEmail,
    avatar, setAvatar,
    password, setPassword,
    role, setRole,
    message,
    handleSave
  };
}

function ProfileForm({ auth }) {
  const { h } = App.VDOM;

  const controller = useProfileController({ auth });

  if (controller.status === "guest") {
    return h('div', { class: 'profile-editor' },
      'Bạn cần đăng nhập để chỉnh sửa profile.');
  }

  if (controller.status === "not_found") {
    return h('div', null, "User không tồn tại!");
  }

  const {
    user,
    saveProfile
  } = controller;

const {
  email, setEmail,
  avatar, setAvatar,
  password, setPassword,
  role, setRole,
  message,
  handleSave
} = useProfileLogic({
  user,
  onSave: saveProfile
});

useEffect(() => {
  if (message) {
    //Toast.success(message);
    alert('Update success!')
  }
}, [message]);

  return h('div', { class: 'profile-editor' }, [

    h('h2', null, "Chỉnh sửa thông tin cá nhân"),

    h('div', { class: 'avatar-preview-block' }, [
      h('img', {
        src: avatar || 'https://placehold.co/100x100?text=Avatar',
        class: 'avatar-preview',
        style: {
          borderRadius: "50%",
          width: '50px',
          height: '50px'
        }
      }),
      h('div', { class: 'small-note' }, "Preview Avatar")
    ]),

    h(InputRow, {
      label: "Username",
      value: user.name,
      disabled: true
    }),

    h(InputRow, {
      label: "Email",
      value: email,
      oninput: setEmail
    }),

    h(InputRow, {
      label: "Avatar URL",
      value: avatar,
      oninput: setAvatar
    }),

    h(InputRow, {
      label: "Password",
      type: "password",
      value: password,
      oninput: setPassword
    }),

    h(SelectRow, {
      label: "Role",
      value: role,
      onchange: setRole,
      options: [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' }
      ]
    }),

    h('button', {
      class: 'save-btn',
      onclick: handleSave
    }, "Lưu thay đổi")
  ]);
}