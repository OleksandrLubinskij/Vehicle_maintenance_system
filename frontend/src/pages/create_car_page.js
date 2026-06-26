import { BaseWindow } from "./base_view";
import { api } from "../apiRoutes";
import { Form } from "../components/form_elements";
import { PAGE_MODE, CAR_TEXT_FIELDS, CAR_OPTION_FIELDS } from "../../config";
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
        
        for (const field_identificator of CAR_TEXT_FIELDS) {
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
                        CAR_OPTION_FIELDS[0].LABEL, 
                        CAR_OPTION_FIELDS[0].ID, 
                        fuel_values,
                        "",
                        default_values?.[CAR.fuel_type]
                    )}
                    ${form.create_select(
                        CAR_OPTION_FIELDS[1].LABEL, 
                        CAR_OPTION_FIELDS[1].ID,
                        oil_values,
                        "",
                        default_values?.[CAR.oil_type]
                    )}
                </div>
                <div class="mt-6 pt-4 border-t border-gray-100">
                    <label for="car_image" class="block text-sm font-medium text-gray-700 mb-2">Фото автомобіля</label>
                    <input type="file" id="car_image" name="car_image" accept="image/*" 
                        class="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-emerald-50 file:text-emerald-700
                        hover:file:bg-emerald-100 cursor-pointer">
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
                    const image_file = formData.get("car_image");
                    formData.delete("car_image");
                    const car_data = Object.fromEntries(formData.entries());
                    
                    if (car_data.mileage) car_data.mileage = Number(car_data.mileage);
                    if (car_data.engine_capacity) car_data.engine_capacity = Number(car_data.engine_capacity);
                    
                    try {
                        let new_car;
                        const photo_endpoint = async (car_id, image, mode) => await this.upload_photo(car_id, image, mode)
                        if (this.id) {
                            await api.cars.edit_car(this.id, car_data);
                            console.log("Машину успішно оновлено");
                            await photo_endpoint(this.id, image_file, PAGE_MODE.EDIT);
                        } else {
                            new_car = await api.cars.create_car(car_data);
                            console.log("Машину успішно створено");
                            await photo_endpoint(new_car["car_id"], image_file, PAGE_MODE.CREATE);
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
    async upload_photo(car_id, image_file, mode) {
        if(image_file && image_file.size > 0 && car_id) {
            const imageFormData = new FormData();
            imageFormData.append("raw_photo", image_file);
            const endpoints = {
                [PAGE_MODE.EDIT]: async (car_id, image) => await api.cars.edit_car_photo(car_id, image),
                [PAGE_MODE.CREATE]: async (car_id, image) => await api.cars.upload_car_photo(car_id, image),
            }

            try {
                await endpoints[mode](car_id, imageFormData);
                console.log("Фото успішно завантажено");
                } catch (imgError) {            
                console.error("Помилка при завантаженні фото:", imgError);
                 alert("Машину збережено, але фото не вдалося завантажити.");
            }
        }               
    }
}