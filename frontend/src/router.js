import { ShowCarPage } from "./pages/show_car_page.js";
import { CreateCarPage } from "./pages/create_car_page.js";
import { ErrorPage } from "./pages/error_page.js";

class Router {
    
    constructor() {
        this.routes = {
            "/": ShowCarPage,
            "/create_car": CreateCarPage,
            "/404": ErrorPage
        };
        this._current_path = "/";
    }
    get current_path() {
        return this._current_path;
    }

    set current_path(new_path) {
        this._current_path = new_path;
    }

    load_page(path) {
        console.log("=== РОУТЕР НАМАГАЄТЬСЯ ЗАВАНТАЖИТИ ШЛЯХ ==:", path);
        console.log("Доступні маршрути:", this.routes);

        let PageClass = this.routes[path];

        if (!PageClass) {
            console.warn("Маршрут не знайдено в карті роутів! Перемикаємо на 404.");
            this.current_path = "/404";
            PageClass = this.routes[this.current_path];

        }

        const pageInstance = new PageClass();
        pageInstance.render();
    }

    navigate(path) {
        if (this._current_path === path) return;

        window.history.pushState({}, "", path);
        this.current_path = path;
        this.load_page(this._current_path);
    }
}

const router = new Router();

router.load_page(window.location.pathname);

document.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-path]");
    if (button) {
        const path = button.getAttribute("data-path");
        router.navigate(path);
    }
});

window.addEventListener("popstate", () => {
    const current_path = window.location.pathname;
    console.log(current_path);
    router.navigate(current_path);

})