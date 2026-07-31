import { router } from "./router";
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8001"
    : "https://vehicle-maintenance-system-nqzv.onrender.com";
const BASE_API_URL = `${BASE_URL}/v1`;
export const BASE_CAR_PHOTO_API_URL = `${BASE_API_URL}/car_photos`;
const BASE_CAR_URL = `${BASE_API_URL}/cars`;
const BASE_MAINTENANCE_LOG_URL = `${BASE_API_URL}/maintenance_logs`;
const BASE_USERS_URL = `${BASE_API_URL}/users`;
const BASE_FUEL_LOG_URL = `${BASE_API_URL}/fuel_logs`;

const endpoint = {
  cars: {
    show_all_cars: () => `${BASE_CAR_URL}`,
    show_car_by_id: (car_id, params ={}) => {
      console.log(params)
      let query_params = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
          const final_value = Array.isArray(value) ? value.join(",") : value; 
          query_params.append(key, final_value);
        }
      }

      const query_string = query_params.toString();
      const suffix = query_string ? `?${query_string}` : "";

      return `${BASE_CAR_URL}/${car_id}${suffix}`;
    },
    create_car: () => `${BASE_CAR_URL}`,
    edit_car: (id) => `${BASE_CAR_URL}/${id}`,
    delete_car: (id) => `${BASE_CAR_URL}/${id}`,
    upload_car_photo: (id) => `${BASE_CAR_PHOTO_API_URL}/upload/${id}`,
  },
  maintenance_log: {
    show_all_mlog: (params = {}) => {
      let query_params = new URLSearchParams();

      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
          query_params.append(key, value);
        }
      }

      const query_string = query_params.toString();
      const sufix = query_string ? `?${query_string}` : "";

      return `${BASE_MAINTENANCE_LOG_URL}/${sufix}`;
    },
    show_mlog_by_id: (id) =>
      `${BASE_MAINTENANCE_LOG_URL}/${id}`,
    create_mlog: (car_id) =>
      `${BASE_MAINTENANCE_LOG_URL}/${car_id}`,
    edit_mlog: (id) =>
      `${BASE_MAINTENANCE_LOG_URL}/${id}`,
    delete_mlog: (id) =>
      `${BASE_MAINTENANCE_LOG_URL}/${id}`,
  },
  enum: {
    get_enums: (enum_id) => `${BASE_API_URL}/get_enums/${enum_id}`,
  },
  users: {
    register: () => `${BASE_USERS_URL}/register`,
    login: () => `${BASE_USERS_URL}/login`,
    logout: () => `${BASE_USERS_URL}/logout`,
    get_me: () => `${BASE_USERS_URL}/get_me`,
    change_password: () => `${BASE_USERS_URL}/change_password`,
  },
  fuel_log: {
    get_logs: (params ={}) => {
      console.log(params)
      let query_params = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
          query_params.append(key, value);
        }
      }

      const query_string = query_params.toString();
      const suffix = query_string ? `?${query_string}` : "";

      return `${BASE_FUEL_LOG_URL}/${suffix}`;
    },
    create_log: (car_id) => `${BASE_FUEL_LOG_URL}/${car_id}`,
    get_fuel_consumption: (car_id) => `${BASE_FUEL_LOG_URL}/monthly_fuel_consumption/${car_id}`
  }
};

async function request(URL, method = "GET", data = null) {
  const options = {
    method,
    headers: {},
    credentials: "include",
  };

  if (data && method !== "GET" && method !== "HEAD") {
    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
  }

  const response = await fetch(URL, options);
  if (response.status === 401) {
    const loginURl = endpoint.users.login();
    if (URL !== loginURl) {
      console.warn("Бекенд повернув 401. Перенаправляємо на логін...");
      router.navigate("/login");
      throw new Error("Сесія закінчилася. Будь ласка, увійдіть знову.");
    }
  }
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Unknown error!" }));
    if (typeof error.detail === "object" && error.detail !== null) {
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
    show_car_by_id: (id, params={}) => request(endpoint.cars.show_car_by_id(id, params)),
    create_car: (data) => request(endpoint.cars.create_car(), "POST", data),
    edit_car: (id, data) => request(endpoint.cars.edit_car(id), "PATCH", data),
    delete_car: (id) => request(endpoint.cars.delete_car(id), "DELETE"),
    upload_car_photo: (id, photo) =>
      request(endpoint.cars.upload_car_photo(id), "POST", photo),
  },
  maintenance_log: {
    show_all_mlog: (params = {}) =>
      request(endpoint.maintenance_log.show_all_mlog(params)),
    show_mlog_by_id: (id) =>
      request(endpoint.maintenance_log.show_mlog_by_id(id)),
    create_mlog: (car_id, data) =>
      request(endpoint.maintenance_log.create_mlog(car_id), "POST", data),
    edit_mlog: (id, data) =>
      request(endpoint.maintenance_log.edit_mlog(id), "PATCH", data),
    delete_mlog: (id) =>
      request(endpoint.maintenance_log.delete_mlog(id), "DELETE"),
  },
  enum: {
    get_enums: (enum_id) => request(endpoint.enum.get_enums(enum_id)),
  },
  users: {
    register: (data) => request(endpoint.users.register(), "POST", data),
    login: (data) => request(endpoint.users.login(), "POST", data),
    logout: (data) => request(endpoint.users.logout()),
    get_me: () => request(endpoint.users.get_me()),
    change_password: (data) =>
      request(endpoint.users.change_password(), "PATCH", data),
  },
  fuel_log: {
    get_logs: (car_id, params = {}) => request(endpoint.fuel_log.get_logs(car_id, params)),
    create_log: (car_id, data) => request(endpoint.fuel_log.create_log(car_id), "POST", data),
    get_monthly_consumption: (car_id) => request(endpoint.fuel_log.get_fuel_consumption(car_id), "GET"),
  },
};
