

// Ngắt text 
function generateExcerptByWords(content = '', maxWords = 35) {
  if (!content) return '';

  // 1️⃣ Làm sạch nội dung (bỏ markdown và HTML tag)
  let text = content
    .replace(/<[^>]*>/g, '')        // bỏ HTML
    .replace(/!\[.*?\]\(.*?\)/g, '') // bỏ ảnh markdown ![...](...)
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // bỏ link [text](url)
    .replace(/[`*_>#~\-]/g, '')     // bỏ ký tự markdown thừa
    .trim();

  // 2️⃣ Tách từ — tiếng Việt dùng khoảng trắng như tiếng Anh, nên split(' ') vẫn ổn
  const words = text.split(/\s+/);

  // 3️⃣ Nếu số từ <= maxWords → trả nguyên
  if (words.length <= maxWords) return text;

  // 4️⃣ Cắt theo giới hạn từ
  const sliced = words.slice(0, maxWords).join(' ');

  // 5️⃣ Nếu chưa kết thúc bằng dấu câu thì thêm dấu ba chấm
  const lastChar = sliced.slice(-1);
  const hasEndPunctuation = /[.!?…]/.test(lastChar);
  return hasEndPunctuation ? sliced : sliced + '…';
}

