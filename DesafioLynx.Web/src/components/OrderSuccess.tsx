import React from "react";
import { formatMoney } from "../services/api";

interface OrderSuccessProps {
  orderData: {
    orderId: number;
    totalCents: number;
  } | null;
  onClose: () => void;
  onViewOrders: () => void;
  onNewOrder: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({
  orderData,
  onClose,
  onViewOrders,
  onNewOrder,
}) => {
  if (!orderData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pedido Criado com Sucesso!
        </h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-600 text-sm mb-1">Número do Pedido</p>
          <p className="text-3xl font-bold text-indigo-600">
            #{orderData.orderId}
          </p>
          <p className="text-gray-600 text-sm mt-2">Total</p>
          <p className="text-xl font-semibold text-green-600">
            {formatMoney(orderData.totalCents)}
          </p>
        </div>

        <p className="text-gray-600 mb-6 text-sm">
          Seu pedido foi registrado e está aguardando pagamento.
        </p>

        <div className="space-y-3">
          <button
            onClick={onViewOrders}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Ver Meus Pedidos
          </button>
          <button
            onClick={onNewOrder}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Fazer Novo Pedido
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
