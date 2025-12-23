const HomePage = () => import("../pages/home/home-page").then((m) => m.default);
const AboutPage = () => import("../pages/about/about-page").then((m) => m.default);
const LoginPage = () => import("../pages/auth/login").then((m) => m.default);
const RegisterPage = () => import("../pages/auth/register").then((m) => m.default);
const StoryPage = () => import("../pages/stories/add-story").then((m) => m.default);
const FavoritesPage = () => import("../pages/stories/favorites").then((m) => m.default);

const routes = {
  "/": HomePage,
  "/about": AboutPage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/add-story": StoryPage,
  "/favorites": FavoritesPage,
};

export default routes;
