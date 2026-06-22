import { BaseWindow } from "./base_view";
import { router } from "../router";
import { api } from "../apiRoutes";
import { ROLE, CAR_CARD_DETAILS, MAINTENANCE_TYPES, INDICATORS } from "../../config";
import { icon_value_text } from "../components/icon_value_comp";
import { Form } from "../components/form_elements";

const form = new Form();
export class GetCarPage extends BaseWindow {
    constructor(title, id) {
        super(title);
        this.id = id;
        this.car = null;
        this.visibility = localStorage.getItem("role") === ROLE.USER ? "hidden" : "";
    }

   generate_car_detail() {
    let fields = [];
    CAR_CARD_DETAILS.slice(1).forEach(field => {
        fields.push(`
            <div class="flex flex-col pr-4 lg:border-r lg:last:border-r-0 lg:border-gray-100 lg:last:pr-0">
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">${field.LABEL}</span>
                <span class="text-xl md:text-2xl font-black text-gray-900 mt-0.5">${this.car[field.ID] || "—"}</span>
            </div>
        `);
    });
    return fields;
}

    generate_indicators_fields() {
        let fields = [];
        const svg_circle = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-full h-full">
            <circle cx="8" cy="8" r="8" fill="currentColor"/>
        </svg>`;

        MAINTENANCE_TYPES.forEach(field => {
            const indicatorStatus = this.car.service_indicators[field.ID];
            const colorHex = INDICATORS[indicatorStatus]?.color || "#dddddd";

            fields.push(`
                <div class="p-2">
                   ${icon_value_text(
                        svg_circle,
                        field.LABEL,
                        "button",
                        "",
                        "text-sm md:text-base font-semibold text-gray-700 m-1",
                        "h-4 w-4 md:h-5 md:w-5",
                        colorHex
                    )}
                </div>
            `);
        });
        return fields;
    }

    content(maintenance_enum, filter_res) {
        const maintenance_type_show_values = maintenance_enum.map(val => val.name);
        const maintenance_type_values = maintenance_enum.map(val => val.id);
        
        return `
            <div class="max-w-6xl w-full mx-auto p-4 md:p-8 animate-fade-in">
                <article class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch gap-6 md:gap-10 p-6 md:p-8">
                    
                    <div class="w-full md:w-1/3 shrink-0 flex flex-col gap-4">
                        <div class=" h-full aspect-video md:aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <img
                                src="assets/unknown_car.svg"
                                alt="Car Photo"
                                class="w-full h-full object-contain p-4"
                            />
                        </div>
                        
                        <button data-path="/cars" class="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-center text-sm md:text-base">
                            ← Назад до списку
                        </button>
                    </div>

                    <div id="car_info" class="flex-1 flex flex-col gap-6 justify-between">
                        
                        <div>
                            <h1 class="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 mb-2">
                                ${this.car["brand"]} ${this.car["model"]}
                            </h1>
                            <div class="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-md font-mono text-xs md:text-sm uppercase tracking-wide border border-gray-200">
                                <span class="text-gray-400 font-sans font-bold">VIN:</span> ${this.car["vin"] || "НЕ ВКАЗАНО"}
                            </div>
                        </div>

                        <div>
                            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-100 pb-2">Характеристики</h3>
                            <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                ${this.generate_car_detail().join("")}
                            </div>
                        </div>

                        <div>
                            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-100 pb-2">Стан</h3>
                            <div class="flex flex-col">
                                ${this.generate_indicators_fields().join("")}
                            </div>
                        </div>

                    </div>
                </article>
                <div>  
                    <div id="filter">  
                        <h3>Фільтр</h3>
                        <form id="filter_form" action="">
                            ${form.create_select(
                                "Тип ремонту",
                                "maintenance_type",
                                maintenance_type_values,
                                "",
                                "",
                                maintenance_type_show_values
                            )}

                            <fieldset class="border-none p-0 m-0">
                                <legend class="font-bold text-gray-700 mb-2">Сортування</legend>
                                <div class="space-y-2">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="sort_order" value="desc" checked class="w-4 h-4 text-green-600">
                                    <span>Спочатку найновіші</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="sort_order" value="asc" class="w-4 h-4 text-green-600">
                                    <span>Спочатку найстаріші</span>
                                </label>
                                </div>
                            </fieldset>
                            <input 
                                type="submit" 
                                value="Підтвердити"
                                class="w-full py-3 px-6 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-5 cursor-pointer">
                        </form>
                    </div>
                    <div id="maintenances">  
        
                    </div>
                </div>
            </div>
        `;
    }
    show_maintenance_logs() {
        const filter_form = document.querySelector("#filter_form");
        const maintenances = document.querySelector("#maintenances");
        let filter_data;
        if(filter_form) {
            filter_form.addEventListener("submit", async (event) => {
                event.preventDefault();
                const form_data = new FormData(filter_form);
                filter_data = Object.fromEntries(form_data.entries());
                const maintenance_logs = await api.maintenance_log.show_all_mlog(this.id, filter_data);
                console.log(maintenance_logs);
                maintenances.innerText = `${filter_data.maintenance_type}`
            })
        }
        
    }

    async render() {
        super.render("<div class='text-center p-10 font-bold text-xl text-gray-500'>Завантаження інформації про автомобіль...</div>");
        try {
            this.car = await api.cars.show_car_by_id(this.id);
            const maintenance_enum = await api.enum.get_enums(3);
            const html = this.content(maintenance_enum);
            super.render(html);
            this.show_maintenance_logs();

            
        }
        catch(error) {
            console.log(`Error with car loading: ${error}`);
            super.render("<div class='text-center p-10 text-red-500 font-bold'>Не вдалося завантажити дані автомобіля.</div>");
        }
    }
}