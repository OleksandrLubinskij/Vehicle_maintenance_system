import { ShowCarPage } from "./pages/show_car_page.js";
import { CreateCarPage } from "./pages/create_car_page.js";
import { ManageMaintenancePage } from "./pages/maintenance_page.js";
import { ErrorPage } from "./pages/error_page.js";
import { PAGE_MODE } from "../config.js";
class Router {
    constructor() {
        this.routes = {
            "/cars": ShowCarPage,
            "/create_car": CreateCarPage,
            "/edit_car": CreateCarPage,
            "/create_maintenance_record": ManageMaintenancePage,
            "/edit_maintenance_record": ManageMaintenancePage,
            "/404": ErrorPage 
        };
        this._current_path = "/";
    }

    get current_path() { return this._current_path; }
    set current_path(new_path) { this._current_path = new_path; }

    load_page(raw_path) {
        console.log("=== РОУТЕР НАМАГАЄТЬСЯ ЗАВАНТАЖИТИ ШЛЯХ ==:", raw_path);
        
        const raw_path_arr = raw_path.split("/").filter(Boolean);
        if (raw_path_arr.length === 0) {
            this.navigate("/cars");
            return;
        }

        const path = `/${raw_path_arr[0]}`;
        const path_param = raw_path_arr[1] || null;
        
        let PageClass = this.routes[path];
        let pageInstance;

        if (!PageClass) {
            console.warn("Маршрут не знайдено! Перемикаємо на 404.");
            this.current_path = "/404";
            PageClass = this.routes["/404"];
            pageInstance = new PageClass("Not found", "404");
        } else {
            this.current_path = raw_path;
            const page_title = raw_path_arr[0].replace("_", " ");

            if (path === "/create_maintenance_record") {
                pageInstance = new PageClass(page_title, path_param, PAGE_MODE.CREATE);
            } 
            else if (path === "/edit_maintenance_record") {
                pageInstance = new PageClass(page_title, path_param, PAGE_MODE.EDIT);
            } 
            else if (path === "/edit_car") {
                pageInstance = new PageClass(page_title, path_param, PAGE_MODE.EDIT);
            } 
            else if (path === "/create_car") {
                pageInstance = new PageClass(page_title, null, PAGE_MODE.CREATE);
            } 
            else {
                pageInstance = new PageClass(page_title, path_param);
            }
        }
        
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