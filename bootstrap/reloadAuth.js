// ==========================
// 4) Khôi phục auth khi reload app 
// Chỉ chạy một lần khi khởi động app
// ==========================
function reloadAuth() {
  const savedAuth = storage.get(DataNew.AUTH, null);
  if (savedAuth) {
    App.Store.state = {
      ...App.Store.state,
      auth: savedAuth
    };
  }
}
reloadAuth();

