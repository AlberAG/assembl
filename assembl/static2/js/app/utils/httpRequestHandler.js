export const xmlHttpRequest = (obj) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = obj.url;
    xhr.open(obj.method, url);
    if (obj.headers) {
      Object.keys(obj.headers).forEach((key) => {
        xhr.setRequestHeader(key, obj.headers[key]);
      });
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = () => {
      return reject(xhr.statusText);
    };
    xhr.send(obj.body);
  });
};