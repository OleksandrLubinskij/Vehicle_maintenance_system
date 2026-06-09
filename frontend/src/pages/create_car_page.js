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

    create_add_car_form() {
        const form = new Form();
        let form_fields = [];
        let field;
        for (const [key, val] of Object.entries(this.form_fields)) {
            field = form.create_entry(key, val, "input");
            console.log(field);
            form_fields.push(field);
        }
        return `
        <form 
            action="POST">
            <div class="border-2 rounded-lg bg-white p-6 max-w-md w-full mx-auto space-y-4 shadow-sm">
                ${
                    form_fields.join("")
                }
            </div>
        </form>
        `
    };

    content() {
        return `
            <div class="flex flex-col">
                <h1 class="text-center font-bold text-lg md:text-2xl lg:text-4xl m-10">Додати машину</h1>
                ${this.create_add_car_form()}
            </div>
        `
    }

    render() {
        const html = this.content();
        super.render(html);
    }
    

}