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
import "./utils/change_theme.js"
class Router {
    constructor() {
        // this.routes = {
        //     "/cars": { Class: ShowCarPage },
        //     "/create_car": { Class: CreateCarPage, mode: PAGE_MODE.CREATE, useParam: false },
        //     "/edit_car": { Class: CreateCarPage, mode: PAGE_MODE.EDIT },
        //     "/get_car": {Class: GetCarPage},
        //     "/create_maintenance_record": { Class: ManageMaintenancePage, mode: PAGE_MODE.CREATE },
        //     "/edit_maintenance_record": { Class: ManageMaintenancePage, mode: PAGE_MODE.EDIT },
        //     "/register": { Class: AuthorizationPage, mode: AUTHORIZATION_PAGE_MODE.REGISTER },
        //     "/login": { Class: AuthorizationPage, mode: AUTHORIZATION_PAGE_MODE.LOGIN },
        //     "/404": { Class: ErrorPage }
        // };
        this.routes = {
            "cars": {
                "GET": { Class: ShowCarPage },
                "POST": { Class: CreateCarPage, mode: PAGE_MODE.CREATE, useParam: false },
                "PATCH": { Class: CreateCarPage, mode: PAGE_MODE.EDIT },
                "DELETE": {} 
            },
            "maintenance_log": {
                "GET": { },
                "POST": { Class: ManageMaintenancePage, mode: PAGE_MODE.CREATE },
                "PATCH": { Class: ManageMaintenancePage, mode: PAGE_MODE.EDIT },
                "DELETE": {} 
            },
            "users": {
                "POST": { Class: AuthorizationPage, mode: AUTHORIZATION_PAGE_MODE.LOGIN },
            },
            "fuel_logs":{
                
            },
            "404": {
                "GET": { Class: ErrorPage }
            }
        };
        this._current_path = window.location.pathname;
    }

    get current_path() { return this._current_path; }
    set current_path(new_path) { this._current_path = new_path; }

    // Задаємо значення за замовчуванням
    load_page(method = null, entity = null, id = null) {
        control_nav_menu_visibility();
        
        // 1. Якщо аргументи не передані (прямий захід по URL або popstate), парсимо адресний рядок
        const path_parts = window.location.pathname.split("/").filter(Boolean);
        console.log(path_parts);
        const current_entity = entity || path_parts[0] || "users";
        const current_id = id ?? (path_parts.length > 1 ? path_parts[1] : null);
        const current_method = method || (current_entity === "users" ? "POST" : "GET");
        console.log(current_id);
        // 2. Шукаємо конфігурацію роута
        const entityRoutes = this.routes[current_entity];
        const routeConfig = entityRoutes ? entityRoutes[current_method] : null;
        let pageInstance;

        if (!routeConfig || !routeConfig.Class) {
            console.warn("Маршрут не знайдено! Перемикаємо на 404.");
            this._current_path = "/404";
            const ErrorClass = this.routes["404"]["GET"].Class;
            pageInstance = new ErrorClass("Not found", "404");
        } else {
            this._current_path = window.location.pathname;
            const page_title = current_entity.replace("_", " ");
            
            let { Class, mode } = routeConfig;
            if (current_method === "GET" && current_entity === "cars") {
                Class = current_id ? GetCarPage : ShowCarPage;
            }
            if (current_method === "POST" && current_entity === "users") {
                Class = AuthorizationPage
                switch (String(current_id)) {
                    case "0":
                        mode = AUTHORIZATION_PAGE_MODE.REGISTER;
                        break;
                    default:
                        mode = AUTHORIZATION_PAGE_MODE.LOGIN;
                        break;
                }
                console.log(mode);
                pageInstance = new Class(page_title, mode);
            }
            else if (mode !== undefined) {
                console.log(`Router mode: ${mode}`);
                pageInstance = new Class(page_title, current_id, mode);
            } else {
                pageInstance = new Class(page_title, current_id);
            }
        }
        
        updateActiveNavLink(`/${current_entity}`);
        pageInstance.render();
    }

    navigate(method=null, entity=null, id=null) {
        // Формуємо новий шлях для браузера
        let new_path = `/${entity}`;
        if (id !== null && id !== undefined) {
            new_path += `/${id}`;
        }

        // Зберігаємо method, entity та id у state історії браузера
        window.history.pushState({ method, entity, id }, "", new_path);
        this._current_path = new_path;
        this.load_page(method, entity, id);
    }
}

export const router = new Router();

// Ініціалізація при першому завантаженні сторінки без аргументів (спрацює дефолтний парсинг URL)
const initial_path_parts = window.location.pathname.split("/").filter(Boolean);
const initial_entity = initial_path_parts[0] || "users";
const initial_id = initial_path_parts.length > 1 ? initial_path_parts[1] : null;

window.history.replaceState(
    { method: null, entity: initial_entity, id: initial_id }, 
    "", 
    window.location.pathname
);

router.load_page();

document.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-method]");
    if (button) {
        event.preventDefault();
        const method_attr = button.getAttribute("data-method");
        const entity_attr = button.getAttribute("data-entity");
        const raw_id = button.getAttribute("data-id");
        const id_attr = raw_id ? parseInt(raw_id, 10) : null;
        
        router.navigate(method_attr, entity_attr, id_attr);
    }
});

window.addEventListener("popstate", (event) => {
    // Якщо користувач натиснув "Назад" і там є збережений state, використовуємо його
    if (event.state) {
        router.load_page(event.state.method, event.state.entity, event.state.id);
    } else {
        // Якщо state порожній, дозволяємо load_page самостійно розібрати URL
        router.load_page();
    }
});