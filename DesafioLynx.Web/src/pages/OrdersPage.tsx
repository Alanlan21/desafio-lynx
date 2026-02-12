import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import OrderList from "../components/OrderList";
import OrderDetailComponent from "../components/OrderDetail";
import type {
  OrderSummary,
  OrderDetail as IOrderDetail,
} from "../services/api";

const OrdersPage: React.FC = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (id) {
      loadOrderDetail(parseInt(id));
    }
  }, [id]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      alert("Erro ao carregar pedidos. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetail = async (orderId: number) => {
    try {
      setLoadingDetail(true);
      const data = await api.getOrderDetail(orderId);
      setSelectedOrder(data);
    } catch (error) {
      console.error("Erro ao carregar detalhes do pedido:", error);
      alert("Erro ao carregar detalhes do pedido");
      setSelectedOrder(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSelectOrder = (orderId: number) => {
    loadOrderDetail(orderId);
  };

  const handlePaymentSuccess = () => {
    // Recarregar dados após pagamento bem-sucedido
    loadOrders();
    if (selectedOrder) {
      loadOrderDetail(selectedOrder.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Gestão de Pedidos
        </h1>
        <p className="text-gray-600 text-lg">
          Visualize e gerencie todos os seus pedidos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">
              Lista de Pedidos
            </h2>
            {orders.length > 0 && (
              <span className="bg-indigo-600 text-white text-sm px-3 py-1 rounded-full">
                {orders.length} pedido{orders.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <OrderList
            orders={orders}
            loading={loading}
            onSelectOrder={handleSelectOrder}
            selectedOrderId={selectedOrder?.id}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2v8h12V6H4zm2 2a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900">
              Detalhes do Pedido
            </h3>
          </div>
          {loadingDetail ? (
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/30">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : (
            <OrderDetailComponent
              order={selectedOrder}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
