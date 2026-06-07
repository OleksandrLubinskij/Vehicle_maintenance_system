export class Form {
    create_entry(label_text, id, type) {
        return `
        <div class="flex flex-col gap-2 w-full max-w-md">
          <label for=${id} class="text-sm md:text-xl lg:text-2xl font-medium text-gray-700"
            >${label_text}:</label
          >
          <input
            type="${type}"
            id=${id}
            name=${id}
            class="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:border-emerald-600"
          />
        </div>`
    };

    create_select(label_text, id, values) {
        return `
            <div class="flex flex-col gap-2 w-full max-w-md">
          <label for=${id} class="text-sm md:text-xl lg:text-2xl font-medium text-gray-700""
            >${label_text}</label
          >
          <select id=${id} name=${id} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-emerald-600 text-sm md:text-base lg:text-lg">
            ${this.create_options(values)}
          </select>
        </div>
        `
    };
    create_options(values) {
        options_arr = values.map(val => {
            return `
            <option value=${val} class="text-sm md:text-lg lg:text-xl">${val}</option>
        `
        });
        return "".join(options_arr);        
    };
};