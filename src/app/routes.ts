import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  // Главная страница
  index("app/page.jsx"),

  // Страница 404 (обработка ошибок)
  route("*", "app/__create/not-found.tsx"),
] satisfies RouteConfig;