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

const items = document.querySelectorAll(".accordion button");

function toggleAccordion() {
  const itemToggle = this.getAttribute("aria-expanded");

  for (i = 0; i < items.length; i++) {
    items[i].setAttribute("aria-expanded", "false");
  }

  if (itemToggle == "false") {
    this.setAttribute("aria-expanded", "true");
  }
}

items.forEach((item) => item.addEventListener("click", toggleAccordion));
