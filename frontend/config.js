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

export const CAR_TEXT_FIELDS = [
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

export const CAR_OPTION_FIELDS = [
    {
        LABEL:"Тип пального",
        ID:"fuel_type"
    },
    {
        LABEL:"Тип масла",
        ID:"oil_type"
    },
];

export const CAR_CARD_DETAILS = [
    CAR_TEXT_FIELDS.find(f => f.ID === "vin"),
    CAR_TEXT_FIELDS.find(f => f.ID === "mileage"),
    CAR_TEXT_FIELDS.find(f => f.ID === "engine_capacity"),
    ...CAR_OPTION_FIELDS
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

export const MAINTENANCE_TYPES = [
    {
        LABEL: "Заміна масел та фільтрів",
        ID: "oil_and_filters"
    },
    {
        LABEL: "Заміна ременя ГРМ",
        ID: "belt_replacement"
    },
    {
        LABEL: "Тех. огляд",
        ID: "inspection"
    },
]

export const INDICATORS = {
            0: { 
                "img": "assets/empty_car_log.svg", 
                "color": "#dddddd", 
                "text_color": "#4b5563" // Нейтральний темно-сірий (Tailwind gray-600)
            },
            1: { 
                "img": "assets/emoji-ok.svg", 
                "color": "#1d995d", 
                "text_color": "#146c43" // Глибокий темно-зелений для хорошого стану
            },
            2: { 
                "img": "assets/emoji-normal.svg", 
                "color": "#db8956", 
                "text_color": "#a05228" // Стриманий темно-помаранчевий
            },
            3: { 
                "img": "assets/emoji-critical.svg", 
                "color": "#be5651", 
                "text_color": "#8c322e" // Бордово-червоний для критичного стану
            },
            4: { 
                "img": "assets/emoji-overdue.svg", 
                "color": "#595353", 
                "text_color": "#212529" // Майже чорний/графітовий для протермінованого
            },
        };