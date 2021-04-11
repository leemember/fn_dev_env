import "./app.css";
import cat from "./picture.png";
import home from "./unnamed.png";

document.addEventListener("DOMContentLoaded", () => {
  document.body.innerHTML = `
  <img src="${cat}" />
  <img src="${home}" />
  `;
});
