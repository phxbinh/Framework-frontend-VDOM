// CÁC COMPONENT KIỂM TRA CẤU TRÚC DỮ LIỆU
// ✳️❤️Lấy tất cả thông tin của users
function UserList() {
  const { h } = App.VDOM;
  const users = storage.get(DataNew.USERS, []);
  return h('pre', null, JSON.stringify(users, null, 2));
}

// ✳️❤️Lấy tất cả thông tin của bài posts
function PostList() {
  const { h } = App.VDOM;
  const posts = storage.get(DataNew.POSTS, []);
  return h('pre', null, JSON.stringify(posts, null, 2));
}

// ✳️❤️Lấy thuộc tính và giá trị của một object bất kỳ
function RenderObject() {
  const { h } = App.VDOM;
  const users = storage.get(DataNew.USERS, []);
  return h('div', { class: 'obj-view' },
    Object.entries(users).map(([key, value]) =>
      h('div', { class: 'row' },
        h('strong', null, key + ': '),
        h('span', null, JSON.stringify(value))
      )
    )
  );
}

// ✳️❤️Lấy thuộc tính và giá trị của một object bất kỳ
function AuthLogin() {
  const { h } = App.VDOM;
  const user = storage.get(DataNew.AUTH, []);

  if(!user.user) return h('span', null, "Bạn chưa đăng nhập");

  return h('div', { class: 'obj-view' },
    Object.entries(user).map(([key, value]) =>
      h('div', { class: 'row' },
        h('strong', null, key + ': '),
        h('span', null, JSON.stringify(value))
      )
    )
  );
}

// ===========
//Cách  |  Tác dụng  |  Dùng khi
//Object.keys(obj) | Lấy danh sách keys | Render đơn giản
//Object.values(obj) | Lấy danh sách values | Không cần key
//Object.entries(obj) | Lấy cả key & value | Duyệt object để render UI (chuẩn nhất)
// ===========