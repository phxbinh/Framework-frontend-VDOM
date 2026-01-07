/*
<button id="backToTop" class="back-to-top">↑ Top</button>
*/

/*
// cho back to top
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  const viewportHeight = window.innerHeight;
  const contentHeight = document.body.offsetHeight;

  // chỉ hiển thị nếu nội dung cao hơn viewport
  if (contentHeight > viewportHeight) {
    // scrollY >= 20% viewport
    const scrolledEnough = window.scrollY >= viewportHeight * 0.8;
    backToTop.classList.toggle("show", scrolledEnough);
  } else {
    // nội dung thấp hơn viewport → ẩn nút
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
*/

/*
const backToTop = document.getElementById("backToTop");
const sentinel = document.getElementById("top-sentinel");

const observer = new IntersectionObserver(
  ([entry]) => {
    backToTop.classList.toggle("show", !entry.isIntersecting);
  },
  { threshold: 0 }
);

observer.observe(sentinel);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
*/


const backToTop = document.getElementById("backToTop");

const sentinel = document.getElementById("top-sentinel");

const observer = new IntersectionObserver(
  ([entry]) => {
    backToTop.classList.toggle("show", !entry.isIntersecting);
  },
  {
    root: null,
    threshold: 0,
  }
);

observer.observe(sentinel);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});