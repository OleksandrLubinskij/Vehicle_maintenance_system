export class Form {
    create_entry(label_text, id, type, extra_classes = "", default_value=null) {
        return `
        <div class="flex flex-col gap-2 w-full mb-4 ${extra_classes}">
          <label for="${id}" class="text-sm md:text-base font-semibold text-gray-700">
            ${label_text}:
          </label>
          <input
            type="${type}"
            id="${id}"
            name="${id}"
            value="${default_value===null ? "" : default_value}"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
          />
        </div>`
    }

    create_textarea(label_text, id, rows, cols, default_value=null) {
        return `
        <div class="flex flex-col gap-2 w-full mb-4">
          <label for="${id}" class="text-sm md:text-base font-semibold text-gray-700">
            ${label_text}:
          </label>
          <textarea
            id="${id}"
            name="${id}"
            value="${default_value===null ? "" : default_value}"
            rows=${rows}
            cols=${cols}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
          ></textarea>
        </div>`
    }

    create_select(label_text, id, values, extra_classes = "", default_value="") {
        return `
        <div class="flex flex-col gap-2 w-full mb-4 ${extra_classes}">
          <label for="${id}" class="text-sm md:text-base font-semibold text-gray-700">
            ${label_text}
          </label>
          <select 
            id="${id}" 
            name="${id}"
            value="${default_value.length === 0 ? values[0] : default_value}" 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-base transition-all bg-white"
          >
            ${this.create_options(values)}
          </select>
        </div>
        `
    }

    create_options(values) {
        const options_arr = values.map(val => {
            return `<option value="${val}" class="text-base">${val}</option>`
        });
        return options_arr.join("");        
    }
}