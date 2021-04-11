import "./app.css";
import cat from "./picture.png";
import home from "./unnamed.png";

document.addEventListener("DOMContentLoaded", () => {
  document.body.innerHTML = `
  <img src="${cat}" />
  <img src="${home}" />
  `;
});

console.log(process.env.NODE_ENV); // development
console.log(TWO); // 1+1
console.log(api.domain);
