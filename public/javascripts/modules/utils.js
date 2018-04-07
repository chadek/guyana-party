import axios from "axios";
import dompurify from "dompurify";

export function axiosGet(url, callback) {
  axios
    .get(url)
    .then(res => callback(res.data))
    .catch(err => console.error(err));
}

export function data2HTML(data, formatFn, concatFormat) {
  if (!data.items) return "";
  const rawHTML = data.items
    .map(item => formatFn(item))
    .join("")
    .concat(concatFormat);
  return dompurify.sanitize(rawHTML);
}
