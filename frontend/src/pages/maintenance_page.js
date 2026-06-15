import { BaseWindow } from "./base_view";
import { Form } from "../components/form_elements";
import { MAINTENANCE_LOG_FIELDS, PAGE_MODE } from "../../config";
import { MAINTENACE_LOG } from "../../MaintainenceLogConfig";
import { api } from "../apiRoutes";
import { router } from "../router";
export class ManageMaintenancePage extends BaseWindow {
    constructor(title, id, mode) {
        super(title);
        this.id = id;
        this.mode = mode;
    }

    create_maintenance_record_form(maintenance_type_enum, actual_mileage, def_val=null) {
        const form = new Form();
        const maintenance_type_values = maintenance_type_enum.map(val => val.name);
        return `
        <form action="/cars" id="manage_maintenance_form" class="max-w-2xl w-full mx-auto mt-5">
            <div class="border border-gray-200 rounded-2xl bg-white p-8 shadow-md">
                <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
                    ${form.create_entry(
                        MAINTENANCE_LOG_FIELDS[0].LABEL, 
                        MAINTENANCE_LOG_FIELDS[0].ID, 
                        "text",
                        undefined,
                        actual_mileage===null ? def_val?.[MAINTENACE_LOG.mileage_on_maintain] : actual_mileage 
                    )}
                    ${form.create_select(
                        MAINTENANCE_LOG_FIELDS[1].LABEL, 
                        MAINTENANCE_LOG_FIELDS[1].ID, 
                        maintenance_type_values, 
                        "", 
                        def_val?.[MAINTENACE_LOG.maintenance_type]
                    )}
                    ${form.create_textarea(
                        MAINTENANCE_LOG_FIELDS[2].LABEL, 
                        MAINTENANCE_LOG_FIELDS[2].ID, 
                        10, 
                        2, 
                        def_val?.[MAINTENACE_LOG.description]
                    )}
                </div>
            </div>
            <input 
                type="submit" 
                value="${this.mode === PAGE_MODE.CREATE ? "Додати" : "Зберегти зміни"}"
                class="w-full py-3 px-6 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-5 cursor-pointer">
        </form>
        `;
    }

    content(maintenance_type_enum, actual_mileage=null, default_values = null) {
        return `
            <div class="flex flex-col">
                <h1 class="text-center font-bold text-lg md:text-2xl lg:text-4xl">
                    ${this.mode === PAGE_MODE.CREATE ? "Додати ремонт" : "Редагувати ремонт"}
                </h1>
                ${this.create_maintenance_record_form(maintenance_type_enum, actual_mileage, default_values)}
            </div>
        `;
    }

    async render() {
            try {
                const maintenance_type_enum = await api.enum.get_enums(3);
                const actual_mileage = this.mode === PAGE_MODE.EDIT  ? null : await api.cars.get_car_mileage(this.id)
                const default_values = this.mode === PAGE_MODE.CREATE ? null : await api.maintenance_log.show_mlog_by_id(this.id);
                
                const html = this.content(maintenance_type_enum, actual_mileage, default_values);
                super.render(html);
    
                const manage_maintenance_form = document.querySelector("#manage_maintenance_form");
                if (manage_maintenance_form) {
                    manage_maintenance_form.addEventListener("submit", async (event) => {
                        event.preventDefault();
    
                        const formData = new FormData(manage_maintenance_form);
                        const maintenance_data = Object.fromEntries(formData.entries());
                        
                        if (maintenance_data.mileage_on_maintain) maintenance_data.mileage_on_maintain = Number(maintenance_data.mileage_on_maintain);
                        
                        try {
                            if (this.mode === PAGE_MODE.EDIT) {
                                await api.maintenance_log.edit_mlog(this.id, maintenance_data);
                                console.log("Дані про ремонт успішно оновлено");
                            } else {
                                await api.maintenance_log.create_mlog(this.id, maintenance_data);
                                console.log("Дані про ремонт успішно створено");
                            }
                            router.navigate("/cars");
                        } catch (error) {
                            console.error("Помилка при відправці даних:", error);
                            alert("Не вдалося зберегти дані про ремонт");
                        }
                    });
                }
                
            } catch (error) {
                console.error("Помилка завантаження енумів:", error);
                super.render("<p class='text-center text-red-500'>Не вдалося завантажити дані</p>");
            }
        }
}