// 📦 db.js – module DB giả lập (bạn có thể giữ file riêng)
const DB = {
  key: 'posts',

  getAll() {
  try {
    const data = JSON.parse(localStorage.getItem(this.key) || '[]');
    // Bổ sung excerpt nếu chưa có
    return data.map(post => ({
      ...post,
      excerpt: post.excerpt || generateExcerptByWords(post.content, 35)
    }));
  } catch (err) {
    console.warn('⚠️ Lỗi đọc dữ liệu từ DB:', err);
    return [];
  }
},

  saveAll(posts) {
    localStorage.setItem(this.key, JSON.stringify(posts));
  },

  add(post) {
    const posts = this.getAll();
    posts.unshift(post);
    this.saveAll(posts);
    return post;
  },

  update(id, data) {
    const posts = this.getAll();
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return null;
    posts[idx] = { ...posts[idx], ...data, updatedAt: new Date().toISOString() };
    this.saveAll(posts);
    return posts[idx];
  },

  getById(key = 'posts', id) {
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    return list.find(p => p.id === id) || null;
  },

  delete(id) {
    const posts = this.getAll().filter(p => p.id !== id);
    this.saveAll(posts);
    return posts;
  },

removeField(id, fieldName) {
  const posts = this.getAll();
  const idx = posts.findIndex(p => p.id === id);
  if (idx === -1) return null;

  // Nếu field không tồn tại → bỏ qua
  if (posts[idx].hasOwnProperty(fieldName)) {
    delete posts[idx][fieldName];
  }

  posts[idx].updatedAt = new Date().toISOString();
  this.saveAll(posts);

  return posts[idx];
},
//DB.removeField('p_12345', 'excerpt');

removeFieldFromAll(fieldName) {
  const posts = this.getAll();

  const updated = posts.map(post => {
    // Xoá field nếu tồn tại
    if (post.hasOwnProperty(fieldName)) {
      delete post[fieldName];
    }
    return {
      ...post,
      updatedAt: new Date().toISOString()
    };
  });

  this.saveAll(updated);
  return updated;
},

//DB.removeFieldFromAll('excerpt');

};


// ⚙️ Helper để sync DB -> state
function syncPosts() {
  return DB.getAll();
}













