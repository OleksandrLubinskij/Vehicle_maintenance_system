import { api } from "./apiRoutes";
export class BaseWindow {
    constructor(title) {
        this.title = title;
    }

    render() {
        return `<div>Base page</div>`;
    }
    async return_cars() {
        const data = await api.cars.show_all_cars();
        return data;

    }
}
const bw = new BaseWindow("base");
const clear_data = await bw.return_cars();
console.log(clear_data);