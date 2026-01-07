function ComposerTest() {

  const user = App.useStore(s => s.auth.user);
  const avatar = App.useStore(s => s.auth.avatar);

  if (!user) {
    return h("div", { class: "not-auth" }, [
      h("p", {}, "Bạn phải đăng nhập để viết bài!"),
      h("a", { href: "#/login" }, "→ Đăng nhập ngay")
    ]);
  }

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [urlMarkdown, setUrlMarkdown] = useState('');

  const debouncedUpdate = useRef(debounce((payload) => {
    //dispatch({ type: 'UPDATE_DRAFT', payload });
  }, 220)).current;

  useEffect(() => {
    debouncedUpdate({ title, content, category, tags, images, urlMarkdown });
  }, [title, content, category, tags, images, urlMarkdown]);

  // 🧩 Avatar động
  const currentUser = user.name || 'Anonymous';
  const userAvatar = avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(currentUser)}`;

  const handleAddTag = e => {
    if (e.key === 'Enter' && tagInput.trim()) {
      const newTag = tagInput.trim();
      setTags(prev => {
        if (prev.includes(newTag)) return prev;
        const updated = [...prev, newTag];
        //dispatch({ type:'UPDATE_DRAFT', payload: { ...state.draft, tags: updated } });
        return updated;
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = tagToRemove => {
    setTags(prev => {
      const updated = prev.filter(t => t !== tagToRemove);
      //dispatch({ type:'UPDATE_DRAFT', payload: { ...state.draft, tags: updated } });
      return updated;
    });
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    const url = imageInput.trim();
    setImages(prev => {
      const updated = [...prev, url];
      //dispatch({ type:'UPDATE_DRAFT', payload: { ...state.draft, images: updated } });
      return updated;
    });
    setImageInput('');
  };

  const handleRemoveImage = urlToRemove => {
    setImages(prev => {
      const updated = prev.filter(u => u !== urlToRemove);
      //dispatch({ type:'UPDATE_DRAFT', payload: { ...state.draft, images: updated } });
      return updated;
    });
  };

  const submit = () => {
    if (!title.trim() && !content.trim()) return alert('Tiêu đề hoặc nội dung required');


/*
      dispatch({
        type: 'ADD_POST',
        payload: {
          title: title.trim(),
          content: content.trim(),
          category,
          tags,
          images,
          author: currentUser,
          avatar: userAvatar, // ✅ lấy avatar hiện tại
          status: 'published',
          urlMarkdown: urlMarkdown.trim(),
        }
      });
*/

    // Tương đướng dispatch({...}) ở trên
    const payload = {
          title: title.trim(),
          content: content.trim(),
          category,
          tags,
          images,
          author: currentUser,
          avatar: userAvatar,
          status: 'published',
          urlMarkdown: urlMarkdown.trim(),
        }
    App.Actions.PostA.add(payload);

    // Reset form
    setTitle('');
    setContent('');
    setCategory('');
    setTags([]);
    setImages([]);
    setTagInput('');
    setImageInput('');
    setPreview(false);
    setUrlMarkdown('');
    //dispatch({ type: 'RESET_DRAFT' });

    App.Router.navigateTo('/postsnew');
  };

  return h('div', { className: 'app-composer' },
    h('h3', {}, 'Viết bài'),

    h('input', { placeholder: 'Tiêu đề', value: title, onInput: e => setTitle(e.target.value), style:{ marginBottom:8 } }),

    h('textarea', { placeholder: 'Nội dung', rows:4, value: content, onInput: e => setContent(e.target.value), style:{ width:'95%', marginBottom:8 } }),

// Add url markdown
h('input', { placeholder: 'url to markdown file', value: urlMarkdown, onInput: e => setUrlMarkdown(e.target.value), style:{ width:'95%', marginBottom:8 } }),

    // Category
    h('input', { placeholder: 'Category', value: category, onInput: e => setCategory(e.target.value), style:{ marginBottom:8 } }),

    // tags
    h('input', {
      placeholder: 'Thêm tag, nhấn Enter',
      value: tagInput,
      onInput: e => setTagInput(e.target.value),
      onKeyDown: handleAddTag,
      style: { marginBottom:8 }
    }),
    h('div', {}, tags.map(t => h('span', { onClick: () => handleRemoveTag(t), style:{ marginRight:6, padding:'2px 6px', background:'#eef', borderRadius:6, cursor:'pointer' } }, t))),

    // images
    h('div', { style:{ display:'flex', gap:8, alignItems:'center', marginBottom:8 } },
      h('input', { placeholder:'Thêm URL hình ảnh', value: imageInput, onInput: e => setImageInput(e.target.value) }),
      h('button', { onClick: handleAddImage }, 'Thêm ảnh')
    ),
    h('div', {}, images.map(url => h('img', { src:url, width:60, height:60, style:{ objectFit:'cover', marginRight:6, cursor:'pointer' }, onClick: () => handleRemoveImage(url) }))),

    // 👇 avatar hiện tại của user
    h('div', { style:{ display:'flex', alignItems:'center', gap:8, marginTop:8 } },
      h('img', { src: userAvatar, width:40, height:40, style:{ borderRadius:'50%' } }),
      h('span', {}, `Đăng với tên: ${currentUser}`)
    ),

    h('div', { style:{ display:'flex', gap:8, marginTop:8 } },
      h('button', { onClick: submit }, 'Đăng bài')
    )
  );
}