/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
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
import Login from "views/Login/Login.js";
import Home from "views/Home/Home.js";

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
    rtlName: "Home",
    icon: Person,
    component: Home,
    layout: "/home",
    exact: true,
  },
  {
    path: "/landingpage",
    name: "Landing Page",
    rtlName: "Landing Page",
    icon: Person,
    component: LandingPage,
    layout: "/home",
    exact: false,
  },
  {
    path: "/login",
    name: "Login",
    rtlName: "Login",
    icon: Person,
    component: Login,
    layout: "/home",
    exact: false,
  },
];

export default routes;
