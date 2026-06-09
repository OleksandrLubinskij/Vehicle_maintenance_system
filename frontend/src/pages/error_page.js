import { BaseWindow } from "./base_view";

export class ErrorPage extends BaseWindow {
    constructor(title, error_code) {
        super(title)
        this.error_code = error_code;
        this.errors = {
            "404": {
                "img": "assets/page_not_found.svg",
                "text": "Сторінку не знайдено!",
                "hint": "Кнопка 'Назад' або перевірка посилання зазвичай допомагають вирішити цю халепу."
            },
            "500": {
                "img": "assets/server_error.svg",
                "text": "Помилка сервера!",
                "hint": "Все що ви можете зробити це трішки зачекати поки розробник вирішить проблему."
            }
        }
    }
    
    content() {
        console.log(this.error_code)
        const error_obj = this.errors[this.error_code];
        console.log(error_obj);
        return `
            <div
        class="flex flex-col items-center max-w-md w-full bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 md:p-10 text-center transition-all duration-300 hover:shadow-emerald-100"
      >
        <div
          class="mb-6 p-4 bg-emerald-200 rounded-full text-emerald-600 animate-bounce"
        >
          <img
            src="${error_obj['img']}"
            alt="Page not found"
            class="w-16 h-16 md:w-20 md:h-20 object-contain"
          />
        </div>

        <div class="space-y-2">
          <h1
            class="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight"
          >
            404
          </h1>
          <p class="text-xl md:text-2xl font-bold text-gray-800">
            ${error_obj["text"]}
          </p>
          <p class="text-sm md:text-base text-gray-500 max-w-xs mx-auto">
            ${error_obj["hint"]}
          </p>
        </div>

        <div class="mt-8 w-full">
          <a
            href="/"
            class="inline-block w-full py-3 px-6 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            На головну
          </a>
        </div>
      </div>
        `
    }

    render() {
      const html = this.content();
      super.render(html);
    }
}