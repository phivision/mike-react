// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";

import NotificationsPage from "views/Notifications/Notifications.js";

//core components/views for Home layout
import LandingPage from "views/LandingPage/LandingPage.js";
import Home from "views/Home/Home.js";
import Search from "views/Search/Search.js";
import SignIn from "views/Auth/SignIn.js";
import SignUp from "views/Auth/SignUp.js";
import Verify from "views/Auth/Verify.js";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "User Profile",
    rtlName: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/table",
    name: "Trainer List",
    rtlName: "Trainer List",
    icon: "content_paste",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    rtlName: "Notifications",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin",
  },
  {
    path: "/",
    name: "Home",
    icon: Person,
    component: Home,
    layout: "/home",
    exact: true,
  },
  {
    path: "/search/:query",
    name: "Search Results",
    component: Search,
    layout: "/home",
    exact: true,
  },
  {
    path: "/landingpage/:id",
    name: "Landing Page",
    rtlName: "Landing Page",
    icon: Person,
    component: LandingPage,
    layout: "/home",
    exact: true,
  },
  {
    path: "/signin",
    name: "Sign In",
    component: SignIn,
    layout: "/home",
    exact: false,
  },
  {
    path: "/signup",
    name: "Sign Up",
    component: SignUp,
    layout: "/home",
    exact: false,
  },
  {
    path: "/verify/:username/:password/",
    name: "Verify your email",
    component: Verify,
    layout: "/home",
    exact: true,
  },
];

export default routes;
