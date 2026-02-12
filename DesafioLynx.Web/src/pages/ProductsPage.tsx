import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import Cart from "../components/Cart";
import OrderSuccess from "../components/OrderSuccess";
import type {
  Product,
  ProductFilters as IProductFilters,
  CartItem,
} from "../services/api";

interface ProductsPageProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const ProductsPage: React.FC<ProductsPageProps> = ({
  cartItems,
  setCartItems,
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: number;
    totalCents: number;
  } | null>(null);
  const [filters, setFilters] = useState<IProductFilters>({
    category: "",
    active: undefined,
    name: "",
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      alert("Erro ao carregar produtos. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product, quantity: number) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems((items) =>
        items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      );
    } else {
      setCartItems((items) => [
        ...items,
        {
          ...product,
          quantity,
        },
      ]);
    }
  };

  const handleOrderSuccess = (orderData: {
    orderId: number;
    totalCents: number;
  }) => {
    setOrderSuccess(orderData);
  };

  const closeOrderSuccess = () => {
    setOrderSuccess(null);
  };

  const viewOrders = () => {
    setOrderSuccess(null);
    navigate("/pedidos");
  };

  const startNewOrder = () => {
    setOrderSuccess(null);
    // Carrinho já foi limpo, usuário pode continuar comprando
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Catálogo de Produtos
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <ProductFilters filters={filters} onFiltersChange={setFilters} />
          <ProductGrid
            products={products}
            loading={loading}
            onAddToCart={addToCart}
          />
        </div>

        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <Cart
              items={cartItems}
              setItems={setCartItems}
              onOrderSuccess={handleOrderSuccess}
            />
          </div>
        </div>
      </div>

      {/* Modal de Sucesso do Pedido */}
      <OrderSuccess
        orderData={orderSuccess}
        onClose={closeOrderSuccess}
        onViewOrders={viewOrders}
        onNewOrder={startNewOrder}
      />
    </div>
  );
};

export default ProductsPage;
