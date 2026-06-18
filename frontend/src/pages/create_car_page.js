import { BaseWindow } from "./base_view";
import { api } from "../apiRoutes";
import { Form } from "../components/form_elements";
import { PAGE_MODE, CAR_INPUT_FIELDS, CAR_SELECT_FIELDS } from "../../config";
import { CAR } from "../../DBConfig";
import { router } from "../router";
export class CreateCarPage extends BaseWindow {
    constructor(title, id = null) {
        super(title);
        this.id = id;
    }

    create_add_car_form(fuel_enum, oil_enum, default_values = null) {
        const form = new Form();
        let form_fields = [];

        const fuel_values = fuel_enum.map(val => val.name);
        const oil_values = oil_enum.map(val => val.name);
        
        for (const field_identificator of CAR_INPUT_FIELDS) {
            const extra_class = (field_identificator.LABEL === "VIN") ? "md:col-span-2" : "";
            
            const def_val = default_values ? default_values[field_identificator.ID] : null; 
            
            const field = form.create_entry(field_identificator.LABEL, field_identificator.ID, "input", extra_class, def_val);
            form_fields.push(field);
        }

        return `
        <form action="/cars" id="create_car_form" class="max-w-2xl w-full mx-auto mt-5">
            <div class="border border-gray-200 rounded-2xl bg-white p-8 shadow-md">
                <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
                    ${form_fields.join("")}
                    ${form.create_select(   
                        CAR_SELECT_FIELDS[0].LABEL, 
                        CAR_SELECT_FIELDS[0].ID, 
                        fuel_values,
                        "",
                        default_values?.[CAR.fuel_type]
                    )}
                    ${form.create_select(
                        CAR_SELECT_FIELDS[1].LABEL, 
                        CAR_SELECT_FIELDS[1].ID,
                        oil_values,
                        "",
                        default_values?.[CAR.oil_type]
                    )}
                </div>
            </div>
            <input 
                type="submit" 
                value="${this.id === null ? "Додати" : "Зберегти зміни"}"
                class="w-full py-3 px-6 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-5 cursor-pointer">
        </form>
        `;
    }

    content(fuel_enum, oil_enum, default_values = null, car_brand_model = null) {
        return `
            <div class="flex flex-col">
                <h1 class="text-center font-bold text-lg md:text-2xl lg:text-4xl mb-4">
                    ${this.id === null ? "Додати машину" : "Редагувати машину"}
                </h1>

                ${car_brand_model ? `
                    <div class="text-center text-sm md:text-base lg:text-lg font-semibold text-gray-500 tracking-wide uppercase">
                        <span class="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            ${car_brand_model.brand} ${car_brand_model.model}
                        </span>
                    </div>
                ` : ""}
                ${this.create_add_car_form(fuel_enum, oil_enum, default_values)}
            </div>
        `;
    }

    async render() {
        try {
            const fuel_enum = await api.enum.get_enums(1);
            const oil_enum = await api.enum.get_enums(2);
            const car_brand_model = this.id === null ? null : await api.cars.get_car_brand_and_model(this.id);
            const default_values = this.id === null ? null : await api.cars.show_car_by_id(this.id);
            
            const html = this.content(fuel_enum, oil_enum, default_values, car_brand_model);
            super.render(html);

            const create_car_form = document.querySelector("#create_car_form");
            if (create_car_form) {
                create_car_form.addEventListener("submit", async (event) => {
                    event.preventDefault();

                    const formData = new FormData(create_car_form);
                    const car_data = Object.fromEntries(formData.entries());
                    
                    if (car_data.mileage) car_data.mileage = Number(car_data.mileage);
                    if (car_data.engine_capacity) car_data.engine_capacity = Number(car_data.engine_capacity);
                    
                    try {
                        if (this.id) {
                            await api.cars.edit_car(this.id, car_data);
                            console.log("Машину успішно оновлено");
                        } else {
                            await api.cars.create_car(car_data);
                            console.log("Машину успішно створено");
                        }
                        router.navigate("/cars");
                    } catch (error) {
                        console.error("Помилка при відправці даних:", error);
                        alert("Не вдалося зберегти дані автомобіля.");
                    }
                });
            }
            
        } catch (error) {
            console.error("Помилка завантаження енумів:", error);
            super.render("<p class='text-center text-red-500'>Не вдалося завантажити дані</p>");
        }
    }
}