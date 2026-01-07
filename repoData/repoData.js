// Copy data from DataOld to DataNew for Demo or Tester - repo Data

const DataOld = Object.freeze({
  USERS: 'users',
  AUTH: 'autho',
  POSTS: 'posts'
});

const DataNew = Object.freeze({
  USERS: 'usersD',
  AUTH: 'authD',
  POSTS: 'postsD'
});

// ĐANG SỬ DỤNG VỚI DataNew -----
//copyLocalData(DataOld.USERS, DataNew.USERS);
//copyLocalData(DataOld.POSTS, DataNew.POSTS);

// Sử dụng tên dữ liệu mới để lấy dữ liệu từ DB. Trong DB có nhiều loại dữ liệu khác nhau (Posts, Products, Service, Users, ... )
DB.key = DataNew.POSTS;
//DB.removeFieldFromAll('fields');