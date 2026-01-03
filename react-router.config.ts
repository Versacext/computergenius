import type { Config } from "@react-router/dev/config";

export default {
  // Указываем, что папка приложения находится в src/app
  appDirectory: "src/app", 
  ssr: true,
  prerender: false,
} satisfies Config;