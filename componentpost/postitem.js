
/*
PostItem
 ├─ usePostItemLogic      (business + permission)
 ├─ usePostItemController (điều phối hành vi)
 └─ PostItemView          (UI thuần)
     ├─ PostMeta
     ├─ PostCategory
     ├─ PostTags
     ├─ PostImages
     └─ PostActions
*/

function usePostItemLogic({ p, auth }) {
  const currentUser = auth.user?.name;
  const role = auth.role || 'user';

  const isAuthor = p.author === currentUser;
  const isAdmin = role === 'admin';

  const canEdit = isAuthor;

  // Cho phép chủ bài viết và admin xoá bài viết
  //const canDelete = isAuthor || isAdmin;

  // Chỉ có admin được phép xoá bài
  const canDelete = isAdmin;

  const authorAvatar =
    p.avatar ||
    `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
      p.author || 'Anonymous'
    )}`;

  const excerpt = p.excerpt || generateExcerptByWords(p.content, 35);

  return {
    authorAvatar,
    excerpt,

    isAdmin,
    canEdit,
    canDelete
  };
}

function usePostItemController({ p, auth, onFilterCategory, onFilterTag, onDelete, onView }) {
  const logic = usePostItemLogic({ p, auth });

  function handleEdit() {
    App.Router.navigateTo(`/postsnew/edit/${p.id}`);
  }

  function handleFlag() {
    App.Actions.PostA.flag({
      id: p.id,
      flagged: !p.flagged
    });
  }

  function handleDelete() {
    onDelete?.(p);
  }

  function handleViewDetail() {
    onView?.();
  }

  return {
    p,
    ...logic,

    onFilterCategory,
    onFilterTag,

    onEdit: handleEdit,
    onFlag: handleFlag,

    onDelete: handleDelete,
    onView: handleViewDetail
  };
}

function PostItemView({
  p,
  authorAvatar,
  excerpt,

  isAdmin,
  canEdit,
  canDelete,

  onEdit,
  onFlag,
  onDelete,
  onView,

  onFilterCategory,
  onFilterTag
}) {
  return h('div', { className: 'post' }, [

    !p.flagged && h(Link, {
      to: `/postsnew/${p.id}`,
      className: 'post-title',
      children: p.title
    }),
    
    p.flagged && h('p', {className: "post-title", onclick: onView}, p.title),

    h(PostMeta, { p, authorAvatar }),

    h(PostCategory, {
      category: p.category,
      onClick: onFilterCategory
    }),

    h(PostTags, {
      tags: p.tags,
      onClick: onFilterTag
    }),

    p.flagged &&
      h('div', { className: 'post-flagged' }, '🔴 Nội dung bài viết sẽ hiển thị sau khi kiểm duyệt nội dung thành công.'),

    !p.flagged && excerpt &&
      h('div', { className: 'post-excerpt' }, excerpt),

    h(PostImages, { images: p.images }),

    h(PostActions, {
      p,
      isAdmin,
      canEdit,
      canDelete,
      onEdit,
      onFlag,
      onDelete,
      onView
    })
  ]);
}

function PostMeta({ p, authorAvatar }) {
  return h('div', { className: 'post-meta' }, [
    h('img', {
      src: authorAvatar,
      alt: p.author,
      className: 'post-avatar'
    }),
    h(
      'span',
      {},
      `${p.author} • ${formatDateVN(p.createdAt)} • ${timeSinceVN(p.createdAt)}`
    )
  ]);
}

function PostCategory({ category, onClick }) {
  if (!category) return null;

  return h('div', { className: 'post-category' }, [
    'Category: ',
    h('span', { onClick: () => onClick(category) }, category)
  ]);
}

function PostTags({ tags, onClick }) {
  if (!tags || !tags.length) return null;

  return h('div', { className: 'post-tags' }, [
    h('span', { className: 'post-tags-label' }, 'Tags: '),
    ...tags.map(tag =>
      h('span', {
        className: 'post-tag',
        onClick: () => onClick(tag)
      }, '#' + tag)
    )
  ]);
}

function PostImages({ images }) {
  if (!images || !images.length) return null;

  return h(
    'div',
    { className: 'post-images' },
    images.map(url =>
      h('img', {
        src: url,
        className: 'post-image'
      })
    )
  );
}

function PostActions({
  p,
  isAdmin,
  canEdit,
  canDelete,
  onEdit,
  onFlag,
  onDelete,
  onView
}) {
  if (!canEdit && !canDelete && !isAdmin) return null;

  return h('div', { className: 'post-actions' }, [
    canEdit &&
      h('button', { className: 'small-btn', onClick: onEdit }, 'Sửa'),

    canDelete &&
      h('button', { className: 'small-btn', onclick: onDelete }, 'Xóa'),

    isAdmin &&
      h(
        'button',
        { className: 'small-btn', onClick: onFlag },
        p.flagged ? 'Bỏ kiểm duyệt' : 'Đánh dấu kiểm duyệt'
      )
  ]);
}

function PostItem(props) {
  const controller = usePostItemController(props);
  return h(PostItemView, controller);
}

