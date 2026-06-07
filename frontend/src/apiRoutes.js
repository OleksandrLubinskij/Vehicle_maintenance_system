const BASE_URL = "http://127.0.0.1:8001";
const BASE_CAR_URL = `${BASE_URL}/v1/cars`;
const BASE_MAINTENANCE_LOG_URL = `${BASE_URL}/maintenance_logs`;

const endpoint = {
    cars: {
        show_all_cars: () => `${BASE_CAR_URL}`,
        show_car_by_id: (id) => `${BASE_CAR_URL}/get_car_by_id/${id}`,
        create_car: () => `${BASE_CAR_URL}/create_car`,
        edit_car: (id) => `${BASE_CAR_URL}/edit_car/${id}`,
        delete_car: (id) => `${BASE_CAR_URL}/delete_car/${id}`
    },
    maintenance_log: {
        show_all_mlog: (car_id) => `${BASE_MAINTENANCE_LOG_URL}/${car_id}`,
        show_mlog_by_id: (id) => `${BASE_MAINTENANCE_LOG_URL}/get_maintenance_record_by_id/${id}`,
        create_mlog: (car_id) => `${BASE_MAINTENANCE_LOG_URL}/create_maintenance_record/${car_id}`,
        edit_mlog: (id) => `${BASE_MAINTENANCE_LOG_URL}/edit_maintenance_record/${id}`,
        delete_mlog: (id) => `${BASE_MAINTENANCE_LOG_URL}/delete_maintenance_record/${id}`
    }
};

async function request(URL, method = "GET", data = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(URL, options);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ "detail": "Unknown error!" }));
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
        delete_car: (id) => request(endpoint.cars.delete_car(id), "DELETE")
    },
    maintenance_log: {
        show_all_mlog: (car_id) => request(endpoint.maintenance_log.show_all_mlog(car_id)),
        show_mlog_by_id: (id) => request(endpoint.maintenance_log.show_mlog_by_id(id)),
        create_mlog: (car_id, data) => request(endpoint.maintenance_log.create_mlog(car_id), "POST", data),
        edit_mlog: (id, data) => request(endpoint.maintenance_log.edit_mlog(id), "PATCH", data),
        delete_mlog: (id) => request(endpoint.maintenance_log.delete_mlog(id), "DELETE")
    }
};