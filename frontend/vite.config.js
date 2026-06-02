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
  server: {
    host: true, // або '0.0.0.0'
    port: 5173,
    watch: {
      usePolling: true, // <--- Вмикає примусове опитування файлів
    },
  },
})