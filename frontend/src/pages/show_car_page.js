import { BaseWindow } from "./base_view";
import { api } from "../apiRoutes";
import { ROLE, INDICATORS } from "../../config";
import { router } from "../router";
import { icon_value_text } from "../components/icon_value_comp";
import { Form } from "../components/form_elements";

export class ShowCarPage extends BaseWindow {
  constructor(title) {
    super(title);
    this.form = new Form();
    this.images = {
      mileage: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer" viewBox="0 0 16 16">
  <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2M3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.39.39 0 0 0-.029-.518z"/>
  <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.95 11.95 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0" class="w-full h-full">
</svg>`,
      engine_capacity: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box" viewBox="0 0 16 16">
  <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
</svg>`,
      fuel_type: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fire" viewBox="0 0 16 16">
  <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
</svg>`,
      oil_type: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-droplet" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M7.21.8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
  <path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z"/>
</svg>`,
      add_note_img: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-plus" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5"/>
  <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
  <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
</svg>`,
      edit_car: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg>`,
      refueling: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fuel-pump" viewBox="0 0 16 16">
  <path d="M3 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5z"/>
  <path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1q.846-.002 1.412.336c.383.228.634.551.794.907.295.655.294 1.465.294 2.081v3.175a.5.5 0 0 1-.5.501H15v4.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1zm9 0a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v13h8z"/>
</svg>`,
      monthly_fuel_consumption: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard2-data" viewBox="0 0 16 16">
  <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
  <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"/>
  <path d="M10 7a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zm-6 4a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm4-3a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1"/>
</svg>`
    };

    this.info_about_car_keys = [
      "mileage",
      "engine_capacity",
      "fuel_type",
      "oil_type",
      "monthly_fuel_consumption"
    ];

    this.cars = [];
    this.visibility =
      localStorage.getItem("role") === ROLE.USER ? "hidden" : "";
    
  }

  render_car_card(car_data) {
    const worstMaintenanceId =
      car_data["service_indicators"]["worst_maintenance"];
    const indicatorColor = INDICATORS[worstMaintenanceId]["text_color"];
    const indicatorImg = INDICATORS[worstMaintenanceId]["img"];
    const textColor = INDICATORS[worstMaintenanceId]["color"];

    return `
        <article data-path="/get_car/${car_data["id"]}" class="car_card_main cursor-pointer border border-gray-200 bg-white flex flex-col md:flex-row items-stretch rounded-xl overflow-hidden shadow-sm m-4 hover:shadow-lg transition-shadow">
            
    <img
        src="${car_data["photo_path"] ? `${car_data["photo_path"]}` : "assets/no_photo.png"}"
        alt=""
        class="w-full h-48 md:w-80 md:h-auto object-cover shrink-0 self-stretch"
    />

    <div class="car_info flex-1 p-5 flex flex-col sm:flex-row justify-between items-stretch gap-6 md:gap-16">
        
        <div class="info_about_car flex flex-col gap-4 w-full">
            <p class="text-lg md:text-xl lg:text-2xl font-bold">
                ${car_data["brand"]} ${car_data["model"]}
            </p>
            <div class="w-fit flex items-center gap-1.5 px-2 py-1 rounded-md text-[14px] font-bold bg-gray-100 border border-gray-200 uppercase tracking-wide" style="color: ${textColor}"> 
                <div class="h-4 w-4 md:w-5 shrink-0 flex items-center justify-center">
                    ${indicatorImg}
                </div>
                <span>${car_data["service_indicators"]["text_indicator"]}</span>
            </div>
            ${this.info_about_car_keys
              .map((key) =>
                icon_value_text(this.images[key], car_data[key]),
              )
              .join("")}
        </div>

        <div class="manage_btn_and_indicators w-full sm:w-auto flex flex-col justify-center gap-4 whitespace-nowrap shrink-0 mt-4 sm:mt-0">
          
          ${icon_value_text(
            this.images.refueling,
            "Заправити",
            "button",
            `#`, 
            `${this.visibility} btn-refuel border border-transparent hover:border-[#8c322e] hover:bg-rose-50 rounded-lg lg:px-3 lg:py-1.5 text-gray-700 hover:text-[#8c322e]`,
          )}

          ${icon_value_text(
            this.images.edit_car,
            "Редагувати",
            "button",
            `/edit_car/${car_data["id"]}`,
            `${this.visibility} border border-transparent hover:border-[#a05228] hover:bg-orange-50 rounded-lg lg:px-3 lg:py-1.5 text-gray-700 hover:text-[#a05228]`,
          )}

          ${icon_value_text(
            this.images.add_note_img,
            "Додати ремонт",
            "button",
            `/create_maintenance_record/${car_data["id"]}`,
            `${this.visibility} border border-transparent hover:border-emerald-500 hover:bg-emerald-50 rounded-lg lg:px-3 lg:py-1.5 text-gray-700 hover:text-emerald-700`,
          )}
      </div>
    </div>
    <div class="car_indicator h-9 w-full md:h-auto md:w-16 shrink-0" style="background-color: ${indicatorColor}"></div>
