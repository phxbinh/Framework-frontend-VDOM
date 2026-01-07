

/*
function EditPost({ params }) {
  const { h } = App.VDOM;
  const { useState } = App.Hooks;

  const post = App.useStore(s => s.postsA.postsDemo.find(p => p.id === params.id));

  if (!post) return h('div', null, "Post không tồn tại!");

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [images, setImages] = useState(post.images.join("\n"));
  const [urlMarkdown, setUrlMarkdown] = useState(post.urlMarkdown || "");
  const [category, setCategory] = useState(post.category);
  const [tags, setTags] = useState(post.tags.join(", "));
  const [avatar, setAvatar] = useState(post.avatar);

  const handleSave = () => {
    App.Actions.PostA.update({
      id: params.id,
      fields: {
        title,
        content,
        excerpt,
        images: images.split("\n").filter(x => x.trim()),
        urlMarkdown,
        category,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        avatar
      }
    });

    alert("Đã lưu bài viết!");
  };

  return h("div", { class: "edit-post" }, [

    h("h2", null, "Chỉnh sửa bài viết"),

    // Avatar preview
    h("div", { class: "avatar-preview-wrap" }, [
      h("img", {
        src: avatar || "https://placehold.co/120?text=Avatar",
        class: "avatar-preview",
        style: {width: '50px', height: '50px'}
      }),
      h("div", { class: "small-note" }, "Avatar Preview")
    ]),

    h("div", { class: "form-row" }, [
      h("label", null, "Avatar URL"),
      h("input", {
        value: avatar,
        oninput: e => setAvatar(e.target.value)
      })
    ]),

    h("div", { class: "form-row" }, [
      h("label", null, "Title"),
      h("input", {
        value: title,
        oninput: e => setTitle(e.target.value)
      })
    ]),

    h("div", { class: "form-row" }, [
      h("label", null, "Excerpt"),
      h("textarea", {
        value: excerpt,
        oninput: e => setExcerpt(e.target.value)
      })
    ]),

    h("div", { class: "form-row" }, [
      h("label", null, "Content"),
      h("textarea", {
        class: "big",
        value: content,
        oninput: e => setContent(e.target.value)
      })
    ]),

    h("div", { class: "form-row" }, [
      h("label", null, "Images (mỗi dòng 1 link)"),
      h("textarea", {
        value: images,
        oninput: e => setImages(e.target.value)
      })
    ]),

    h("div", { class: "form-row" }, [
      h("label", null, "Markdown URL"),
      h("input", {
        value: urlMarkdown,
        oninput: e => setUrlMarkdown(e.target.value)
      })
    ]),

    h("div", { class: "form-row" }, [
      h("label", null, "Category"),
      h("input", {
        value: category,
        oninput: e => setCategory(e.target.value)
      })
    ]),

    h("div", { class: "form-row" }, [
      h("label", null, "Tags (Ngăn cách dấu phẩy)"),
      h("input", {
        value: tags,
        oninput: e => setTags(e.target.value)
      })
    ]),

    h("button", { class: "save-btn", onclick: handleSave }, "Lưu bài viết")
  ]);
}
*/

/*
EditPost
 ├─ useEditPostLogic        (state + mapping data)
 ├─ useEditPostController   (save / side-effect)
 └─ EditPostForm            (UI thuần)
     ├─ AvatarPreview
     ├─ FormRow
     └─ SaveButton
*/
function useEditPostLogic({ post }) {
  const { useState } = App.Hooks;

  const [author, setAuthor] = useState(post.author);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [images, setImages] = useState((post.images || []).join("\n"));
  const [urlMarkdown, setUrlMarkdown] = useState(post.urlMarkdown || "");
  const [category, setCategory] = useState(post.category);
  const [tags, setTags] = useState((post.tags || []).join(", "));
  const [avatar, setAvatar] = useState(post.avatar);

  function getPayload(id) {
    return {
      id,
      fields: {
        title,
        content,
        excerpt,
        images: images.split("\n").filter(Boolean),
        urlMarkdown,
        category,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        avatar
      }
    };
  }

  return {
    author, setAuthor,
    title, setTitle,
    content, setContent,
    excerpt, setExcerpt,
    images, setImages,
    urlMarkdown, setUrlMarkdown,
    category, setCategory,
    tags, setTags,
    avatar, setAvatar,
    getPayload
  };
}

function useEditPostController({ post, params }) {
  const logic = useEditPostLogic({ post });

  function handleSave() {
    App.Actions.PostA.update(
      logic.getPayload(params.id)
    );

    alert("Đã lưu bài viết!");
  }

  return {
    ...logic,
    onSave: handleSave
  };
}

function EditPostForm({
  author, setAuthor,
  title, setTitle,
  content, setContent,
  excerpt, setExcerpt,
  images, setImages,
  urlMarkdown, setUrlMarkdown,
  category, setCategory,
  tags, setTags,
  avatar, setAvatar,
  onSave
}) {
  return h("div", { className: "edit-post" }, [

    h("h2", null, "Chỉnh sửa bài viết"),

    h(AvatarPreview, { avatar, author }),

    h(FormRow, {
      label: "Avatar URL",
      children: h("input", {
        value: avatar,
        oninput: e => setAvatar(e.target.value),
        disabled: true
      })
    }),

    h(FormRow, {
      label: "Title",
      children: h("input", {
        value: title,
        oninput: e => setTitle(e.target.value)
      })
    }),

    h(FormRow, {
      label: "Excerpt",
      children: h("textarea", {
        value: excerpt,
        oninput: e => setExcerpt(e.target.value)
      })
    }),

    h(FormRow, {
      label: "Content",
      children: h("textarea", {
        className: "big",
        value: content,
        oninput: e => setContent(e.target.value)
      })
    }),

    h(FormRow, {
      label: "Images (mỗi dòng 1 link)",
      children: h("textarea", {
        value: images,
        oninput: e => setImages(e.target.value)
      })
    }),

    h(FormRow, {
      label: "Markdown URL",
      children: h("input", {
        value: urlMarkdown,
        oninput: e => setUrlMarkdown(e.target.value)
      })
    }),

    h(FormRow, {
      label: "Category",
      children: h("input", {
        value: category,
        oninput: e => setCategory(e.target.value)
      })
    }),

    h(FormRow, {
      label: "Tags (Ngăn cách dấu phẩy)",
      children: h("input", {
        value: tags,
        oninput: e => setTags(e.target.value)
      })
    }),

    h(SaveButton, { onSave })
  ]);
}

function AvatarPreview({ avatar, author }) {
  return h("div", { className: "avatar-preview-wrap" }, [
    h("img", {
      src: avatar || "https://placehold.co/120?text=Avatar",
      className: "avatar-preview",
      style: { width: '50px', height: '50px' }
    }),
    h("div", { className: "small-note" }, author)
  ]);
}

function FormRow({ label, children }) {
  return h("div", { className: "form-row" }, [
    h("label", null, label),
    children
  ]);
}

function SaveButton({ onSave }) {
  return h(
    "button",
    { className: "save-btn", onclick: onSave },
    "Lưu bài viết"
  );
}

function EditPost({ params }) {
  const post = App.useStore(s =>
    s.postsA.postsDemo.find(p => p.id === params.id)
  );

  if (!post) return h('div', null, "Post không tồn tại!");

  const controller = useEditPostController({ post, params });
  return h(EditPostForm, controller);
}