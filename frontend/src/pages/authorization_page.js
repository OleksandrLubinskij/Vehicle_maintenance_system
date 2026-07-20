import { BaseWindow } from "./base_view";
import { Form } from "../components/form_elements";
import { AUTHORIZATION_PAGE_MODE, AUTHORIZATION_INPUT_FIELDS } from "../../config";
import { api } from "../apiRoutes";
import { router } from "../router";
import { handleFormError, clearFormErrors } from "../utils/auth_error_handler";
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
                <form action="/cars" id="authorization_form" class="w-full mt-4">
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
    const register_btn_visibility = this.mode === AUTHORIZATION_PAGE_MODE.REGISTER ? "hidden" : "";
    
    return `
        <div class="flex flex-col flex-1 justify-center items-center w-full min-h-full py-10">
            <div class="max-w-md w-full"> <h1 class="text-center font-bold text-lg md:text-2xl lg:text-4xl mb-2">
                    ${this.mode === AUTHORIZATION_PAGE_MODE.REGISTER ? "Реєстрація" : "Увійти"}
                </h1>
                
                ${this.authorization_form()}
                
                <p class="text-center text-sm text-gray-600 mt-4 ${register_btn_visibility}">
                    Немає акаунта? 
                    <button 
                        id="go-to-register" 
                        class="text-[#00966a] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                        data-path="/register"
                    >
                        Зареєструватися
                    </button>
                </p>
            </div>
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
                            clearFormErrors(authorization_form);
                            const formData = new FormData(authorization_form);
                            const user_data = Object.fromEntries(formData.entries());
                            
                            try {
                                if (this.mode === AUTHORIZATION_PAGE_MODE.REGISTER) {
                                    if (user_data.password !== user_data.confirm_password) {
                                        handleFormError(null, 3);
                                        return;
                                    }
                                    
                                    delete user_data.confirm_password;
                                    await api.users.register(user_data);
                                    console.log("Користувача створено");
                                    router.navigate("/login");
                                } else {
                                    await api.users.login(user_data);
                                    console.log("Авторизація успішна");
                                    setTimeout(() => {
                                        router.navigate("/cars");
                                    }, 50);
                                    localStorage.setItem("is_authenticated", "true");
                                    const current_user = await api.users.get_me();
                                    localStorage.setItem("role", current_user.role);
                                }
                            } catch (error) {
                                console.error("Помилка при відправці даних:", error.message);
                                handleFormError(error);
                            }
                        });
                    }
  
                } catch (error) {
                    console.error(error);
                    super.render("<p class='text-center text-red-500'>Не вдалося завантажити дані</p>");
                }
    }
}