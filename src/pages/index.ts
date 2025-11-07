import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import Clients from "../pages/Clients";
import Quotes from "../pages/Quotes";
import Invoices from "../pages/Invoices";
import Notifications from "../pages/Notifications";
import Users from "../pages/Users";
import Logs from "../pages/Logs";
import AccessDenied from "../pages/AccessDenied";

export const PublicScreens = {
  Login: Auth,
  AccessDenied,
};

export const PrivateScreens = {
  Dashboard,
  Clients,
  Quotes,
  Invoices,
  Notifications,
};

export const AdminScreens = {
  Users,
  Logs,
};
