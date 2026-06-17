export const PAGE_MODE = {
    CREATE: "create",
    EDIT: "edit"
};

export const AUTHORIZATION_PAGE_MODE = {
    LOGIN: "login",
    REGISTER: "register"
}

export const MAINTENANCE_LOG_FIELDS = [
    {
        LABEL:"Пробіг",
        ID:"mileage_on_maintain"
    },
    {
        LABEL:"Тип ремонту",
        ID:"maintenance_type"
    },
    {
        LABEL:"Опис",
        ID:"description"
    },
];

export const CAR_INPUT_FIELDS = [
    {
        LABEL:"VIN",
        ID:"vin"
    },
    {
        LABEL:"Бренд",
        ID:"brand"
    },
    {
        LABEL:"Модель",
        ID:"model"
    },
    {
        LABEL:"Пробіг",
        ID:"mileage"
    },
    {
        LABEL:"Об'єм двигуна",
        ID:"engine_capacity"
    },
];

export const CAR_SELECT_FIELDS = [
    {
        LABEL:"Тип пального",
        ID:"fuel_type"
    },
    {
        LABEL:"Тип масла",
        ID:"oil_type"
    },
];

export const AUTHORIZATION_INPUT_FIELDS = [
    {
        LABEL:"Логін",
        ID:"login"
    },
    {
        LABEL:"Пароль",
        ID:"password"
    },
    {
        LABEL:"Підтвердженя паролю",
        ID:"confirm_password"
    }
]

export const ROLE = {
    USER: "User",
    ADMIN: "Admin"
}