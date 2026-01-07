

  // ==============================
  // Animate height JS pixel/second
  // ==============================
  function animateHeight(el, isOpen, speed=1000){ // speed: pixel/sec
    if(!el) return;
    const start = el.getBoundingClientRect().height;
    const target = isOpen ? el.scrollHeight : 0;
    const diff = target - start;
    if(diff===0) return;

    let startTime = null;

    return new Promise(resolve=>{
      function step(ts){
        if(!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const delta = speed * (elapsed / 1000); // pixels moved
        let newHeight = start + Math.sign(diff) * Math.min(Math.abs(diff), delta);
        el.style.height = newHeight + "px";
        if(Math.abs(target - newHeight) > 0.5) requestAnimationFrame(step);
        else {
          el.style.height = isOpen ? 'auto' : '0px';
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  }

  // ==============================
  // AccordionItem component
  // ==============================
  const AccordionItem = memo(function AccordionItem({ id, title, isOpen, onToggle, children, highlight=false }) {
    const panelRef = useRef(null);

    useEffect(()=>{
      const el = panelRef.current;
      if(!el) return;
      animateHeight(el, isOpen, 850); // 1200 px/sec
    }, [isOpen, children]);

    return h("div",{ class:"acc-card"+(highlight&&isOpen?" highlight":"") },[
      h("div",{ 
        class:"acc-title",
        onClick:()=>onToggle(id),
        tabIndex:0,
        onKeyDown:e=>{ if(e.key==="Enter"||e.key===" ") onToggle(id); }
      },[
        h("h3",{}, title),
        h("span",{ class:"acc-chev"+(isOpen?" open":"") }, "▶")
      ]),
      h("div",{ class:"acc-panel", ref:panelRef },[
        h("div",{ class:"acc-panel-inner" }, children)
      ])
    ]);
  })

  // ==============================
  // Accordion parent
  // ==============================
  function Accordion({ items, highlight=false }) {
    const [openIds, setOpenIds] = useState([]);
    const [filter, setFilter] = useState("");

    const handleToggle = id => {
      setOpenIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
    };

    const filtered = items.filter(it => it.title.toLowerCase().includes(filter.toLowerCase()));

    return h("div",{ class:"acc-root" },[
      h("input",{
        type:"text",
        class:"acc-search",
        placeholder:"Search FAQ...",
        value:filter,
        onInput:e=>setFilter(e.target.value)
      }),
      ...filtered.map(it=>h(AccordionItem,{
        key: it.id,
        id: it.id,
        title: it.title,
        isOpen: openIds.includes(it.id),
        onToggle: handleToggle,
        highlight,
        children: it.body
      }))
    ]);
  }

  // ==============================
  // Demo FAQ
  // ==============================
  function FAQDemo() {
    const [asyncContent,setAsyncContent] = useState("Loading...");

    useEffect(()=>{
      setTimeout(()=>setAsyncContent("Async content loaded!,  efficient DOM diffing. Dynamic content, Dynamic content example, Dynamic content, Dynamic content example, Dynamic content, Dynamic content example, Dynamic content, Dynamic content example, Dynamic content, Dynamic content example, Dynamic content, Dynamic content example, Dynamic content, Dynamic content example, Dynamic content"), 1500);
    },[]);

    const items = [
      { id:1, title:"What is VDOM?", body:"VDOM = Virtual DOM, efficient DOM diffing. Dynamic content, Dynamic content example, Dynamic content, Dynamic content example, Dynamic content, Dynamic content example, Dynamic content, Dynamic content example, Dynamic content, Dynamic content example, Dynamic content, Dynamic content example, Dynamic content, Dynamic content example, Dynamic content"},
      { id:2, title:"Dynamic content example", body: asyncContent },
      { id:3, title:"Nested FAQ", body: h(Accordion,{
        items:[
          { id:"3-1", title:"Nested A", body:"Nested content A" },
          { id:"3-2", title:"Nested B", body:"Nested content B" }
        ]
      })}
    ];

    return h(Accordion,{ items, highlight:true });
  }