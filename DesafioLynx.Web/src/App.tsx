import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import type { CartItem } from "./services/api";

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  return (
    <BrowserRouter>
      <Layout cartCount={cartItems.length}>
        <Routes>
          <Route
            path="/"
            element={
              <ProductsPage cartItems={cartItems} setCartItems={setCartItems} />
            }
          />
          <Route path="/pedidos" element={<OrdersPage />} />
          <Route path="/pedidos/:id" element={<OrdersPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
