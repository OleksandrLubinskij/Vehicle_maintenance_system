import { BaseWindow } from "./base_view";
import { Form } from "../components/form_elements";
import { AUTHORIZATION_PAGE_MODE, AUTHORIZATION_INPUT_FIELDS } from "../../config";
import { api } from "../apiRoutes";
import { router } from "../router";
export class AuthorizationPage extends BaseWindow {
    constructor(title, param, mode) {
        super(title);
        this.param = param;
        this.mode = mode;
    }

    authorization_form() {
        const form = new Form();
        const form_fields = [];
        for(const field_identificator of AUTHORIZATION_INPUT_FIELDS) {
            if(this.mode === AUTHORIZATION_PAGE_MODE.LOGIN && field_identificator.ID === "confirm_password")
                continue;
            let type = field_identificator.ID.includes("password") ? "password" : "text"; 
            const field = form.create_entry(
                field_identificator.LABEL,
                field_identificator.ID,
                type
            );
            form_fields.push(field)
        }
        return `
                <form action="/cars" id="authorization_form" class="max-w-2xl w-full mx-auto mt-5">
                    <div class="border border-gray-200 rounded-2xl bg-white p-8 shadow-md">
                        <div class="flex flex-col md:gap-x-6">
                           ${form_fields.join("")}
                        </div>
                    </div>
                    <input 
                        type="submit" 
                        value="${this.mode === AUTHORIZATION_PAGE_MODE.REGISTER ? "Створити акаунт" : "Увійти"}"
                        class="w-full py-3 px-6 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-5 cursor-pointer">
                </form>
                `;
    }

    content() {
        return `
            <div class="flex flex-col">
                <h1 class="text-center font-bold text-lg md:text-2xl lg:text-4xl">
                    ${this.mode === AUTHORIZATION_PAGE_MODE.REGISTER ? "Реєстрація" : "Увійти"}
                </h1>
                ${this.authorization_form()}
            </div>
        `;
    }

    async render() {
        try {
            const html = this.content();
            super.render(html);
            const authorization_form = document.querySelector("#authorization_form");
                    if (authorization_form) {
                        authorization_form.addEventListener("submit", async (event) => {
                            event.preventDefault();
        
                            const formData = new FormData(authorization_form);
                            const user_data = Object.fromEntries(formData.entries());
                            
                            try {
                                if (this.mode === AUTHORIZATION_PAGE_MODE.REGISTER) {
                                    if (user_data.password !== user_data.confirm_password) {
                                        alert("Паролі не збігаються!");
                                        return;
                                    }
                                    
                                    delete user_data.confirm_password;
                                    await api.users.register(user_data);
                                    console.log("Користувача створено");
                                    
                                } else {
                                    await api.users.login(user_data);
                                    console.log("Авторизація успішна");
                                    setTimeout(() => {
                                        router.navigate("/cars");
                                    }, 50);
                                    localStorage.setItem("is_authenticated", "true");
                                }
                            } catch (error) {
                                console.error("Помилка при відправці даних:", error);
                                alert("Не вдалося зареєструватися або увійти");
                            }
                        });
                    }
  
                } catch (error) {
                    console.error(error);
                    super.render("<p class='text-center text-red-500'>Не вдалося завантажити дані</p>");
                }
    }
}