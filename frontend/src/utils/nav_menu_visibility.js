import { ROLE } from "../../config";
export function control_nav_menu_visibility() {
    const is_authenticated = localStorage.getItem("is_authenticated") === "true";
    const user_role = localStorage.getItem("role");
    const nav_menu = document.querySelector("#nav_menu");
    const nav_create = document.querySelector("#nav-create");
    if (!nav_menu || !nav_create) return;

    if (is_authenticated) {
        nav_menu.classList.remove("hidden");
    } else {
        nav_menu.classList.add("hidden");
    }

    const create_button_visibility = {
        [ROLE.USER]:  () => nav_create.classList.add("hidden"),
        [ROLE.ADMIN]: () => nav_create.classList.remove("hidden"),
    };

    if (create_button_visibility[user_role]) {
        create_button_visibility[user_role]();
    } else {
        nav_create.classList.add("hidden");
    }
}