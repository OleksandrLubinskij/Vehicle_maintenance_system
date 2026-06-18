import { api } from "../apiRoutes";
import { router } from "../router";

document.addEventListener("DOMContentLoaded", () => {
    const settings_dropdown = document.querySelector("#settings_dropdown");
    const settings_btn = document.querySelector("#settings_btn");
    const logout_btn = document.querySelector("#logout_btn");

    settings_btn.addEventListener("click", (event) => {
        event.stopPropagation();
        settings_dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
        if(!settings_dropdown.contains(event.target)) {
            settings_dropdown.classList.add("hidden");
        }
    });

    logout_btn.addEventListener("click", async () => {
        try {
            await api.users.logout();
            localStorage.removeItem("is_authenticated")
            settings_dropdown.classList.add("hidden");
            localStorage.removeItem("role");
            router.navigate("/login");
        }
        catch(error) {
            console.log(`Не вдалося вийти - ${error}`);
            console.alert("Не вдалося вийти");
        }
    })
});

