  // Khởi tạo theme (áp user theme nếu có)
  App.Theme.init();

  // Sử dụng cho UI thông báo trạng thái của theme
  function updateStatus(theme) {
    const status    = document.getElementById("themeStatus");
    if (status) {
    status.textContent = theme === "dark" ? "🌛 Dark" : "☀️ Light";
    }
  }
  // 1️⃣ Init UI theo theme hiện tại (user hoặc system)
  //updateStatus(App.Theme.getResolvedTheme());

  // 4️⃣ Lắng nghe mọi thay đổi theme (OS change / code khác)
  // Đăng ký gọi cập nhật khi có thay đổi, có thể dùng cho nhiều đăng ký
  App.Theme.onChange(updateStatus);