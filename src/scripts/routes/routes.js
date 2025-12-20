import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import StoryPage from "../pages/stories/add-story";
import FavoritesPage from "../pages/stories/favorites";

const routes = {
  "/": HomePage,
  "/about": AboutPage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/add-story": StoryPage,
  "/favorites": FavoritesPage,
};

export default routes;
