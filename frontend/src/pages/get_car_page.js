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
        this.images = {
            "arrow": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-caret-down-fill transition-transform duration-200 target-arrow" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>`,

            "edit": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                </svg>`,

            "delete": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>`
        }
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

    content(maintenance_enum) {
    const maintenance_type_show_values = maintenance_enum.map(val => val.name);
    const maintenance_type_values = maintenance_enum.map(val => val.id);
    
    return `
        <div id="delete_modal_overlay" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div class="border-2 border-gray-900 rounded-2xl bg-white w-full max-w-md p-6 shadow-2xl space-y-4">
                <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 class="text-lg font-black text-gray-900">Підтвердження видалення</h3>
                </div>
                
                <p class="text-sm font-medium text-gray-600 leading-relaxed">
                    Ця дія є незворотною. Уся історія ремонтів автомобіля буде стерта.
                </p>

                <div>
                    ${form.create_entry(
                        "Щоб видалити, введіть \"ВИДАЛИТИ\"",
                        "delete_car_input",
                        "input"
                    )}
                </div>

                <div class="flex gap-3 pt-2">
                    <button id="cancel_delete_btn" class="flex-1 py-2 px-4 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                        Скасувати
                    </button>
                    <button id="confirm_delete_btn" class="flex-1 py-2 px-4 text-sm font-bold text-white bg-[#be5651] hover:bg-red-700 active:bg-red-800 rounded-xl transition-colors uppercase">
                        Видалити
                    </button>
                </div>
            </div>
        </div>

        <div class="max-w-6xl w-full mx-auto p-4 md:p-8 animate-fade-in space-y-8">
            <article class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch gap-6 md:gap-10 p-6 md:p-8">
                <div class="w-full md:w-1/3 shrink-0 flex flex-col gap-4">
                    <div class=" h-full aspect-video md:aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <img src="assets/unknown_car.svg" alt="Car Photo" class="w-full h-full object-contain p-4" />
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

            <div class="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start">
                <div id="filter" class="w-full lg:w-1/4 shrink-0 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 class="text-xl font-black text-gray-900 mb-4">Фільтр</h3>
                    <form id="filter_form" class="space-y-5">
                        <div>
                            <label class="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Види робіт</label>
                            ${form.create_select(
                                "",
                                "maintenance_type",
                                ["", ...maintenance_type_values],
                                "",
                                "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500",
                                ["Усі", ...maintenance_type_show_values]
                            )}
                        </div>
                        <fieldset class="border-none p-0 mb-5">
                            <legend class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Сортування</legend>
                            <div class="space-y-2.5">
                                <label class="flex items-center gap-3 cursor-pointer group">
                                    <input type="radio" name="sort_order" value="desc" checked class="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300">
                                    <span class="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Спочатку найновіші</span>
                                </label>
                                <label class="flex items-center gap-3 cursor-pointer group">
                                    <input type="radio" name="sort_order" value="asc" class="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300">
                                    <span class="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Спочатку найстаріші</span>
                                </label>
                            </div>
                        </fieldset>
                        <input type="submit" value="Підтвердити" class="w-full py-2.5 px-4 text-sm font-bold text-white bg-[#146c43] hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all duration-200 cursor-pointer text-center">
                    </form>
                </div>

                <div id="maintenances" class="flex-1 w-full space-y-4"></div>
            </div>

            <div class="flex justify-center pt-4">
                <button id="delete_car" class="${this.visibility} py-2 px-4 text-xs font-bold text-gray-400 hover:text-red-600 border border-gray-300 hover:border-red-200 bg-transparent rounded-lg transition-all duration-200 cursor-pointer text-center uppercase">
                    Видалити машину
                </button>
            </div>
        </div>
    `;
}

    

    show_maintenance_logs() {
        const filter_form = document.querySelector("#filter_form");
        const maintenances = document.querySelector("#maintenances");
        
        const fetchAndRender = async () => {
            const form_data = new FormData(filter_form);
            const filter_data = Object.fromEntries(form_data.entries());
            
            if (!filter_data.maintenance_type) {
                delete filter_data.maintenance_type;
            }

            maintenances.innerHTML = "<div class='text-center p-6 text-gray-400 font-medium'>Завантаження історії...</div>";
            const maintenance_logs = await api.maintenance_log.show_all_mlog(this.id, filter_data);
            maintenances.innerHTML = this.render_maintenance_log(maintenance_logs);
            this.init_accordion_events();
        };

        if(filter_form) {
            filter_form.addEventListener("submit", async (event) => {
                event.preventDefault();
                await fetchAndRender();
            });
            
            fetchAndRender();
        }
        if(maintenances) {
            maintenances.addEventListener("click", async (event) => {
                const delete_btn = event.target.closest("#delete_log");
                if(delete_btn){
                    const delete_id = delete_btn.dataset.id;
                    const delete_confirm = confirm("Ви впевнені що хочете видалити запис?");

                    if(delete_confirm) {
                        try {
                            await api.maintenance_log.delete_mlog(delete_id);
                        await fetchAndRender(); 
                    } catch (error) {
                        console.error("Помилка при видаленні запису:", error);
                        alert("Не вдалося видалити запис. Спробуйте пізніше.");
                    }
                    }
                }
            })
        }
    }

    init_accordion_events() {
        const logs = document.querySelectorAll(".maintenance-item");
        logs.forEach(item => {
            const arrowBtn = item.querySelector(".show_description_btn");
            const descBlock = item.querySelector(".description_block");
            const arrowSvg = arrowBtn.querySelector(".target-arrow");

            arrowBtn.addEventListener("click", () => {
                if (descBlock.classList.contains("hidden")) {
                    descBlock.classList.remove("hidden");
                    arrowSvg.classList.add("rotate-180");
                } else {
                    descBlock.classList.add("hidden");
                    arrowSvg.classList.remove("rotate-180");
                }
            });
        });
    }

    render_maintenance_log(logs) {
        if (!logs || logs.length === 0) {
            return `<div class="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 font-semibold shadow-sm">Записів про ремонти не знайдено.</div>`;
        }

        const result = logs.map(log => {    
            const date_obj = new Date(log.date);
            let formatted_date = "—";
            if (!isNaN(date_obj)) {
                formatted_date = date_obj.toLocaleDateString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                });
            }
            
            return `
            <div class="maintenance-item w-full flex flex-col">
                <div class="bg-white border-2 border-gray-900 rounded-xl overflow-hidden flex flex-row items-stretch shadow-sm min-h-[4rem] md:min-h-[5rem]">
                    
                    <div class="flex-1 flex flex-col sm:grid sm:grid-cols-3 justify-center items-start sm:items-center px-4 py-2 sm:py-0 gap-1 sm:gap-2 font-bold text-gray-900 text-xs sm:text-sm md:text-base">
                        <div class="line-clamp-2 sm:truncate pr-2 w-full">${log.maintenance_type}</div>
                        <div class="text-left sm:text-center text-gray-700 font-medium text-[11px] sm:text-sm md:text-base">${log.mileage_on_maintain} км</div>
                        <div class="text-left sm:text-right text-gray-500 sm:text-gray-600 font-mono text-[10px] sm:text-sm md:text-base">${formatted_date}</div>
                    </div>

                    <div class="flex flex-row items-stretch shrink-0">
                        <button class="show_description_btn px-2.5 sm:px-4 bg-white hover:bg-gray-50 text-gray-900 transition-colors flex items-center justify-center border-r-2 border-gray-900">
                            ${this.images.arrow}
                        </button>
                        <button id="edit_log" data-path="/edit_maintenance_record/${log.id}" class="${this.visibility} px-2.5 sm:px-4 bg-[#db8956] hover:bg-orange-500 text-gray-900 transition-colors flex items-center justify-center border-r-2 border-gray-900" title="Редагувати">
                            ${this.images.edit}
                        </button>
                        <button id="delete_log" class="${this.visibility} px-2.5 sm:px-4 bg-[#be5651] hover:bg-red-600 text-white transition-colors flex items-center justify-center" title="Видалити" data-id=${log.id}>
                            ${this.images.delete}
                        </button>
                    </div>

                </div>

                <div class="description_block hidden px-4 sm:px-8 mt-0.5">
                    <div class="bg-white border-2 border-t-0 border-gray-900 rounded-b-xl p-4 max-w-2xl shadow-inner">
                        <h4 class="font-black text-gray-900 text-sm sm:text-base mb-1">Опис</h4>
                        <p class="text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed whitespace-pre-line">
                            ${log.description || "Опис відсутній для цього запису."}
                        </p>
                    </div>
                </div>
            </div>
            `;
        });
        return result.join("");
    }

    async render() {
        super.render("<div class='text-center p-10 font-bold text-xl text-gray-500'>Завантаження інформації про автомобіль...</div>");
        try {
            this.car = await api.cars.show_car_by_id(this.id);
            const maintenance_enum = await api.enum.get_enums(3);
            const html = this.content(maintenance_enum);
            super.render(html);
            this.show_maintenance_logs();

            const delete_car_btn = document.querySelector("#delete_car");
            const modal_overlay = document.querySelector("#delete_modal_overlay");
            const cancel_delete_btn = document.querySelector("#cancel_delete_btn");
            const confirm_delete_btn = document.querySelector("#confirm_delete_btn");
            const delete_input = document.querySelector("input[name='delete_car_input']");
            
            const hideModal = () => {
                modal_overlay.classList.add("hidden");
            };
            cancel_delete_btn?.addEventListener("click", hideModal);

            modal_overlay?.addEventListener("click", (e) => {
                if (e.target === modal_overlay) hideModal();
            });

            if (delete_car_btn && modal_overlay) {
                delete_car_btn.addEventListener("click", () => {
                    modal_overlay.classList.remove("hidden");
                    if (delete_input) delete_input.value = "";
                });

                confirm_delete_btn?.addEventListener("click", async () => {
                    if (delete_input && delete_input.value.trim() === "ВИДАЛИТИ") {
                        try {
                            confirm_delete_btn.disabled = true;
                            confirm_delete_btn.innerText = "ЗАЧЕКАЙТЕ...";
                            
                            await api.cars.delete_car(this.id);
                            hideModal();
                            router.navigate("/cars");
                        } catch(error) {
                            console.error(error);
                            alert("Не вдалося видалити автомобіль.");
                            confirm_delete_btn.disabled = false;
                            confirm_delete_btn.innerText = "ВИДАЛИТИ";
                        }
                    } else {
                        alert("Для підтвердження необхідно ввести слово \"ВИДАЛИТИ\" без лапок.");
                    }
                });
            }
        }
        catch(error) {
            console.log(`Error with car loading: ${error}`);
            super.render("<div class='text-center p-10 text-red-500 font-bold'>Не вдалося завантажити дані автомобіля.</div>");
        }
    }

}