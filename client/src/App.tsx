import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ShopPage from "./pages/shop";
import RegisterPage from "./pages/auth/register";
import LoginPage from "./pages/auth/login";
import CheckoutPage from "./pages/checkout";
import PurchasedItemsPage from "./pages/purchased-items";

import { Navbar } from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/purchased-items" element={<PurchasedItemsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
