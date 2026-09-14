import { THEMES } from "../../config";

const html = document.querySelector("html");
const toggle_theme_btn = document.querySelector("#toggle_theme_btn");

const toggle_theme = (theme_id, theme_label, toggle_btn, old_theme) => {
  html.classList.remove(old_theme);
  html.classList.add(theme_id);
  localStorage.setItem("theme", theme_id);
  toggle_theme_btn.innerText = theme_label;
};

const load_theme = () => {
  const saved_theme = localStorage.getItem("theme") || THEMES.LIGHT.ID;

  if (saved_theme == THEMES.LIGHT.ID) {
    toggle_theme(
      THEMES.LIGHT.ID,
      THEMES.LIGHT.LABEL,
      toggle_theme_btn,
      THEMES.DARK.ID,
    );
  } else {
    toggle_theme(
      THEMES.DARK.ID,
      THEMES.DARK.LABEL,
      toggle_theme_btn,
      THEMES.LIGHT.ID,
    );
  }
};

toggle_theme_btn.addEventListener("click", (event) => {
  if (html.classList.contains(THEMES.LIGHT.ID)) {
    toggle_theme(
      THEMES.DARK.ID,
      THEMES.DARK.LABEL,
      toggle_theme_btn,
      THEMES.LIGHT.ID,
    );
  } else {
    toggle_theme(
      THEMES.LIGHT.ID,
      THEMES.LIGHT.LABEL,
      toggle_theme_btn,
      THEMES.DARK.ID,
    );
  }
});

load_theme();
