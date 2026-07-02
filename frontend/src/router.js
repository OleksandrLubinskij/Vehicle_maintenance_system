import { ShowCarPage } from "./pages/show_car_page.js";
import { CreateCarPage } from "./pages/create_car_page.js";
import { ManageMaintenancePage } from "./pages/maintenance_page.js";
import { ErrorPage } from "./pages/error_page.js";
import { AuthorizationPage } from "./pages/authorization_page.js";
import { GetCarPage } from "./pages/get_car_page.js";
import { PAGE_MODE, AUTHORIZATION_PAGE_MODE } from "../config.js";
import { control_nav_menu_visibility } from "./utils/nav_menu_visibility.js";
import { updateActiveNavLink } from "./utils/update_active_nav_link.js";
import "./components/navbar_burger_menu.js";
import "./utils/settings_floating_window.js";
import "./utils/change_password_scripts.js"
class Router {
    constructor() {
        this.routes = {
            "/cars": { Class: ShowCarPage },
            "/create_car": { Class: CreateCarPage, mode: PAGE_MODE.CREATE, useParam: false },
            "/edit_car": { Class: CreateCarPage, mode: PAGE_MODE.EDIT },
            "/get_car": {Class: GetCarPage},
            "/create_maintenance_record": { Class: ManageMaintenancePage, mode: PAGE_MODE.CREATE },
            "/edit_maintenance_record": { Class: ManageMaintenancePage, mode: PAGE_MODE.EDIT },
            "/register": { Class: AuthorizationPage, mode: AUTHORIZATION_PAGE_MODE.REGISTER },
            "/login": { Class: AuthorizationPage, mode: AUTHORIZATION_PAGE_MODE.LOGIN },
            "/404": { Class: ErrorPage }
        };
        this._current_path = "/";
    }

    get current_path() { return this._current_path; }
    set current_path(new_path) { this._current_path = new_path; }

    load_page(raw_path) {
        console.log("=== РОУТЕР НАМАГАЄТЬСЯ ЗАВАНТАЖИТИ ШЛЯХ ==:", raw_path);
        control_nav_menu_visibility();
        const raw_path_arr = raw_path.split("/").filter(Boolean);
        if (raw_path_arr.length === 0) {
            this.navigate("/cars");
            return;
        }

        const path = `/${raw_path_arr[0]}`;
        const routeConfig = this.routes[path];
        const path_param = (routeConfig && routeConfig.useParam === false) ? null : (raw_path_arr[1] || null);
        
        let pageInstance;

        if (!routeConfig) {
            console.warn("Маршрут не знайдено! Перемикаємо на 404.");
            this.current_path = "/404";
            const ErrorClass = this.routes["/404"].Class;
            pageInstance = new ErrorClass("Not found", "404");
        } else {
            this.current_path = raw_path;
            const page_title = raw_path_arr[0].replace("_", " ");
            
            const { Class, mode } = routeConfig;
            
            if (mode !== undefined) {
                console.log(`Router ${mode}`);
                pageInstance = new Class(page_title, path_param, mode);
            } else {
                pageInstance = new Class(page_title, path_param);
            }
        }
        updateActiveNavLink(path);
        pageInstance.render();
    }

    navigate(path) {
        if (this._current_path === path) return;

        window.history.pushState({}, "", path);
        this._current_path = path;
        this.load_page(path);
    }
}

export const router = new Router();
router.load_page(window.location.pathname);

document.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-path]");
    if (button) {
        const path = button.getAttribute("data-path");
        router.navigate(path);
    }
});

window.addEventListener("popstate", () => {
    router.load_page(window.location.pathname);
});