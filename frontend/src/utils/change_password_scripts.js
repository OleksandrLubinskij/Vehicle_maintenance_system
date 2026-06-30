import { api } from "../apiRoutes";
import { router } from "../router";
const change_p_modal = document.querySelector("#change_password_modal");
const change_p_menu_btn = document.querySelector("#change_password_menu_btn");
const change_p_submit_btn = document.querySelector("#change_password_submit_btn");
const change_p_close_btn = document.querySelector("#cancel_password_btn");
const change_p_form = document.querySelector("#change_password_form");

const clear_modal = () => {
    change_p_modal.querySelectorAll("span").forEach(span => span.classList.add("hidden"));

    change_p_form.querySelectorAll("input").forEach(input => {
        input.classList.add("border-gray-300");
        input.classList.remove("border-red-500", "focus:ring-red-500");
    });
    
    change_p_form.reset();
};

const error_color_input = (element) => {
    element.classList.remove("border-gray-300");
    element.classList.add("border-red-500");
    element.classList.add("focus:ring-red-500");
};
change_p_menu_btn.addEventListener("click", () => {
    clear_modal();
    change_p_modal.classList.remove("hidden");
});

change_p_close_btn.addEventListener("click", () => {
  change_p_modal.classList.add("hidden");
});

change_p_submit_btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const formData = new FormData(change_p_form);
    const data = Object.fromEntries(formData.entries());
    
    if(data.new_password !== data.confirm_password) {
        const confirm_password_error = document.querySelector("#confirm_password_error");
        const confirm_password_input = document.querySelector("#confirm_password");
        
        confirm_password_error.textContent = "Паролі не співпадають!";
        error_color_input(confirm_password_input);
        confirm_password_error.classList.remove("hidden");
    }
    else {
        try {
            delete data["confirm_password"];
            await api.users.change_password(data);
            change_p_modal.classList.add("hidden");
            await api.users.logout();
            router.navigate("/login");
        }
        catch (error) {
            const old_password_error = document.querySelector("#old_password_error");
            const old_password_input = document.querySelector("#old_password");
            
            if(error.code === 0) {
                old_password_error.textContent = "Старий пароль неправильний!";
                error_color_input(old_password_input);
                old_password_error.classList.remove("hidden");
            }
            else {
                console.error("Помилка при зміні пароля:", error);
                alert("Помилка при зміні пароля. Спробуйте ще раз.");
            }
        }
    }
});
 