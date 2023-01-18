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

// scroll to recent
const recent = document.getElementById("RecBtn");
const recentView = document.querySelector(".recent__artContainer");
recent.addEventListener("click", () => {
  console.log("first");
  recentView.scrollIntoView(true);
});
const articleDate = document.querySelectorAll(".Art_date");
articleDate.forEach((art) => {
  art.innerHTML = art.innerHTML.slice(0, 15);
});

const art_des = document.querySelectorAll(".article_desc");
art_des.forEach((artDES) => {
  console.log(artDES.innerHTML);
  artDES.innerHTML = artDES.innerHTML.trim().slice(0, 130).concat("...");
});
