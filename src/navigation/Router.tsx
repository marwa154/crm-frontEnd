import { useRoutes, Navigate } from "react-router-dom";
import Layout from "../pages/Layout";

import { PublicPaths, PrivatePaths, AdminPaths, FallbackPaths } from "./paths";
import { PublicScreens, PrivateScreens, AdminScreens } from "../pages";

import AuthGuard from "../guards/AuthGuard";
import AdminGuard from "../guards/AdminGuard";
import GuestGuard from "../guards/GuestGuard";


export default function AppRouter() {
  const routes = useRoutes([

    {
      path: PublicPaths.login,
      element: (
        <GuestGuard>
          <PublicScreens.Login />
        </GuestGuard>
      ),
    },
    {
      path: PublicPaths.accessDenied,
      element: (
        <AuthGuard>
          <PublicScreens.AccessDenied />
        </AuthGuard>)

    },

    {
      path: PrivatePaths.dashboard,
      element: (
        <AuthGuard>
          <Layout>
            <PrivateScreens.Dashboard />
          </Layout>
        </AuthGuard>
      ),
    },
    {
      path: PrivatePaths.clients,
      element: (
        <AuthGuard>
          <Layout>
            <PrivateScreens.Clients />
          </Layout>
        </AuthGuard>
      ),
    },
    {
      path: PrivatePaths.quotes,
      element: (
        <AuthGuard>
          <Layout>
            <PrivateScreens.Quotes />
          </Layout>
        </AuthGuard>
      ),
    },
    {
      path: PrivatePaths.invoices,
      element: (
        <AuthGuard>
          <Layout>
            <PrivateScreens.Invoices />
          </Layout>
        </AuthGuard>
      ),
    },
    {
      path: PrivatePaths.notifications,
      element: (
        <AuthGuard>
          <Layout>
            <PrivateScreens.Notifications />
          </Layout>
        </AuthGuard>
      ),
    },

    {
      path: AdminPaths.users,
      element: (
        <AdminGuard>
          <Layout>
            <AdminScreens.Users />
          </Layout>
        </AdminGuard>
      ),
    },
    {
      path: AdminPaths.Logs,
      element: (
        <AdminGuard>
          <Layout>
            <AdminScreens.Logs />
          </Layout>
        </AdminGuard>
      ),
    },
    {
      path: PrivatePaths.createQuotes,
      element: (
        <AuthGuard>
          <Layout>
            <PrivateScreens.QuoteForm />
          </Layout>
        </AuthGuard>
      ),
    },

    {
      path: PrivatePaths.createInvoices,
      element: (
        <AuthGuard>
          <Layout>
            <PrivateScreens.InvoiceForm />
          </Layout>
        </AuthGuard>
      ),
    },


    {
      path: FallbackPaths.notFound,
      element: <Navigate to={PrivatePaths.dashboard} replace />,
    },
  ]);

  return routes
}
