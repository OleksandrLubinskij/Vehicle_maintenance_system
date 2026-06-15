import { BaseWindow } from "./base_view";
import { MAINTENANCE_LOG_FIELDS } from "../../config";
class ManageMaintenancePage extends BaseWindow {
    constructor(title, id) {
        super(title);
        this.id = id;
    }

    create_maintenance_record_form(maintenance_type_enum, def_val=null) {
        return `
        <form action="/cars" id="create_maintenance_record_form" class="max-w-2xl w-full mx-auto mt-5">
            <div class="border border-gray-200 rounded-2xl bg-white p-8 shadow-md">
                <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
                    ${form.create_entry(MAINTENANCE_LOG_FIELDS[0].LABEL, MAINTENANCE_LOG_FIELDS[0].ID)}
                    ${form.create_select(MAINTENANCE_LOG_FIELDS[1].LABEL, MAINTENANCE_LOG_FIELDS[1].ID, maintenance_type_values)}
                </div>
            </div>
            <input 
                type="submit" 
                value="${this.id === null ? "Додати" : "Зберегти зміни"}"
                class="w-full py-3 px-6 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-5 cursor-pointer">
        </form>
        `;
    }
}