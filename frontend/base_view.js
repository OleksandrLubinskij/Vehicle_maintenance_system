import { api } from "./apiRouter";
export class BaseWindow {
    constructor(title) {
        this.title = title;
    }

    render() {
        return `<div>Base page</div>`;
    }
}
