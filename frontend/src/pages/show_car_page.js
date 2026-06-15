import { BaseWindow } from "./base_view";
import { api } from "../apiRoutes";

export class ShowCarPage extends BaseWindow {
    constructor(title) {
        super(title);
        this.images = {
            "mileage": "assets/speedometer.svg",
            "engine_capacity": "assets/box.svg",
            "fuel_type": "assets/fuel-pump.svg",
            "oil_type": "assets/droplet.svg",
            "add_note_img": "assets/journal-plus.svg",
            "edit_car": "assets/edit_car.svg"
        };
        this.indicators = {
            0: { "img": "assets/empty_car_log.svg", "color": "#dddddd" },
            1: { "img": "assets/emoji-ok.svg", "color": "#1d995d" },
            2: { "img": "assets/emoji-normal.svg", "color": "#db8956" },
            3: { "img": "assets/emoji-critical.svg", "color": "#be5651" },
            4: { "img": "assets/emoji-overdue.svg", "color": "#595353" },
        };

        this.info_about_car_keys = ["mileage", "engine_capacity", "fuel_type", "oil_type"];

        this.cars = [];
    }

    icon_value_text(image_path, text, element = "div", data_path = "") {
    
    const pathAttr = (element === "button" && data_path) ? `data-path="${data_path}"` : "";

    return `
        <${element} ${pathAttr} class="flex gap-2 m-2 cursor-pointer items-center justify-start">
            <img src="${image_path}" alt="" class="h-5 w-5 md:h-7 md:w-7 lg:h-9 lg:w-9 shrink-0" />
            <span class="text-xs md:text-base lg:text-lg inline-flex items-center font-medium">
                ${text}
            </span>
        </${element}>
    `;
}

    render_car_card(car_data) {
    const worstMaintenanceId = car_data["service_indicators"]["worst_maintenance"];
    const indicatorColor = this.indicators[worstMaintenanceId]["color"];
    const indicatorImg = this.indicators[worstMaintenanceId]["img"];

    return `
        <article class="car_card border border-gray-200 bg-white flex flex-col md:flex-row items-stretch rounded-xl overflow-hidden shadow-sm m-4">
            
            <img
                src="assets/unknown_car.svg"
                alt=""
                class="w-full h-48 md:w-80 md:h-auto object-cover shrink-0 self-stretch"
            />

            <div class="car_info flex-1 p-5 flex flex-col sm:flex-row justify-start items-start sm:items-center gap-6 md:gap-16">
                
                <div class="info_about_car flex flex-col gap-4 w-full">
                    <p class="text-lg md:text-xl lg:text-2xl font-bold">
                        ${car_data["brand"]} ${car_data["model"]}
                    </p>
                    ${
                        this.info_about_car_keys.map(key => 
                            this.icon_value_text(this.images[key], car_data[key])
                        ).join("")
                    }
                </div>

                <div class="manage_btn_and_indicators w-full sm:w-auto flex flex-col-reverse gap-2 whitespace-nowrap pr-4 md:pr-12">
                    ${this.icon_value_text(
                        indicatorImg, 
                        car_data["service_indicators"]["text_indicator"]
                    )}
                    
                    ${this.icon_value_text(
                        this.images.add_note_img, 
                        "Додати ремонт", 
                        "button",
                        `/create_maintenance_record/${car_data["id"]}`
                    )}

                    ${this.icon_value_text(
                        this.images.edit_car, 
                        "Редагувати", 
                        "button",
                        `/edit_car/${car_data["id"]}`
                    )}
                </div>
            </div>

            <div class="car_indicator h-4 w-full md:h-auto md:w-16 shrink-0" style="background-color: ${indicatorColor}"></div>
        </article>
    `;
}
    content() {
        console.log(this.cars);
        const cars_cards = Object.values(this.cars).map(car => this.render_car_card(car)).join("");
        return cars_cards;
    }

    async render() {
        super.render("<div class='text-center p-10 font-bold text-xl'>Завантаження списку автомобілів...</div>");
        try {
            this.cars = await this.get_all_cars();
            const html = this.content();
            super.render(html);
        }
        catch(error) {
            console.log(`Error with car loading: ${error}`);
            super.render("<div class='text-center p-10 text-red-500 font-bold'>Не вдалося завантажити дані.</div>");
        }
    }
    async get_all_cars() {
        const cars_data = await api.cars.show_all_cars();
        return cars_data;
    }
}






