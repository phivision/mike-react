// @material-ui/icons
import { UserIcon } from "./components/StyledComponents/StyledComponents";
// core components/views for Admin layout
import Settings from "views/Settings/Settings";
import UserFeed from "views/UserFeed/UserFeed.js";

//core components/views for Home layout
import LandingPage from "views/LandingPage/LandingPage.js";
import Home from "views/Home/Home.js";
import Search from "views/Search/Search.js";
import SignIn from "views/Auth/SignIn.js";
import SignUp from "views/Auth/SignUp.js";
import Verify from "views/Auth/Verify.js";
import ResetPassword from "views/Auth/ResetPassword";
import NotFound from "./views/NotFound/NotFound";

const routes = [
  {
    path: "/user",
    name: "Feed",
    component: UserFeed,
    auth: "both",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    exact: true,
  },
  {
    path: "/search/:query",
    name: "Search",
    component: Search,
    exact: true,
  },
  {
    path: "/landingpage/:id",
    name: "Landing Page",
    icon: UserIcon,
    component: LandingPage,
    exact: true,
  },
  {
    path: "/signin",
    name: "Sign In",
    component: SignIn,
    exact: false,
  },
  {
    path: "/signup/:role",
    name: "Sign Up",
    component: SignUp,
    exact: false,
  },
  {
    path: "/verify",
    name: "Verify your email",
    component: Verify,
    exact: false,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    auth: "both",
  },
  {
    path: "/reset",
    name: "Reset Password",
    component: ResetPassword,
  },
  {
    path: "/404",
    name: "Reset Password",
    component: NotFound,
  },
];

export { routes };
