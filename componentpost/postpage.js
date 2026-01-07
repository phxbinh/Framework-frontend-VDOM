
function usePostPageLogic() {
  const posts = App.useStore(s => s.postsA.postsDemo || []);
  const auth = App.useStore(s => s.auth);

  const [filter, setFilter] = useState({
    category: null,
    tag: null
  });

  // Load data 1 lần
  useEffect(() => {
    App.Actions.PostA.set();
  }, []);

  function filterByCategory(cat) {
    setFilter(prev => ({
      category: prev.category === cat ? null : cat,
      tag: null
    }));
  }

  function filterByTag(tag) {
    setFilter(prev => ({
      category: null,
      tag: prev.tag === tag ? null : tag
    }));
  }

  const filteredPosts = posts.filter(p => {
    if (filter.category) return p.category === filter.category;
    if (filter.tag) return p.tags?.includes(filter.tag);
    return true;
  });

// dùng với toast khi xoá bài viết
// Chỉ có admin mới có quyền xoá bài viết
const isAdmin = auth.role === 'admin';

function onDeletePost_(post) {
    if (!isAdmin) return;

    const ok = window.confirm(
      `Bạn chắc chắn muốn xoá bài:\n"${post.title}" ?`
    );
    if (!ok) return;

    try {
      //App.Actions.PostA.remove(post.id);

App.Actions.PostA.delete({
     id: post.id,
    })

      App.Toast.show({
        message: "🗑️ Đã xoá bài viết",
        type: "success"
      });
    } catch (e) {
      App.Toast.show({
        message: "❌ Xoá thất bại",
        type: "error"
      });
    }
  }


function onDeletePost__(post) {
  if (!isAdmin) return;
  App.Modal.confirm({
    title: "Xoá bài viết",
    content: `Bạn có chắc muốn xoá "${post.title}" không?`,
    confirmText: "Xoá",
    danger: true,

    onConfirm() {
      App.Actions.PostA.delete({
       id: post.id,
      })

      App.Toast.show({
        type: "success",
        message: "🗑️ Đã xoá bài viết"
      });
    }
  });
}

function onDeletePost(post) {
  if (!isAdmin) return;
  App.Modal.confirm({
    title: "Xoá bài viết có try..catch",
    content: `Bạn có chắc muốn xoá "${post.title}" không?`,
    confirmText: "Xoá",
    danger: true,

    onConfirm() {
      try {
        // Xoá bài post
        App.Actions.PostA.delete({
         id: post.id,
        })

        // Thông báo thành công
        App.Toast.show({
          type: "success",
          message: "🗑️ Đã xoá bài viết"
        });
      } catch (err) {
        // Nếu lỗi → show toast lỗi
        console.error(err);
        App.Toast.show({
          type: "error",
          message: "❌ Xoá bài thất bại, thử lại sau"
        });
      }
    }
  });
}


function onViewDetail() {
  App.Toast.show({
    type: "warning",
    message: "Nội dung bài viết đang kiểm duyệt"
  });
}


  return {
    posts: filteredPosts,
    rawPosts: posts,
    auth,
    filter,
    filterByCategory,
    filterByTag,
    onDeletePost,
    onViewDetail
  };
}

function usePostPageController() {
  const logic = usePostPageLogic();

  return {
    posts: logic.posts,
    auth: logic.auth,

    filterInfo: logic.filter,

    onFilterCategory: logic.filterByCategory,
    onFilterTag: logic.filterByTag,
    onDeletePost: logic.onDeletePost,
    onViewDetail: logic.onViewDetail
  };
}


function PostPageForm({
  posts,
  auth,
  filterInfo,
  onFilterCategory,
  onFilterTag,
  onDeletePost,
  onViewDetail
}) {
  return h("div", { className: "card" }, [
    h('h3', null, "===== Blog posts ====="),

    filterInfo.category &&
      h('div', {
        style: { marginBottom: '10px', fontSize: '12px' }
      }, `Đang lọc Category: ${filterInfo.category}`),

    filterInfo.tag &&
      h('div', {
        style: { marginBottom: '10px', fontSize: '12px' }
      }, `Đang lọc Tag: ${filterInfo.tag}`),


h('div', {className: "card post-all"},

    ...posts.map(p =>
      h(PostItem, {
        p,
        auth,
        onFilterCategory,
        onFilterTag,
        onDelete: () => onDeletePost(p),
        onView: () => onViewDetail()
      })
    )

),


  h(ModalHost),

  h(ToastContainer)
  
  ]);
}


function PostPage() {
  const controller = usePostPageController();
  return h(PostPageForm, controller);
}