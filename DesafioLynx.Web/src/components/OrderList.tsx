import React from "react";
import { formatMoney, formatDate } from "../services/api";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "../data/constants";
import type { OrderSummary } from "../services/api";

interface OrderListProps {
  orders: OrderSummary[];
  loading: boolean;
  onSelectOrder: (orderId: number) => void;
  selectedOrderId?: number;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  loading,
  onSelectOrder,
  selectedOrderId,
}) => {
  const getStatusBadge = (status: string) => {
    const colorClass =
      ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] ||
      "bg-gray-100 text-gray-800";
    const label =
      ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg border text-center">
        <div className="text-gray-400 text-2xl mb-2">📋</div>
        <p className="text-gray-500">Nenhum pedido encontrado</p>
      </div>
    );
  }

  // Separar pedidos por status
  const newOrders = orders.filter((order) => order.status === "NEW");
  const paidOrders = orders.filter((order) => order.status === "PAID");
  const otherOrders = orders.filter(
    (order) => order.status !== "NEW" && order.status !== "PAID",
  );

  const renderOrderCard = (order: OrderSummary) => (
    <div
      key={order.id}
      onClick={() => onSelectOrder(order.id)}
      className={`bg-white p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
        selectedOrderId === order.id ? "ring-2 ring-blue-500 shadow-md" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900">Pedido #{order.id}</h3>
        {getStatusBadge(order.status)}
      </div>

      <div className="space-y-1 text-sm text-gray-600">
        <p>
          <span className="font-medium">Cliente:</span> {order.customerName}
        </p>
        <p>
          <span className="font-medium">Data:</span>{" "}
          {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-500">Total:</span>
        <span className="font-bold text-green-600">
          {formatMoney(order.totalCents)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Pedidos Novos */}
      {newOrders.length > 0 && (
        <div className="space-y-3">{newOrders.map(renderOrderCard)}</div>
      )}

      {/* Outros Status (Cancelados, etc.) */}
      {otherOrders.length > 0 && (
        <div className="space-y-3">{otherOrders.map(renderOrderCard)}</div>
      )}

      {/* Separador visual e Pedidos Pagos */}
      {paidOrders.length > 0 && (
        <>
          {(newOrders.length > 0 || otherOrders.length > 0) && (
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="px-4 text-sm text-gray-500 font-medium">
                Pedidos Pagos
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
          )}
          <div className="space-y-3">{paidOrders.map(renderOrderCard)}</div>
        </>
      )}
    </div>
  );
};

export default OrderList;
