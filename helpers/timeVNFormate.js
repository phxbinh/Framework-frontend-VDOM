// ✳️Format relative time in Vietnamese timezone using Intl.RelativeTimeFormat
function timeSinceVN(dateString) {
  if (!dateString) return '';
  const tz = 'Asia/Ho_Chi_Minh';
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
  const then = new Date(new Date(dateString).toLocaleString('en-US', { timeZone: tz }));
  const diffSec = Math.floor((now - then) / 1000);
  const rtf = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' });

  const divisions = [
    { amount: 60, name: 'second' },
    { amount: 60, name: 'minute' },
    { amount: 24, name: 'hour' },
    { amount: 7, name: 'day' },
    { amount: 4.34524, name: 'week' },
    { amount: 12, name: 'month' },
    { amount: Infinity, name: 'year' }
  ];

  let duration = diffSec;
  let i = 0;
  while (i < divisions.length) {
    const division = divisions[i];
    if (Math.abs(duration) < division.amount) {
      const unit = division.name;
      return rtf.format(-Math.round(duration), unit);
    }
    duration = Math.round(duration / division.amount);
    i++;
  }
  return then.toLocaleString('vi-VN');
}

// ✳️safeDate display
function formatDateVN(dateString) {
  try {
    return new Date(dateString).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  } catch (e) {
    return dateString;
  }
}
