document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("#menu_toggle");
  const navMenu = document.querySelector("#mobile_dropdown_menu");
  const menu_elem_btns = document.querySelectorAll(".menu_btn");
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      console.log("Hello")
      navMenu.classList.toggle("hidden");
      navMenu.classList.toggle("flex");
    });
  }

  menu_elem_btns.forEach(menu_btn => {
    menu_btn.addEventListener("click", () => {
      navMenu.classList.toggle("hidden");
      navMenu.classList.toggle("flex");
    })
  })
});