</article>
    `;
  }

  render_refuel_modal() {
    return `
      <div id="refuel-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Заправити авто</h2>
          <form id="refuel-form">
            <input type="hidden" id="refuel-car-id" value="">
            
            <div class="mb-4">
              
              ${this.form.create_entry(
                "Пробіг (км)", 
                "current_mileage", 
                "input",
                 "w-full px-3 py-2 outline-none focus:ring-2 focus:ring-[#8c322e]", 
                null)}
              </div>
            
            <div class="mb-6">
              ${this.form.create_entry(
                "Літри", 
                "liters", 
                "input", 
                "w-full px-3 py-2 outline-none focus:ring-2 focus:ring-[#8c322e]", 
                null
              )}
            </div>
            
            <div class="flex justify-end gap-3">
              <button type="button" id="btn-cancel-refuel" class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors">
                Скасувати
              </button>
              <button type="submit" class="px-4 py-2 text-white bg-[#8c322e] hover:bg-[#7a2a26] rounded-md font-medium transition-colors">
                Підтвердити
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  content() {
    const cars_cards = Object.values(this.cars)
      .map((car) => this.render_car_card(car))
      .join("");
    return `
            <div id="card_container" class="max-w-6xl w-full mx-auto flex flex-col gap-2 relative">
                ${cars_cards}
            </div>
            ${this.render_refuel_modal()}
    `;
  }

  async render() {
    super.render(
      "<div class='text-center p-10 font-bold text-xl'>Завантаження списку автомобілів...</div>",
    );
    try {
      this.cars = await this.get_all_cars();
      const html = this.content();
      super.render(html);
      this.button_clicks();
      await this.init_modal_events();
    } catch (error) {
      console.log(`Error with car loading: ${error}`);
      super.render(
        "<div class='text-center p-10 text-red-500 font-bold'>Не вдалося завантажити дані.</div>",
      );
    }
  }

  async get_all_cars() {
    const cars_data = await api.cars.show_all_cars();
    return cars_data;
  }

  open_refuel_modal(car_id) {
    const modal = document.getElementById("refuel-modal");
    const carIdInput = document.getElementById("refuel-car-id");
    if (modal && carIdInput) {
      carIdInput.value = car_id;
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }
  }

  close_refuel_modal() {
    const modal = document.getElementById("refuel-modal");
    const form = document.getElementById("refuel-form");
    if (modal && form) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      form.reset();
    }
  }

  async init_modal_events() {
    const btnCancel = document.getElementById("btn-cancel-refuel");
    const refuelForm = document.getElementById("refuel-form");

    if (btnCancel) {
      btnCancel.addEventListener("click", () => this.close_refuel_modal());
    }

    if (refuelForm) {
      refuelForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const car_id = document.getElementById("refuel-car-id").value;
        const formData = new FormData(refuelForm);
        const refuel_data = Object.fromEntries(formData.entries());
        console.log(`Submitting refuel data for car_id ${car_id}:`, refuel_data);
        try {
          await api.fuel_log.create_log(car_id, refuel_data);
          this.close_refuel_modal();
          await this.render();
        } catch(error) { 
          console.error(`Помилка при створенні запису про заправку: ${error}`);
        }
      });
    }
  }

  button_clicks() {
    const card_container = document.querySelector("#card_container");
    if (!card_container) return;
    
    card_container.addEventListener("click", (event) => {
      const is_button = event.target.closest("button");
      
      if (is_button && is_button.classList.contains("btn-refuel")) {
        event.preventDefault();
        event.stopPropagation();
        
        const card = is_button.closest(".car_card_main");
        if (card) {
          const car_id = card.getAttribute("data-path").split("/").pop();
          this.open_refuel_modal(car_id);
        }
        return;
      }

      if (is_button) return;

      const card = event.target.closest(".car_card_main");
      if (card) {
        const target_url = card.getAttribute("data-path");
        router.navigate(target_url);
      }
    });
  }
}