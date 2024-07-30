import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import { ShopContextProvider } from "./context/shop-context";

import { useGetJWT } from "./hooks/useGetJWT";

import ShopPage from "./pages/shop";
import RegisterPage from "./pages/auth/register";
import LoginPage from "./pages/auth/login";
import CheckoutPage from "./pages/checkout";
import PurchasedItemsPage from "./pages/purchased-items";

import { Navbar } from "./components/Navbar";

function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const { headers } = useGetJWT();

  const authenticate = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/auth", {
        headers,
      });

      if (response.data.userId) {
        setAuthenticated(true);
      }
    } catch (err) {}
  };

  useEffect(() => {
    authenticate();
  }, [authenticated]);

  return (
    <Router>
      <ShopContextProvider>
        <Navbar
          authenticated={authenticated}
          setAuthenticated={setAuthenticated}
        />
        <Routes>
          {authenticated ? (
            <>
              <Route path="/" element={<ShopPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/purchased-items" element={<PurchasedItemsPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/login"
                element={<LoginPage setAuthenticated={setAuthenticated} />}
              />
            </>
          ) : (
            <>
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/login"
                element={<LoginPage setAuthenticated={setAuthenticated} />}
              />
            </>
          )}
        </Routes>
      </ShopContextProvider>
    </Router>
  );
}

export default App;
