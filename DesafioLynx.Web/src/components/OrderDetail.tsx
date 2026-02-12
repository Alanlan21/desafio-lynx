import React, { useState } from "react";
import { api, formatMoney, formatDate } from "../services/api";
import {
  PAYMENT_METHODS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from "../data/constants";
import type { OrderDetail } from "../services/api";

interface OrderDetailProps {
  order: OrderDetail | null;
  onPaymentSuccess: () => void;
}

const OrderDetailComponent: React.FC<OrderDetailProps> = ({
  order,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loading, setLoading] = useState(false);

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

  if (!order) {
    return (
      <div className="bg-white p-8 rounded-lg border text-center">
        <div className="text-gray-400 text-2xl mb-2">👆</div>
        <p className="text-gray-500">
          Selecione um pedido para ver os detalhes
        </p>
      </div>
    );
  }

  const processPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount.replace(",", ".")) <= 0) {
      alert("Informe um valor válido para o pagamento");
      return;
    }

    try {
      setLoading(true);
      const amountCents = Math.round(
        parseFloat(paymentAmount.replace(",", ".")) * 100,
      );

      // Chama POST /payments
      await api.createPayment({
        orderId: order.id,
        method: paymentMethod,
        amountCents,
      });

      // Limpa o formulário
      setPaymentMethod("PIX");
      setPaymentAmount("");

      // Recarrega o pedido com GET /orders/{id}
      onPaymentSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      alert("Erro ao processar pagamento: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900">Pedido #{order.id}</h3>
        {getStatusBadge(order.status)}
      </div>

      <div className="mb-4 space-y-2 text-sm">
        <p>
          <span className="font-medium text-gray-700">Cliente:</span>{" "}
          {order.customerName}
        </p>
        <p>
          <span className="font-medium text-gray-700">Data:</span>{" "}
          {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-3">Itens do Pedido</h4>
        <div className="space-y-2">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded border"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {item.productName}
                </div>
                <div className="text-gray-500">
                  {item.quantity}x {formatMoney(item.unitPriceCents)}
                </div>
              </div>
              <div className="font-medium text-green-600">
                {formatMoney(item.subtotalCents)}
              </div>
            </div>
          )) || <p className="text-gray-500 text-sm">Nenhum item encontrado</p>}
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center font-bold text-lg border-t pt-3">
        <span className="text-gray-900">Total:</span>
        <span className="text-green-600">{formatMoney(order.totalCents)}</span>
      </div>

      {/* Seção de Pagamentos - para pedidos NEW e PAID */}
      {(order.status === "NEW" || order.status === "PAID") && (
        <div className="border-t pt-4">
          {/* Lista de Pagamentos Existentes */}
          {order.payments && order.payments.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                Pagamentos Realizados
              </h4>
              <div className="space-y-2">
                {order.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-green-800">
                        {payment.method}
                      </span>
                      {payment.paidAt && (
                        <span className="text-green-600 text-xs ml-2">
                          {formatDate(payment.paidAt)}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-green-600">
                      {formatMoney(payment.amountCents)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulário de Novo Pagamento - apenas para pedidos NEW */}
          {order.status === "NEW" && order.remainingCents > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Novo Pagamento</h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="text"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder={`0,00 (máx: ${formatMoney(order.remainingCents).replace("R$ ", "")})`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Faltam {formatMoney(order.remainingCents)} para quitar o
                    pedido
                  </p>
                </div>

                <button
                  onClick={processPayment}
                  disabled={loading || !paymentAmount}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Processando..." : "Processar Pagamento"}
                </button>
              </div>
            </div>
          )}

          {/* Mensagem quando pedido está quitado */}
          {order.remainingCents <= 0 && (
            <div className="p-4 bg-green-100 border border-green-300 rounded-lg text-center">
              <div className="text-green-800 font-semibold mb-1">
                🎉 Pedido Quitado!
              </div>
              <div className="text-green-600 text-sm">
                Todos os pagamentos foram processados
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetailComponent;
