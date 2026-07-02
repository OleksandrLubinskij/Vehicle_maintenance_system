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
                "img": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-minus" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M5.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5"/>
  <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
  <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
</svg>`, 
                "color": "#dddddd", 
                "text_color": "#4b5563" // Нейтральний темно-сірий (Tailwind gray-600)
            },
            1: { 
                "img": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-grin" viewBox="0 0 16 16">
  <path d="M12.946 11.398A6.002 6.002 0 0 1 2.108 9.14c-.114-.595.426-1.068 1.028-.997C4.405 8.289 6.48 8.5 8 8.5s3.595-.21 4.864-.358c.602-.07 1.142.402 1.028.998a5.95 5.95 0 0 1-.946 2.258m-.078-2.25C11.588 9.295 9.539 9.5 8 9.5s-3.589-.205-4.868-.352c.11.468.286.91.517 1.317A37 37 0 0 0 8 10.75a37 37 0 0 0 4.351-.285c.231-.407.407-.85.517-1.317m-1.36 2.416c-1.02.1-2.255.186-3.508.186s-2.488-.086-3.507-.186A5 5 0 0 0 8 13a5 5 0 0 0 3.507-1.436ZM6.488 7c.114-.294.179-.636.179-1 0-1.105-.597-2-1.334-2C4.597 4 4 4.895 4 6c0 .364.065.706.178 1 .23-.598.662-1 1.155-1 .494 0 .925.402 1.155 1M12 6c0 .364-.065.706-.178 1-.23-.598-.662-1-1.155-1-.494 0-.925.402-1.155 1a2.8 2.8 0 0 1-.179-1c0-1.105.597-2 1.334-2C11.403 4 12 4.895 12 6"/>
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14"/>
</svg>`, 
                "color": "#1d995d", 
                "text_color": "#146c43" // Глибокий темно-зелений для хорошого стану
            },
            2: { 
                "img": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-expressionless" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
</svg>`, 
                "color": "#db8956", 
                "text_color": "#a05228" // Стриманий темно-помаранчевий
            },
            3: { 
                "img": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-grimace" viewBox="0 0 16 16">
  <path d="M7 6.25c0 .69-.448 1.25-1 1.25s-1-.56-1-1.25S5.448 5 6 5s1 .56 1 1.25m3 1.25c.552 0 1-.56 1-1.25S10.552 5 10 5s-1 .56-1 1.25.448 1.25 1 1.25m2.98 3.25A1.5 1.5 0 0 1 11.5 12h-7a1.5 1.5 0 0 1-1.48-1.747v-.003A1.5 1.5 0 0 1 4.5 9h7a1.5 1.5 0 0 1 1.48 1.747zm-8.48.75h.25v-.75H3.531a1 1 0 0 0 .969.75m7 0a1 1 0 0 0 .969-.75H11.25v.75zm.969-1.25a1 1 0 0 0-.969-.75h-.25v.75zM4.5 9.5a1 1 0 0 0-.969.75H4.75V9.5zm1.75 2v-.75h-1v.75zm.5 0h1v-.75h-1zm1.5 0h1v-.75h-1zm1.5 0h1v-.75h-1zm1-2h-1v.75h1zm-1.5 0h-1v.75h1zm-1.5 0h-1v.75h1zm-1.5 0h-1v.75h1z"/>
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14"/>
</svg>`, 
                "color": "#be5651", 
                "text_color": "#8c322e" // Бордово-червоний для критичного стану
            },
            4: { 
                "img": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-dizzy" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708m-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708M10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/>
</svg>`, 
                "color": "#595353", 
                "text_color": "#212529" // Майже чорний/графітовий для протермінованого
            },
        };