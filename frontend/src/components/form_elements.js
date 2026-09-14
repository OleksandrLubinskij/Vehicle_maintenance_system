export class Form {
    create_entry(label_text, id, type, extra_classes = "", default_value=null) {
        return `
        <div class="flex flex-col gap-2 w-full mb-4 ${extra_classes}">
          <label for="${id}" class="text-sm md:text-base font-semibold text-form-label">
            ${label_text}:
          </label>
          <span id="${id}_error" class="hidden text-xs md:text-sm text-red-500 font-medium"></span>
          <input
            type="${type}"
            id="${id}"
            name="${id}"
            value="${default_value===null ? "" : default_value}"
            class="w-full bg-form-bg text-form-text border border-form-border rounded-lg px-3 py-2 text-base focus:outline-none focus:border-form-focus focus:ring-1 focus:ring-form-focus transition-all"
          />
        </div>`
    }

    create_textarea(label_text, id, rows, cols, extra_classes="", default_value=null) {
        return `
        <div class="flex flex-col gap-2 w-full mb-4 ${extra_classes}">
          <label for="${id}" class="text-sm md:text-base font-semibold text-form-label">
            ${label_text}:
          </label>
          <textarea
            id="${id}"
            name="${id}"
            rows=${rows}
            cols=${cols}
            class="w-full bg-form-bg text-form-text border border-form-border rounded-lg px-3 py-2 text-base focus:outline-none focus:border-form-focus focus:ring-1 focus:ring-form-focus transition-all"
          >${default_value || ""}</textarea>
        </div>`
    }

    create_select(label_text, id, values, extra_classes = "", default_value="", show_values="") {
        return `
        <div class="flex flex-col gap-2 w-full mb-4 ${extra_classes}">
          <label for="${id}" class="text-sm md:text-base font-semibold text-form-label">
            ${label_text}
          </label>
          <select 
            id="${id}" 
            name="${id}" 
            class="w-full bg-form-bg text-form-text border border-form-border rounded-lg px-3 py-2 focus:outline-none focus:border-form-focus focus:ring-1 focus:ring-form-focus text-base transition-all"
          >
            ${this.create_options(values, default_value, show_values)}
          </select>
        </div>
        `
    }

    create_options(values, default_value, show_values) {
        const display_arr = show_values ? show_values : values;

        const options_arr = display_arr.map((display_val, index) => {
            const backend_val = show_values ? values[index] : display_val;
            const isSelected = backend_val === default_value ? "selected" : "";
            
            return `<option value="${backend_val}" ${isSelected} class="text-base">${display_val}</option>`;
        });

        return options_arr.join("");        
    }
}