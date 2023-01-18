const subBtn = document.getElementById("sub");
const password = document.getElementById("password");
const Cpassword = document.getElementById("Cpassword");
const passwd_err = document.getElementById("passwd_err");

subBtn.addEventListener("click", (e) => {
  if (password.value != Cpassword.value) {
    e.preventDefault();
    passwd_err.style.display = "block";
  }
});
