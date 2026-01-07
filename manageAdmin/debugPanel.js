// debugLogic.js - Chỉ chứa logic xử lý dữ liệu, không có h() hay UI
const DebugLogic = {
  // Đảm bảo dữ liệu luôn là mảng hợp lệ
  getUsers() {
    const data = storage.get(DataNew.USERS);
    return Array.isArray(data) ? data : [];
  },

  getPosts() {
    const data = storage.get(DataNew.POSTS);
    return Array.isArray(data) ? data : [];
  },

  getAuth() {
    return storage.get(DataNew.AUTH, null);
  },

  // Hàm lọc chung theo từ khóa
  filterData(dataArray, searchTerm) {
    if (!searchTerm || !searchTerm.trim()) return dataArray;

    const term = searchTerm.toLowerCase();
    return dataArray.filter(item =>
      JSON.stringify(item).toLowerCase().includes(term)
    );
  },

  // Lấy danh sách keys từ phần tử đầu tiên (an toàn)
  getKeys(dataArray) {
    if (dataArray.length === 0) return [];
    return Object.keys(dataArray[0]);
  },

  // Giới hạn số lượng hiển thị để tránh lag
  limitItems(items, max = 100) {
    return items.slice(0, max);
  }
};

// DebugPanel.js - Chỉ chứa UI và useState
function DebugPanel() {
  //const { h, useState } = App.VDOM;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('users');

  // Lấy dữ liệu từ logic
  const users = DebugLogic.getUsers();
  const posts = DebugLogic.getPosts();
  const auth = DebugLogic.getAuth();

  // Hàm render bảng chung
  const renderTable = (dataArray, title) => {
    const filtered = DebugLogic.filterData(dataArray, searchTerm);
    const limited = DebugLogic.limitItems(filtered);
    const keys = DebugLogic.getKeys(dataArray);

    if (dataArray.length === 0) {
      return h('p', { style: 'color: #999; padding: 20px;' }, `Không có dữ liệu ${title}`);
    }

    return h('div', { class: 'debug-table-container' },
      h('h3', null, `${title} (${filtered.length}/${dataArray.length})`),
      h('table', { class: 'debug-table' },
        h('thead', null,
          h('tr', null, keys.map(key => h('th', null, key)))
        ),
        h('tbody', null,
          limited.map((item, idx) =>
            h('tr', { key: idx },
              keys.map(key => {
                const value = item[key];

                // Xử lý đặc biệt cho images
                if (key === 'images' && Array.isArray(value) && value.length > 0) {
                  return h('td', { key },
                    h('div', { style: 'display: flex; gap: 8px; flex-wrap: wrap;' },
                      value.slice(0, 6).map((src, i) =>
                        h('img', {
                          src,
                          alt: `img-${i}`,
                          style: 'width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #555;'
                        })
                      ),
                      value.length > 6 && h('span', { style: 'align-self: center; color: #aaa;' }, `... +${value.length - 6}`)
                    )
                  );
                }

                // Các giá trị khác
                const text = typeof value === 'object'
                  ? JSON.stringify(value, null, 0).slice(0, 150) + (JSON.stringify(value).length > 150 ? '...' : '')
                  : String(value);

                return h('td', { key },
                  h('pre', { style: 'margin: 0; white-space: pre-wrap; font-family: inherit;' }, text)
                );
              })
            )
          )
        )
      )
    );
  };

  // Render Auth
  const renderAuth = () => {
    if (!auth || !auth.user) {
      return h('p', { style: 'color: #e74c3c; font-weight: bold; padding: 20px;' }, 'Bạn chưa đăng nhập');
    }

    return h('div', { class: 'obj-view' },
      h('h3', null, 'Thông tin Auth'),
      Object.entries(auth).map(([key, value]) =>
        h('div', { class: 'row', key },
          h('strong', null, key + ': '),
          h('pre', null, JSON.stringify(value, null, 2))
        )
      )
    );
  };

  // UI chính
  return h('div', { class: 'debug-panel' },
    h('div', { class: 'debug-header' },
      h('h2', null, '🔧 Debug Panel'),
      h('input', {
        type: 'text',
        placeholder: 'Tìm kiếm toàn bộ dữ liệu... (title, author, tag, id...)',
        value: searchTerm,
        oninput: e => setSearchTerm(e.target.value),
        style: 'padding: 10px; width: 100%; margin-top: 10px; font-size: 16px; box-sizing: border-box;'
      })
    ),

    h('div', { class: 'debug-tabs' },
      h('button', {
        class: selectedTab === 'users' ? 'active' : '',
        onclick: () => setSelectedTab('users')
      }, `Users (${users.length})`),
      h('button', {
        class: selectedTab === 'posts' ? 'active' : '',
        onclick: () => setSelectedTab('posts')
      }, `Posts (${posts.length})`),
      h('button', {
        class: selectedTab === 'auth' ? 'active' : '',
        onclick: () => setSelectedTab('auth')
      }, 'Auth'),
    ),

    h('div', { class: 'debug-content' },
      selectedTab === 'users' && renderTable(users, 'Danh sách Users'),
      selectedTab === 'posts' && renderTable(posts, 'Danh sách Posts'),
      selectedTab === 'auth' && renderAuth()
    )
  );
}