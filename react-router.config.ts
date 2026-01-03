import type { Config } from "@react-router/dev/config";

export default {
  // Настройка сервера
  ssr: true,
  // Выключаем пререндеринг, чтобы Netlify не выдавал ошибку SyntaxError
  prerender: false,
} satisfies Config;