export function icon_value_text(svg_code, text, element = "div", data_path = "", extra_clases = "", icon_size="h-5 w-5 md:h-7 md:w-7 lg:h-9 lg:w-9", icon_color="text-current", text_size="text-xs md:text-base lg:text-lg") {
    
    const pathAttr = (element === "button" && data_path) ? `data-path="${data_path}"` : "";

    return `
        <${element} ${pathAttr} class="flex gap-2 m-2 cursor-pointer items-center justify-start transition-transform duration-200 hover:scale-105 ${extra_clases}">
            <div class="${icon_size} shrink-0 flex items-center justify-center car-svg-container" style="color: ${icon_color}" >
                ${svg_code}
            </div>
            <span class="${text_size} inline-flex items-center font-medium">
                ${text}
            </span>
        </${element}>
    `;
}