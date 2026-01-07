(function (App) {
  const { h, memo } = App.VDOM;
  const { useState, useEffect, useRef } = App.Hooks;

  // ===== ⚡ App.UI.Base namespace =====
  const UI   = App.UI  = App.UI  || {};
  const Base = UI.Base = UI.Base || {};

  // ==========================
  // ✅ Base.Modal
  // ==========================
Base.Modal = memo(function Modal(props) {
  const {
    show = false,
    title = "Thông báo",
    children,
    onClose = () => {},
    closeOnOverlay = true,
    showCloseButton = true,
    footer = null
  } = props;

  const [visible, setVisible] = useState(show);
  const [animClass, setAnimClass] = useState("");

  // Điều khiển enter / leave
useEffect(() => {
  if (show) {
    setVisible(true);
    setAnimClass("modal-pre-enter");   // bước 1: trạng thái trước animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimClass("modal-enter");   // bước 2: trạng thái animation thực tế
      });
    });
  } else {
    setAnimClass("modal-leave");
  }
}, [show]);


  // Sau khi leave xong → remove khỏi DOM
  const handleAnimEnd = () => {
    if (!show) setVisible(false);
  };

  if (!visible) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC để đóng
  useEffect(() => {
    // Gán Keyboard để sử dụng: là một hàm
    const onKey = (e) => e.key === "Escape" && onClose();
    // Lắng nghe sự kiện nhấn nút trên keyboard
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return h("div", { class: "modal-overlay", onclick: handleOverlayClick },
    h("div", {
      class: `modal ${animClass}`,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": title,
      onanimationend: handleAnimEnd
    },
      (title || showCloseButton) && h("div", { class: "modal-header" },
        title && h("span", { class: "modal-title", style: "font-weight: 700" }, title),
        showCloseButton &&
          h("button", {
            class: "close-btn",
            onclick: onClose,
            "aria-label": "Close"
          }, "✖")
      ),
      h("div", { class: "modal-body" }, children),
      footer && h("div", { class: "modal-footer" },
        typeof footer === "function" ? footer() : footer
      )
    )
  );
});

Base.Modal.meta = {
  name: "Modal",
  category: "Base",
  props: {
    show: "boolean",
    title: "string",
    children: "VNode | string",
    onClose: "function",
    closeOnOverlay: "boolean",
    showCloseButton: "boolean",
    footer: "VNode | function | null"
  }
};

function injectStyleModalConfirm() {
    const STYLE_ID = "style-modal-confirm";
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `

    .modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0;
      background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; }

    .close-btn { background:none; border:none; cursor:pointer; float:right; font-size: 1.5rem;}

.modal {
  background: white;
  padding: 0.2rem;
  border-radius: 6px;
  width: 380px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  animation-duration: 0.25s;
  animation-fill-mode: forwards;
  opacity: 1;                /* tránh flash */
  transform: translateX(100%); /* tránh flash */
  z-index: 100;
}

/* Trạng thái chuẩn bị (chưa animate) */
.modal-pre-enter {
  opacity: 0;
  transform: translateX(100%);
}

/* Animate vào */
.modal-enter {
  animation-name: modal-slide-in;
}

/* Animate ra */
.modal-leave {
  animation-name: modal-slide-out;
}

@keyframes modal-slide-in {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

@keyframes modal-slide-out {
  from { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(100%); opacity: 0; }
}
`;

document.head.appendChild(style);
}


  //injectStyleModalConfirm();

})(window.App || (window.App = {}));




(function (App) {
  const Modal = App.Modal = {};

  let openHandler = null;

  Modal._register = fn => {
    openHandler = fn;
  };

  Modal._unregister = () => {
    openHandler = null;
  };

  Modal.confirm = function ({
    title = "Xác nhận",
    content = "",
    confirmText = "Xác nhận",
    cancelText = "Huỷ",
    danger = false,
    closeOnOverlay = false,
    disableEsc = false,
    onConfirm,
    onCancel
  }) {
    if (!openHandler) {
      console.warn("ModalHost chưa được mount");
      return;
    }

    openHandler({
      type: "confirm",
      title,
      content,
      confirmText,
      cancelText,
      danger,
      closeOnOverlay,
      disableEsc,
      onConfirm,
      onCancel
    });
  };

})(window.App);



function ModalHost() {
  const { h } = App.VDOM;
  const { useState, useEffect } = App.Hooks;

  const [config, setConfig] = useState(null);

  useEffect(() => {
    App.Modal._register(setConfig);
    return () => App.Modal._unregister();
  }, []);

  if (!config) return null;

  const {
    title,
    content,
    confirmText,
    cancelText,
    danger,
    closeOnOverlay,
    disableEsc,
    onConfirm,
    onCancel
  } = config;

  function handleClose() {
    onCancel?.();
    setConfig(null);
  }

  function handleConfirm() {
    onConfirm?.();
    setConfig(null);
  }

  return App.VDOM.h(App.UI.Base.Modal, {
    show: true,
    title,
    closeOnOverlay,
    onClose: disableEsc ? () => {} : handleClose,
    showCloseButton: !danger,

    children: content,

    footer: () =>
      App.VDOM.h("div", { className: "modal-confirm-footer" }, [
        App.VDOM.h(
          "button",
          { className: "btn", onClick: handleClose },
          cancelText
        ),

        App.VDOM.h(
          "button",
          {
            className: danger ? "btn btn-danger" : "btn btn-primary",
            onClick: handleConfirm
          },
          confirmText
        )
      ])
  });
}


/* CSS
.modal-confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #1677ff;
  color: #fff;
}

.btn-danger {
  background: #e74c3c;
  color: #fff;
}

*/



