function copyLocalData(fromKey, toKey, transform) {
  try {
    const raw = localStorage.getItem(fromKey);
    if (!raw) return false; // không có dữ liệu gốc

    let data = JSON.parse(raw);

    // Nếu truyền hàm transform thì transform dữ liệu
    if (typeof transform === 'function') {
      data = transform(data);
    }

    localStorage.setItem(toKey, JSON.stringify(data));
    return true;

  } catch (err) {
    console.error("copyLocalData error:", err);
    return false;
  }
}

/*
1. Copy giữ nguyên dữ liệu
copyLocalData('users', 'users_backup');

2. Copy có thay đổi cấu trúc dữ liệu
copyLocalData('posts', 'posts_v2', (oldPosts) => {
  return oldPosts.map(p => ({
    ...p,
    createdAt: p.createdAt || Date.now(),
    updatedAt: Date.now()
  }));
});

3. Copy có lọc dữ liệu
copyLocalData('messages', 'messages_short', (arr) => arr.slice(0, 20));
*/