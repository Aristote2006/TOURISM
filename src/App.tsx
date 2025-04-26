
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { UserProvider } from "@/contexts/UserContext";
import { ActivityProvider } from "@/contexts/ActivityContext";

// Import Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboard from "./pages/AdminDashboard";
import Activities from "./pages/Activities";
import AddActivity from "./pages/AddActivity";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, updateActivity } = useAuth();

  // Update activity timestamp when accessing protected routes
  useEffect(() => {
    if (user) {
      updateActivity();
    }
  }, [user, updateActivity]);

  if (loading) {
    return React.createElement(
      'div',
      { className: "flex items-center justify-center min-h-screen" },
      "Loading..."
    );
  }

  if (!user) {
    return React.createElement(Navigate, { to: "/auth", replace: true });
  }

  return children;
}

const App = () => {
  // Create a protected route element with the given component
  const createProtectedRoute = (Component: React.ComponentType) => {
    return React.createElement(
      ProtectedRoute,
      null,
      React.createElement(Component, null)
    );
  };

  // Create a route element
  const createRoute = (path: string, element: React.ReactNode, props?: any) => {
    return React.createElement(
      Route,
      { path, element, ...props }
    );
  };

  return React.createElement(
    ThemeProvider,
    { defaultTheme: "light" },
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(
        UserProvider,
        null,
        React.createElement(
          ActivityProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(Toaster, null),
            React.createElement(Sonner, null),
            React.createElement(
              BrowserRouter,
              { basename: "/" },
              React.createElement(
                Routes,
                null,
                // Public Routes
                React.createElement(Route, { index: true, element: React.createElement(HomePage, null) }),
                React.createElement(Route, { path: "/", element: React.createElement(HomePage, null) }),
                React.createElement(Route, { path: "/about", element: React.createElement(AboutPage, null) }),
                React.createElement(Route, { path: "/activities", element: React.createElement(ActivitiesPage, null) }),
                React.createElement(Route, { path: "/contact", element: React.createElement(ContactPage, null) }),
                React.createElement(Route, { path: "/auth", element: React.createElement(AuthPage, null) }),

                // Protected Admin Routes
                createRoute("/admin", createProtectedRoute(AdminDashboard)),
                createRoute("/admin/activities", createProtectedRoute(Activities)),
                createRoute("/admin/add-activity", createProtectedRoute(AddActivity)),
                createRoute("/admin/profile", createProtectedRoute(Profile)),
                createRoute("/admin/settings", createProtectedRoute(Settings)),

                // Not Found Route
                React.createElement(Route, { path: "*", element: React.createElement(NotFound, null) })
              )
            )
          )
        )
      )
    )
  );
};

export default App;
