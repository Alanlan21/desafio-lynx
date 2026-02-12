const API_URL = "http://localhost:5146/api";

// Types para as respostas da API
export interface Product {
  id: number;
  name: string;
  category: string;
  priceCents: number;
  active: boolean;
}

export interface Customer {
  id: number;
  name: string;
}

export interface OrderSummary {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  status: string;
  createdAt: string;
  totalCents: number;
}

export interface Payment {
  id: number;
  method: string;
  amountCents: number;
  paidAt: string | null;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPriceCents: number;
  subtotalCents: number;
}

export interface OrderDetail extends OrderSummary {
  items: OrderItem[];
  payments: Payment[];
  paidCents: number;
  remainingCents: number;
}

export interface CreateOrderRequest {
  customerId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface CreateOrderResponse {
  orderId: number;
  totalCents: number;
  status: string;
}

export interface CreatePaymentRequest {
  orderId: number;
  method: string;
  amountCents: number;
}

export interface ProductFilters {
  category?: string;
  active?: boolean;
  name?: string;
}

// Tipo para item do carrinho
export interface CartItem extends Product {
  quantity: number;
}

export const api = {
  // Produtos
  getProducts: async (filters: ProductFilters = {}): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.active !== undefined)
      params.set("active", filters.active.toString());
    if (filters.name) params.set("name", filters.name);

    const response = await fetch(`${API_URL}/products?${params}`);
    if (!response.ok) throw new Error("Erro ao carregar produtos");
    return response.json();
  },

  // Pedidos
  getOrders: async (): Promise<OrderSummary[]> => {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error("Erro ao carregar pedidos");
    return response.json();
  },

  getOrderDetail: async (id: number): Promise<OrderDetail> => {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar detalhes do pedido");
    return response.json();
  },

  createOrder: async (
    data: CreateOrderRequest,
  ): Promise<CreateOrderResponse> => {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Erro ao criar pedido");
    }
    return response.json();
  },

  // Pagamentos
  createPayment: async (data: CreatePaymentRequest): Promise<void> => {
    const response = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Erro ao processar pagamento");
    }
  },
};

export const formatMoney = (cents: number): string =>
  `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("pt-BR");
};
