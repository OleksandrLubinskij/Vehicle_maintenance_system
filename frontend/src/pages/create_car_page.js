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
                <div class="mt-8 pt-6 border-t border-gray-100">
                    <span class="text-sm md:text-base font-semibold text-gray-700">Фото автомобіля</span>
                    
                    <div class="w-full">
                        <label for="car_image" class="relative flex flex-col items-center justify-center w-full h-32 md:h-40 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:border-emerald-500 transition-colors duration-200 cursor-pointer group  mt-3">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                <svg class="w-8 h-8 mb-3 text-gray-400 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p class="mb-1 text-sm text-gray-500 font-medium">
                                    <span class="font-bold text-emerald-600">Натисніть тут</span>, щоб обрати файл
                                </p>
                                <p class="text-xs text-gray-400 font-medium mt-1">
                                    JPG, PNG (бажано вертикальне)
                                </p>
                            </div>
                            <input type="file" id="car_image" name="car_image" accept="image/*" class="hidden">
                        </label>
                        <div id="file_name_display" class="mt-2 text-xs text-center text-emerald-600 font-bold hidden"></div>
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

            const fileInput = document.querySelector("#car_image");
            const fileNameDisplay = document.querySelector("#file_name_display");

            if (fileInput && fileNameDisplay) {
                fileInput.addEventListener("change", function() {
                    if (this.files && this.files.length > 0) {
                        fileNameDisplay.textContent = `Вибрано файл: ${this.files[0].name}`;
                        fileNameDisplay.classList.remove("hidden");
                    } else {
                        fileNameDisplay.classList.add("hidden");
                    }
                });
            }
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