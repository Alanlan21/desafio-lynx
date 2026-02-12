export interface Customer {
  id: number;
  name: string;
}

export interface PaymentMethod {
  value: string;
  label: string;
}

export const CUSTOMERS: Customer[] = [
  { id: 1, name: "João Silva" },
  { id: 2, name: "Maria Santos" },
  { id: 3, name: "Pedro Oliveira" },
];

export const CATEGORIES: string[] = ["Eletrônicos", "Livros", "Instrumentos"];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { value: "PIX", label: "PIX" },
  { value: "CARD", label: "Cartão de Crédito" },
  { value: "BOLETO", label: "Boleto" },
];

export const ORDER_STATUS_COLORS = {
  NEW: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
} as const;

export const ORDER_STATUS_LABELS = {
  NEW: "Novo",
  PAID: "Pago",
  CANCELLED: "Cancelado",
} as const;
