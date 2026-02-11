namespace DesafioLynx.Api.DTOs
{
    public class OrderSummaryResponse
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int TotalCents { get; set; }
    }
}