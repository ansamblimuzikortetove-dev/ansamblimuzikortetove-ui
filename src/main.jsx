import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./i18n";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import PastEvents from "./pages/PastEvents";
import Reports from "./pages/Reports";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import EventDetail from "./pages/EventDetail.jsx";
import { Toaster } from "react-hot-toast";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "events", element: <Events /> },
      { path: "events/:documentId", element: <EventDetail /> },
      { path: "past-events", element: <PastEvents /> },
      { path: "reports", element: <Reports /> },
      { path: "gallery", element: <Gallery /> },
      { path: "contact", element: <Contact /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <AppErrorBoundary>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AppErrorBoundary>
);