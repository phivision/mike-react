// @material-ui/icons
import Person from "@material-ui/icons/Person";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import SettingsIcon from "@material-ui/icons/Settings";
// core components/views for Admin layout
import UserProfile from "views/UserProfile/UserProfile.js";
import Settings from "views/Settings/Settings";
import UserFeed from "views/UserFeed/UserFeed.js";

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
    icon: Person,
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
    name: "User Settings",
    component: Settings,
    auth: "both",
  },
];

const headerRoutes = {
  userProfile: {
    path: "/user",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    auth: "both",
  },
  videoUpload: {
    path: "/video",
    name: "Video Uploading",
    icon: VideoLibraryIcon,
    component: VideoUpload,
    auth: "trainer",
  },
  settings: {
    path: "/settings",
    name: "User Settings",
    icon: SettingsIcon,
    component: Settings,
    auth: "both",
  },
};

export { routes, headerRoutes };
