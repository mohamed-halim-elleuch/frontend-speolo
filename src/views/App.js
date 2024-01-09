import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./signin/signin.js";
import "./style.css";

//import Navbar from './components/Navbar.js';
import CssBaseline from "@mui/joy/CssBaseline";
import { AuthProvider } from "../apis/AuthContext.js";
import PrivateRoute from "../apis/privateRoute.js";
import Header from "./Navbar/Header.js";
import Layout from "./Navbar/Layout.tsx";
import Navigation from "./Navbar/Navigation.js";
import Contribute from "./contribute/Contribute.js";
import Dashboard from "./dashboard/Dashboard.js";
import ObservationFiles from "./files/Files.tsx";
import Home from "./incomplete/Home.js";
import NoPage from "./incomplete/NoPage.js";
import Contact from "./incomplete/contact.js";
import SearchPage from "./search/SearchPage.js";
import Map from "./Map/map.js";
function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const dashboardRoute = window.location.pathname;

  return (
    <AuthProvider>
      {" "}
      {/* Your authentication provider */}
      <BrowserRouter>
        <CssBaseline />

        <Routes>
          <Route
            path="/authenticate"
            element={
              <div className="app">
                <SignIn />
              </div>
            }
          />
          <Route path="/" element={<Navigate to="/authenticate" />} />
          <Route
            path="/authenticate/*"
            element={
              <React.Fragment>
                {drawerOpen && (
                  <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
                    <Navigation />
                  </Layout.SideDrawer>
                )}

                <Layout.Root
                  currentProfile={dashboardRoute === "/authenticate/dashboard"}
                  sx={{
                    ...(drawerOpen && {
                      height: "100vh",
                      overflow: "hidden",
                    }),
                  }}
                >
                  <Layout.Header>
                    <Header />
                  </Layout.Header>

                  {dashboardRoute === "/authenticate/dashboard" && (
                    <Layout.SideNav>
                      <Navigation />
                    </Layout.SideNav>
                  )}
                  <PrivateRoute index path="home" element={<Home />} />
                  <PrivateRoute
                    index
                    path="contribute"
                    element={<Contribute />}
                  />
                  <PrivateRoute index path="contact" element={<Contact />} />
                  <PrivateRoute index path="no-page" element={<NoPage />} />
                  <PrivateRoute index path="map" element={<Map />} />
                  <PrivateRoute
                    index
                    path="search-page"
                    element={<SearchPage />}
                  />
                  <PrivateRoute
                    index
                    path="dashboard"
                    element={<Dashboard />}
                  />
                  <PrivateRoute
                    index
                    path="caves/:id"
                    element={<ObservationFiles />}
                  />
                </Layout.Root>
              </React.Fragment>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
