using System.Linq;

namespace DesafioLynx.Api.DTOs
{
    public class PaymentResponse
    {
        public int Id { get; set; }
        public string Method { get; set; } = string.Empty;
        public int AmountCents { get; set; }
        public DateTime? PaidAt { get; set; }
    }

    public class OrderItemResponse
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int UnitPriceCents { get; set; }
        public int SubtotalCents => Quantity * UnitPriceCents;
    }

    public class OrderDetailResponse : OrderSummaryResponse
    {
        public List<OrderItemResponse> Items { get; set; } = new();
        public List<PaymentResponse> Payments { get; set; } = new();
        public int PaidCents { get; set; }
        public int RemainingCents { get; set; }
    }
}
