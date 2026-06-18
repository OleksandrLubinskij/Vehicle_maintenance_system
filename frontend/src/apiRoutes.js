import { router } from "./router";
const BASE_URL = "http://localhost:8001/v1";
const BASE_CAR_URL = `${BASE_URL}/cars`;
const BASE_MAINTENANCE_LOG_URL = `${BASE_URL}/maintenance_logs`;
const BASE_USERS_URL = `${BASE_URL}/users`;
const endpoint = {
    cars: {
        show_all_cars: () => `${BASE_CAR_URL}`,
        show_car_by_id: (id) => `${BASE_CAR_URL}/get_car_by_id/${id}`,
        create_car: () => `${BASE_CAR_URL}/create_car`,
        edit_car: (id) => `${BASE_CAR_URL}/edit_car/${id}`,
        delete_car: (id) => `${BASE_CAR_URL}/delete_car/${id}`,
        get_car_mileage: (id) => `${BASE_CAR_URL}/get_car_mileage/${id}`,
        get_car_brand_and_model: (id) => `${BASE_CAR_URL}/get_car_brand_and_model/${id}`,
    },
    maintenance_log: {
        show_all_mlog: (car_id) => `${BASE_MAINTENANCE_LOG_URL}/${car_id}`,
        show_mlog_by_id: (id) => `${BASE_MAINTENANCE_LOG_URL}/get_maintenance_record_by_id/${id}`,
        create_mlog: (car_id) => `${BASE_MAINTENANCE_LOG_URL}/create_maintenance_record/${car_id}`,
        edit_mlog: (id) => `${BASE_MAINTENANCE_LOG_URL}/edit_maintenance_record/${id}`,
        delete_mlog: (id) => `${BASE_MAINTENANCE_LOG_URL}/delete_maintenance_record/${id}`
    },
    enum: {
        get_enums: (enum_id) => `${BASE_URL}/get_enums/${enum_id}`
    },
    users: {
        register:() => `${BASE_USERS_URL}/register`,
        login:() => `${BASE_USERS_URL}/login`,
        logout:() => `${BASE_USERS_URL}/logout`,
        get_me:() => `${BASE_USERS_URL}/get_me`
    }
};

async function request(URL, method = "GET", data = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(URL, options);
    if (response.status === 401) {
        const loginURl = endpoint.users.login();
        if (URL !== loginURl) { 
            console.warn("Бекенд повернув 401. Перенаправляємо на логін...");
            router.navigate("/login"); 
            throw new Error("Сесія закінчилася. Будь ласка, увійдіть знову.");}
    }
    if (!response.ok) {
        const error = await response.json().catch(() => ({ "detail": "Unknown error!" }));
        if(typeof(error.detail) === "object" && error.detail !== null) {
            const custom_error = new Error(error.detail.message || "Error");
            custom_error.code = error.detail.code;
            throw custom_error;
        }
        throw new Error(error.detail || `HTTP error: ${response.status}`);
    }
    return response.json();
}

export const api = {
    cars: {
        show_all_cars: () => request(endpoint.cars.show_all_cars()),
        show_car_by_id: (id) => request(endpoint.cars.show_car_by_id(id)),
        create_car: (data) => request(endpoint.cars.create_car(), "POST", data),
        edit_car: (id, data) => request(endpoint.cars.edit_car(id), "PATCH", data),
        delete_car: (id) => request(endpoint.cars.delete_car(id), "DELETE"),
        get_car_mileage: (id) => request(endpoint.cars.get_car_mileage(id), "GET"),
        get_car_brand_and_model: (id) => request(endpoint.cars.get_car_brand_and_model(id), "GET"),
    },
    maintenance_log: {
        show_all_mlog: (car_id) => request(endpoint.maintenance_log.show_all_mlog(car_id)),
        show_mlog_by_id: (id) => request(endpoint.maintenance_log.show_mlog_by_id(id)),
        create_mlog: (car_id, data) => request(endpoint.maintenance_log.create_mlog(car_id), "POST", data),
        edit_mlog: (id, data) => request(endpoint.maintenance_log.edit_mlog(id), "PATCH", data),
        delete_mlog: (id) => request(endpoint.maintenance_log.delete_mlog(id), "DELETE")
    },
    enum: {
        get_enums: (enum_id) => request(endpoint.enum.get_enums(enum_id))
    },
    users: {
        register: (data) => request(endpoint.users.register(), "POST", data),
        login: (data) => request(endpoint.users.login(), "POST", data),
        logout: (data) => request(endpoint.users.logout()),
        get_me: () => request(endpoint.users.get_me())
    }
};