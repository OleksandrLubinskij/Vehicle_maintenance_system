import { BaseWindow } from "./base_view";
import { api } from "../apiRoutes";
import { Form } from "../components/form_elements";

export class CreateCarPage extends BaseWindow {
    constructor(title) {
        super(title)
        this.form_fields = {
            "VIN":"vin",
            "Brand": "brand",
            "Model": "model",
            "Mileage": "mileage",
            "Engine capacity": "engine_capacity"
        }
    };

    create_add_car_form(fuel_enum, oil_enum) {
        const form = new Form();
        let form_fields = [];

        const fuel_values = fuel_enum.map(val => val.name);
        const oil_values = oil_enum.map(val => val.name);

        for (const [key, val] of Object.entries(this.form_fields)) {
            // Якщо поле — VIN, передаємо клас для розширення, інакше — пустий рядок
            const extra_class = (key === "VIN") ? "md:col-span-2" : "";
            
            const field = form.create_entry(key, val, "input", extra_class);
            form_fields.push(field);
        }

        return `
        <form action="POST" class="max-w-2xl w-full mx-auto mt-5">
            <div class="border border-gray-200 rounded-2xl bg-white p-8 shadow-md">
                <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
                    ${
                        form_fields.join("")
                    }
                    ${
                        form.create_select("Fuel type", "fuel_type", fuel_values)
                    }
                    ${
                        form.create_select("Oil type", "oil_type", oil_values)
                    }
                </div>
            </div>
            <input 
                type="submit" 
                value="Підтвердити"
                class="w-full py-3 px-6 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-5 cursor-pointer">
        </form>
        `
    };

    content(fuel_enum, oil_enum) {
        return `
            <div class="flex flex-col">
                <h1 class="text-center font-bold text-lg md:text-2xl lg:text-4xl m-10">Додати машину</h1>
                ${this.create_add_car_form(fuel_enum, oil_enum)}
            </div>
        `
    }

    async render() {
        try {
        const fuel_enum = await api.enum.get_enums(1);
        const oil_enum = await api.enum.get_enums(2);
        console.log(fuel_enum);
        console.log(oil_enum);
        const html = this.content(fuel_enum, oil_enum);
        super.render(html);
    } catch(error) {
        console.error("Помилка завантаження енумів:", error);
        super.render("<p class='text-center text-red-500'>Не вдалося завантажити дані</p>");
    }
    }
}