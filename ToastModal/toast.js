
// ==========
// TOAST STORE - cải thiện
App.Toast = {
  listeners: new Set(),

  show({ message, type = "info", duration = 4000, closable = true }) {
    const id = Date.now() + Math.random(); // tránh trùng id tốt hơn
    this.listeners.forEach(fn => fn({ id, message, type, duration, closable }));
  },

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
};

// TOAST COMPONENT - cải thiện
function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return App.Toast.subscribe(toast => {
      // Thêm toast với trạng thái ban đầu: chưa enter
      const newToast = { ...toast, entering: false };
      setToasts(prev => [...prev, newToast]);

      // Sau một tick (next frame), bật entering → trigger transition
      requestAnimationFrame(() => {
        setToasts(prev =>
          prev.map(t =>
            t.id === newToast.id ? { ...t, entering: true } : t
          )
        );
      });

      // Auto remove
      if (toast.duration > 0) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);

        setToasts(prev =>
          prev.map(t =>
            t.id === toast.id ? { ...t, _timer: timer } : t
          )
        );
      }
    });
  }, []);

const removeToast = (id) => {
  // Đầu tiên: thêm class exit
  setToasts(prev =>
    prev.map(t => t.id === id ? { ...t, exiting: true } : t)
  );

  // Sau thời gian transition, mới xóa thật
  setTimeout(() => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      if (toast?._timer) clearTimeout(toast._timer);
      return prev.filter(t => t.id !== id);
    });
  }, 300); // bằng thời gian transition
};



  return h("div", { className: "toast-wrap" },
    toasts.map(toast => h("div", {
      key: toast.id,
      //className: `toast toast-${toast.type} ${toast.entering ? 'toast-enter' : ''}`,
className: `toast toast-${toast.type} 
  ${toast.entering ? 'toast-enter' : ''} 
  ${toast.exiting ? 'toast-exit' : ''}`,
      onClick: () => toast.closable && removeToast(toast.id),
      style: { cursor: toast.closable ? 'pointer' : 'default' }
    },
      h("span", null, toast.message),
      toast.closable && h("button", {
        className: "toast-close",
        onClick: (e) => {
          e.stopPropagation();
          removeToast(toast.id);
        }
      }, "×")
    ))
  );
}

/* CSS - Cơ bản
.toast-wrap {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  padding: 12px 16px;
  border-radius: 8px;
  color: white;
  min-width: 250px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease;
}

.toast-enter {
  opacity: 1;
  transform: translateX(0);
}

.toast-info { background: #3498db; }
.toast-success { background: #2ecc71; }
.toast-error { background: #e74c3c; }
.toast-warning { background: #f39c12; }

.toast-close {
  margin-left: auto;
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0 8px;
}

.toast-exit {
  opacity: 0;
  transform: translateX(100%);
}

*/