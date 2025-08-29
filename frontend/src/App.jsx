import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";

import HomePage from "./pages/HomePage";
import OrderDrinks from "./pages/OrderDrinks";
import CustomerService from "./pages/CustomerService";
import FlowOrder from "./pages/FlowOrder";
import OrderStatus from "./pages/OrderStatus";
import NoConnectionPage from "./pages/NoConnectionPage";
import LoginPage from "./pages/Admin";
import Dashboard from "./pages/dashboard/Dashboard";
4;

import ProtectedRoute from "./pages/utils/ProtectedRoute";
// import PrivateRoute from "./pages/utils/PrivateRoute";

function App() {
  const location = useLocation();

  // List of routes where Navbar and Footer should not be displayed
  const noHeaderFooterRoutes = ["/login", "/dashboard"];
  return (
    <div>
      {/* Conditional rendering of Navbar and Footer */}
      {!noHeaderFooterRoutes.includes(location.pathname) && <NavbarComponent />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/order/*"
          element={<ProtectedRoute component={React.memo(OrderDrinks)} />}
        />
        {/* <Route path="/order" element={<OrderDrinks />} /> */}

        <Route path="/flow" element={<FlowOrder />} />
        <Route path="/cs" element={<CustomerService />} />
        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/no-connection" element={<NoConnectionPage />} />
      </Routes>
      {!noHeaderFooterRoutes.includes(location.pathname) && <FooterComponent />}
    </div>
  );
}

export default App;
