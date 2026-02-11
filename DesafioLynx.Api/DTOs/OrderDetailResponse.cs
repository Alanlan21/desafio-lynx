namespace DesafioLynx.Api.DTOs
{
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
    }
}