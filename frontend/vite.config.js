import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { addDynamicIconSelectors } from "@iconify/tailwind"

export default defineConfig({
  plugins: [
    tailwindcss({
      plugins: [
        addDynamicIconSelectors()
      ]
    }),
  ],
})