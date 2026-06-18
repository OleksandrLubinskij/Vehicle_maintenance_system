export function updateActiveNavLink(currentPath) {
    const navButtons = document.querySelectorAll("[data-path]");

    navButtons.forEach(button => {
        const buttonPath = button.getAttribute("data-path");

        if (buttonPath === currentPath) {
            button.classList.remove("border-transparent", "text-gray-700");
            button.classList.add("text-emerald-700", "font-bold");
        } else {
            button.classList.remove("text-emerald-700", "font-bold");
            button.classList.add("border-transparent", "text-gray-700");
        }
    });
}