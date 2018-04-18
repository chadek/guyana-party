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

export function formatDateTime(isoDate, fr = true, separator = '/') {
  if (!isoDate) return;
  isoDate = new Date(isoDate);
  let time = ("0" + isoDate.getHours()).slice(-2) + ":" + ("0" + isoDate.getMinutes()).slice(-2);
  let day = ("0" + isoDate.getDate()).slice(-2);
  let month = ("0" + (isoDate.getMonth() + 1)).slice(-2);
  let date = "";
  if(fr) {
    date = `${day}${separator}${month}${separator}${isoDate.getFullYear()}`;
  } else {
    date = `${isoDate.getFullYear()}${separator}${month}${separator}${day}`;
  }
  return {time, date};
}

export function formatTime() {}
