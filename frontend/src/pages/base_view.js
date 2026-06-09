import { api } from "../apiRoutes";
export class BaseWindow {
    constructor(title) {
        this.title = title;
    }

    render(content) {
        if(content === undefined) return;
        const app_div = document.querySelector("#app");
        if(app_div) {
            app_div.innerHTML = "";
            app_div.innerHTML = content;
        }
    }
}