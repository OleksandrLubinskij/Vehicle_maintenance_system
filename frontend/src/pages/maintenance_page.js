import { BaseWindow } from "./base_view";
import { MAINTENANCE_LOG_FIELDS } from "../../config";
import { MAINTENACE_LOG } from "../../MaintainenceLogConfig";
import { api } from "../apiRoutes";
class ManageMaintenancePage extends BaseWindow {
    constructor(title, id) {
        super(title);
        this.id = id;
    }

    create_maintenance_record_form(maintenance_type_enum, def_val=null) {
        return `
        <form action="/cars" id="manage_maintenance_form" class="max-w-2xl w-full mx-auto mt-5">
            <div class="border border-gray-200 rounded-2xl bg-white p-8 shadow-md">
                <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
                    ${form.create_entry(MAINTENANCE_LOG_FIELDS[0].LABEL, MAINTENANCE_LOG_FIELDS[0].ID, "", def_val[MAINTENACE_LOG.mileage_on_maintain])}
                    ${form.create_select(MAINTENANCE_LOG_FIELDS[1].LABEL, MAINTENANCE_LOG_FIELDS[1].ID, maintenance_type_enum, "", def_val[MAINTENACE_LOG.maintenance_type])}
                    ${form.create_textarea(MAINTENANCE_LOG_FIELDS[2].LABEL, MAINTENANCE_LOG_FIELDS[2].ID, 50, 4, def_val[MAINTENACE_LOG.description])}
                </div>
            </div>
            <input 
                type="submit" 
                value="${this.id === null ? "Додати" : "Зберегти зміни"}"
                class="w-full py-3 px-6 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-5 cursor-pointer">
        </form>
        `;
    }

    content(maintenance_type_enum, default_values = null) {
        return `
            <div class="flex flex-col">
                <h1 class="text-center font-bold text-lg md:text-2xl lg:text-4xl">
                    ${this.id === null ? "Додати ремонт" : "Редагувати ремонт"}
                </h1>
                ${this.create_add_car_form(maintenance_type_enum, default_values)}
            </div>
        `;
    }

    async render() {
            try {
                const maintenance_type_enum = await api.enum.get_enums(3);
                const default_values = this.id === null ? null : await api.maintenance_log.show_mlog_by_id(this.id);
                
                const html = this.content(maintenance_type_enum, default_values);
                super.render(html);
    
                const manage_maintenance_form = document.querySelector("#manage_maintenance_form");
                if (manage_maintenance_form) {
                    manage_maintenance_form.addEventListener("submit", async (event) => {
                        event.preventDefault();
    
                        const formData = new FormData(manage_maintenance_form);
                        const maintenance_data = Object.fromEntries(formData.entries());
                        
                        if (maintenance_data.mileage_on_maintain) maintenance_data.mileage_on_maintain = Number(maintenance_data.mileage_on_maintain);
                        
                        try {
                            if (this.id) {
                                await api.maintenance_log.edit_mlog(this.id, maintenance_data);
                                console.log("Дані про ремонт успішно оновлено");
                            } else {
                                await api.maintenance_log.create_mlog(maintenance_data);
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