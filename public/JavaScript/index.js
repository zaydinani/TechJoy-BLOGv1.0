// MAP LEAFLEAT
var map = L.map("map").setView([35.76727, -5.79975], 8);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
var marker = L.marker([35.76727, -5.79975]).addTo(map);

const burger = document.querySelector(".hamContainer");
const UL_nav = document.querySelector(" nav > ul");
const li_nav = document.querySelectorAll(" nav li");

burger.addEventListener("click", () => {
  burger.classList.toggle("activeHam");
  if (burger.classList.contains("activeHam")) {
    UL_nav.style.right = "100vw";
  } else {
    UL_nav.style.right = "0";
  }
  //animate links
  li_nav.forEach((link, i) => {
    if (link.style.animation) {
      link.style.animation = "";
    } else {
      link.style.animation = ` navAnimationLinks 0.5s ease forwards ${
        i / 7 + 0.5
      }s `;
    }
  });
});
// DROP DOWN MENU
const myAccBtn = document.querySelector("nav > span");
const dropMenu = document.querySelector(".dropdown_menu");

myAccBtn.addEventListener("click", () => {
  dropMenu.classList.toggle("dropdown_Active");
});
