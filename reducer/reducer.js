// ==========================
// 2) reducer
// ==========================
function authReducer(state, action) {
  switch (action.type) {
    case "AUTH_REGISTER":
    case "AUTH_LOGIN": {
      const p = action.payload || {};
      const auth = {
        user:  p.user || null,
        token: p.token || null,
        role: p.role ?? (p.user?.role ?? null),
        email: p.email ?? (p.user?.email ?? null),
        avatar: p.avatar ?? (p.user?.avatar ?? null),
        lastLogin: new Date().toISOString()
      };
      storage.set(DataNew.AUTH, auth);
      return { ...state, auth }
    };

    case "AUTH_LOGOUT": {
      storage.remove(DataNew.AUTH);
      return { ...state, auth: { user: null, token: null, role: null, avatar: null }};
    }

    default: return state;
  }
}

function countReducer(state, action) {
  switch (action.type) {
    case "COUNTER_INC": return { ...state, counter: { value: state.counter.value + 1 }};
    case "COUNTER_DEC": return { ...state, counter: { value: state.counter.value - 1 }};
    case "COUNTER_RESET": return { ...state, counter: { value: 0 }};
    default: return state;
  }
}

function postReducer(state, action) {
  switch (action.type) {


case 'ADD_POST': {
      const p = action.payload || {};
      const excerpt = p.excerpt || generateExcerptByWords(p.content, 35);

      const newPost = {
        id: p.id || `p_${Date.now()}`,
        title: p.title || '',
        content: p.content || '',
        excerpt,
        images: p.images || [],
        category: p.category || null,
        tags: p.tags || [],
        author: p.author || (state.auth.user?.name || 'Anonymous'),
        avatar: p.avatar || state.auth.avatar,
        // Mặc định đánh dấu đang kiểm duyệt
        flagged: true,
        status: p.status || 'published',
        createdAt: new Date().toISOString(),
        updatedAt: null,
        urlMarkdown: p.urlMarkdown || '',
      };

      DB.add(newPost);
      return { 
        ...state, 
        postsA: { postsDemo: syncPosts() }
        //draft: { title:'', content:'', images:[], category:null, tags:[], status:'draft', urlMarkdown:'' }
      };
    }


    case "POPULAR_POSTS":
      return {
        ...state,
        postsA: { postsDemo: syncPosts() }
    };

    case "UPDATE_POST": {
      // Gán thuộc tính trong payload
      const p = action.payload || {};
      const {id, fields } = p;

      // Lấy tất cả bài post trong data localStorage
      const posts = storage.get(DataNew.POSTS, []);

      // Tìm chỉ số của bài post trong mảng posts
      const index = posts.findIndex(p => p.id === id);

      if (index === -1) return console.warn("Post không tồn tại:", id);

      // Truyền giá trị mới trong mãng fields vào post
      const updated = {
        ...posts[index],
        ...fields,
        updatedAt: new Date().toISOString()
      };

      // Cập nhật bài viết được chỉnh sửa vào posts DB
      posts[index] = updated;
  
      // Lưu post từ chương trình lên DB store
      DB.update(p.id, updated);

      storage.set(DataNew.POSTS, posts);

      return {
        ...state,
        postsA: { postsDemo: syncPosts() }}
    }

    case 'FLAG_POST': {
     const { id, flagged } = action.payload || {};
     if (!id) return state;

     // 1) update DB (nếu DB.update có side-effect)
     // Dùng fetch data để gửi lên server
     DB.update(id, { flagged });

     // 2) update cache in-memory state postsA.postsDemo để UI re-render ngay
     const prevPosts = state.postsA?.postsDemo || [];
     const nextPosts = prevPosts.map(p => p.id === id ? { ...p, flagged } : p);

     return {
       ...state,
       postsA: { postsDemo: nextPosts }
     }
    };



case 'DELETE_POST': {
  const { id } = action.payload || {};
  if (!id) return state;

  // 1) Lấy danh sách posts hiện tại từ storage
  const posts = storage.get(DataNew.POSTS, []);

  // 2) Kiểm tra tồn tại
  const exists = posts.some(p => p.id === id);
  if (!exists) {
    console.warn("Post không tồn tại:", id);
    return state;
  }

  // 3) Xóa khỏi posts
  const nextPosts = posts.filter(p => p.id !== id);

  // 4) Cập nhật DB
  DB.delete(id);          // giả định DB có method delete
  storage.set(DataNew.POSTS, nextPosts);

  // 5) Sync lại state cho UI
  return {
    ...state,
    postsA: { postsDemo: syncPosts() }
  };
};



    default: return state;
  };
}

function userReducer(state, action) {
  switch (action.type) {
case "UPDATE_USER": {

// 🟠Gửi yêu cầu lên server -----
  // Cái này làm việc với DB ở backend
  const p = action.payload || {};
  const { name, fields } = p;
  if (!name) return state;

  // 1) Lấy users trong localStorage
  const users = storage.get(DataNew.USERS, []);

  // 2) Tìm index user cần update
  const index = users.findIndex(u => u.name === name);
  if (index === -1) return state;

  // 3) Merge field mới
  users[index] = {
    ...users[index],
    ...fields
  };

  // 4) Lưu lại storage
  storage.set(DataNew.USERS, users);

// 🟢Nhận res từ server -----
  // 5) Nếu user hiện tại đang login → update luôn state.auth
  let newAuth = state.auth;
  if (state.auth.user?.name === name) {
    newAuth = {
      ...state.auth,
      ...fields,
      user: { name }
    };
    storage.set(DataNew.AUTH, newAuth);
  }

  // 6) Trả về state mới
  return {
    ...state,
    auth: newAuth
  };
}
   default: return state;
  }
}

// Gộp các reducer: =====
function combineReducers(...reducers) {
  return (state, action) =>
    reducers.reduce((s, r) => r(s, action), state);
}

const reducer = combineReducers(
  authReducer,
  postReducer,
  countReducer,
  userReducer
);
