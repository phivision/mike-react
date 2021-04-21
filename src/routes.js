// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import PeopleIcon from "@material-ui/icons/People";
import Notifications from "@material-ui/icons/Notifications";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import SettingsIcon from "@material-ui/icons/Settings";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TrainerList from "views/TableList/TrainerList.js";
import Settings from "views/Settings/Settings";
import NotificationsPage from "views/Notifications/Notifications.js";

//core components/views for Home layout
import LandingPage from "views/LandingPage/LandingPage.js";
import Home from "views/Home/Home.js";
import Search from "views/Search/Search.js";
import VideoUpload from "./views/VideoUpload/VideoUpload";
import SignIn from "views/Auth/SignIn.js";
import SignUp from "views/Auth/SignUp.js";
import Verify from "views/Auth/Verify.js";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/settings",
    name: "User Settings",
    icon: SettingsIcon,
    component: Settings,
    layout: "/admin",
  },
  {
    path: "/table",
    name: "Find Trainer",
    icon: PeopleIcon,
    component: TrainerList,
    layout: "/admin",
  },
  {
    path: "/video",
    name: "Video Uploading",
    icon: VideoLibraryIcon,
    component: VideoUpload,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
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
    path: "/signup/:role",
    name: "Sign Up",
    component: SignUp,
    layout: "/home",
    exact: false,
  },
  {
    path: "/verify",
    name: "Verify your email",
    component: Verify,
    layout: "/home",
    exact: true,
  },
];

export default routes;
