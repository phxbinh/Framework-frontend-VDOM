// POST DETAIL ===========
// ✳️PostItem with proper moderation
// An toàn. Không bị fetch lên server khi vdom rerender lại UI -----
/*
function PostDetail({ params }) {
  const posts = App.useStore(s => s.postsA.postsDemo || []);

  // Loading data lần đầu
  if (!posts.length) {
    return h("div", { class: "card p-20" }, "Đang tải bài viết...");
  }

  const id = params.id;
  const post = posts.find(p => p.id === id);

  if (!post) {
    return h("div", { class: "card p-20" },
      h("h3", { class: "text-red" }, `Không tìm thấy bài viết #${params.id}`)
    );
  }

    // Nếu tìm thấy → render chi tiết
  return h("div", { class: "card p-20" }, [
    h("h2", { class: "post-title" }, post.title),

    // render thêm nếu có fields phụ
    post.category ? h("div", { class: "mt-10 badge" }, `Category: ${post.category}`) : null,

    // Tags của bài viết -----
    post.tags && post.tags.length && h('div', { className:'app-post-tags' }, h('span',{style: { background: "none", fontSize: '12px', color:'#555' }},'Tags: '),
      post.tags.map(tag => h('span', { 
        style: { cursor:'pointer', marginLeft: '5px', fontSize: '12px' },
      }, '#'+tag))
    ),

    h("p", { class: "post-content mt-10" }, post.content),

    h('button', {type: 'submit', onclick: ()=> App.Router.navigateTo('/postsnew')}, 'Back'),
  ]);
}
*/

/* tách thành level 2 -----
function PostDetail({ params }) {
  const posts = App.useStore(s => s.postsA.postsDemo || []);

  if (!posts.length) {
    return h(PostDetailLoading);
  }

  const post = posts.find(p => p.id === params.id);

  if (!post) {
    return h(PostDetailNotFound, { id: params.id });
  }

  return h(PostDetailView, {
    post,
    onBack: () => App.Router.navigateTo('/postsnew')
  });
}

function PostDetailView({ post, onBack }) {
  return h("div", { class: "card p-20" }, [
    h("h2", { class: "post-title" }, post.title),

    post.category &&
      h("div", { class: "mt-10 badge" }, `Category: ${post.category}`),

    post.tags?.length &&
      h('div', { class: 'app-post-tags' }, [
        h('span', {
          style: { background: "none", fontSize: '12px', color: '#555' }
        }, 'Tags: '),

        post.tags.map(tag =>
          h('span', {
            style: {
              cursor: 'pointer',
              marginLeft: '5px',
              fontSize: '12px'
            }
          }, '#' + tag)
        )
      ]),

    h("p", { class: "post-content mt-10" }, post.content),

    h('button', { onclick: onBack }, 'Back')
  ]);
}

function PostDetailLoading() {
  return h("div", { class: "card p-20" }, "Đang tải bài viết...");
}

function PostDetailNotFound({ id }) {
  return h("div", { class: "card p-20" },
    h("h3", { class: "text-red" }, `Không tìm thấy bài viết #${id}`)
  );
}
*/


// Tách thành level 3 ---
/*
PostDetail (L1)
 └─ PostDetailView (L2)
     ├─ CategoryBadge (L3)
     ├─ TagsList (L3)
     └─ PostContent (optional L3)
*/

function CategoryBadge({ category }) {
  if (!category) return null;

  return h(
    "div",
    { class: "mt-10 badge" },
    `Category: ${category}`
  );
}

function TagsList({ tags, onTagClick }) {
  if (!tags || !tags.length) return null;

  return h(
    'div',
    { className: 'app-post-tags' },
    [
      h('span', {
        style: {
          background: "none",
          fontSize: '12px',
          color: '#555'
        }
      }, 'Tags: '),

      ...tags.map(tag =>
        h('span', {
          style: {
            cursor: 'pointer',
            marginLeft: '5px',
            fontSize: '12px'
          },
          onclick: () => onTagClick?.(tag)
        }, '#' + tag)
      )
    ]
  );
}

function PostContent({ content }) {
  return h(
    "p",
    { class: "post-content mt-10" },
    content
  );
}

function PostDetailView({ post, onBack, onTagClick }) {
  return h("div", { className: "card p-20" }, [
    h("h2", { className: "post-title" }, post.title),

    h(CategoryBadge, { category: post.category }),

    h(TagsList, {
      tags: post.tags,
      onTagClick
    }),

    h(PostContent, { content: post.content }),

    h('button', { onclick: onBack }, 'Back')
  ]);
}

function PostDetail({ params }) {
  const posts = App.useStore(s => s.postsA.postsDemo || []);

  if (!posts.length) {
    return h(PostDetailLoading);
  }

  const post = posts.find(p => p.id === params.id);

  if (!post) {
    return h(PostDetailNotFound, { id: params.id });
  }

  return h(PostDetailView, {
    post,
    onBack: () => App.Router.navigateTo('/postsnew'),
    onTagClick: tag => {
      App.Router.navigateTo(`/tags/${tag}`);
    }
  });
}

function PostDetailLoading() {
  return h("div", { class: "card p-20" }, "Đang tải bài viết...");
}

function PostDetailNotFound({ id }) {
  return h("div", { class: "card p-20" },
    h("h3", { class: "text-red" }, `Không tìm thấy bài viết #${id}`)
  );
}