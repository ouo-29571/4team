export function formatNumber(num, locale = 'ko-KR') {
  if (typeof num !== 'number') return num;
  return num.toLocaleString(locale);
}