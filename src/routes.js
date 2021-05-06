// @material-ui/icons
import Person from "@material-ui/icons/Person";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import SettingsIcon from "@material-ui/icons/Settings";
// core components/views for Admin layout
import UserProfile from "views/UserProfile/UserProfile.js";
import Settings from "views/Settings/Settings";
import Checkout from "views/Checkout/Checkout.js";
import Payment from "views/Payment/Payment.js";

//core components/views for Home layout
import LandingPage from "views/LandingPage/LandingPage.js";
import Home from "views/Home/Home.js";
import SearchResult from "views/SearchResult/SearchResult.js";
import VideoUpload from "./views/VideoUpload/VideoUpload";
import SignIn from "views/Auth/SignIn.js";
import SignUp from "views/Auth/SignUp.js";
import Verify from "views/Auth/Verify.js";

const routes = [
  {
    path: "/user",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
    layoutCategory: "both",
  },
  {
    path: "/settings",
    name: "User Settings",
    icon: SettingsIcon,
    component: Settings,
    layout: "/admin",
    layoutCategory: "both",
  },
  {
    path: "/video",
    name: "Video Uploading",
    icon: VideoLibraryIcon,
    component: VideoUpload,
    layout: "/admin",
    layoutCategory: "trainer",
  },
  {
    path: "/checkout/:id",
    name: "Checkout",
    icon: Person,
    component: Checkout,
    layout: "/admin",
    layoutCategory: "student",
  },
  {
    path: "/payment",
    name: "Payment",
    icon: Person,
    component: Payment,
    layout: "/admin",
    layoutCategory: "trainer",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    layout: "/home",
    exact: true,
  },
  {
    path: "/search/:query",
    name: "Search Results",
    component: SearchResult,
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
    exact: false,
  },
];

const headerRoutes = {
  userProfile: {
    path: "/user",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
    layoutCategory: "both",
  },
  videoUpload: {
    path: "/video",
    name: "Video Uploading",
    icon: VideoLibraryIcon,
    component: VideoUpload,
    layout: "/admin",
    layoutCategory: "trainer",
  },
  settings: {
    path: "/settings",
    name: "User Settings",
    icon: SettingsIcon,
    component: Settings,
    layout: "/admin",
    layoutCategory: "both",
  },
};

export { routes, headerRoutes };
