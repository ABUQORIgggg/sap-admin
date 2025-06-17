import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ContextProvider } from "./Contexts/ContextProvider";
import App from "./App";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Orders from "./Pages/Orders/Orders";
import CreateProduct from "./Pages/Products/CreateProduct/CreateProduct";
import EditProduct from "./Pages/Products/EditProduct/EditProduct";
import ProductsDashboard from "./Pages/Products/ProductsDashboard/ProductsDashboard";
import AllUsers from "./Pages/Users/AllUsers/AllUsers";
import Customers from "./Pages/Users/Customers/Customers";
import Workers from "./Pages/Users/Workers/Workers";
import Login from "./Pages/Login/Login";
import ProtectedRoute from "./hooks/PrivateRoute";
import Inventory from "./Pages/Inventory/Inventory";
import AddInvoice from "./Pages/Inventory/AddInvoice";
import CreateCategory from "./Pages/Categories/CreateCategory/CreateCategory";
import CategoryDashboard from "./Pages/Categories/CategoryDashboard/CategoryDashboard";

// Define your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <App />
    ),
    children: [
      {
        path: "/",
        element: (
            <Dashboard />
        ),
      },
      {
        path: "orders",
        element: (
            <Orders />
        ),
      },
      {
        path: "create-products",
        element: (
            <CreateProduct />
        ),
      },
      {
        path: "edit-products",
        element: (
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "products-dashboard",
        element: (
          <ProtectedRoute>
            <ProductsDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "all-users",
        element: (
          <ProtectedRoute>
            <AllUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "customers",
        element: (
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        ),
      },
      {
        path: "workers",
        element: (
          <ProtectedRoute>
            <Workers />
          </ProtectedRoute>
        ),
      },
      {
        path: "stock",
        element: (
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-catalogs",
        element: (
          <ProtectedRoute>
            <CreateCategory />
          </ProtectedRoute>
        ),
      },
      {
        path: "categories",
        element: (
          <ProtectedRoute>
            <CategoryDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-invoice",
        element: (
          <ProtectedRoute>
            <AddInvoice />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <h1>Page not found</h1>,
  },
  {
    path: "login",
    element: <Login />,
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </Provider>
  </React.StrictMode>
);
