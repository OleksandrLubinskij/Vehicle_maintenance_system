export function control_nav_menu_visibility() {
    const is_authenticated = localStorage.getItem("is_authenticated") === "true";
    const nav_menu = document.querySelector("#nav_menu");

    if(is_authenticated) {
        nav_menu.classList.remove("hidden");
    } else {
        nav_menu.classList.add("hidden");
    }
}