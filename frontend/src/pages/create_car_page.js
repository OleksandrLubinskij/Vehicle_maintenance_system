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
        return `
        <form action="POST">
        
        </form>
        `
    };

    content() {
        return `
            <h1>Нема ще сторінки</h1>
        `
    }

    render() {
        const html = this.content();
        super.render(html);
    }
    

}