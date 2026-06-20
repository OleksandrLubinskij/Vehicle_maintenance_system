import { BaseWindow } from "./base_view";
import { router } from "../router";
import { api } from "../apiRoutes";

export class GetCarPage extends BaseWindow {
    constructor(title, id) {
        super(title);
        this.id = id;
    }

    content() {
        return `<h1>ID - ${this.id}</h1>`
    }

    render() {
        const html = this.content();
        super.render(html); 
    }
}
