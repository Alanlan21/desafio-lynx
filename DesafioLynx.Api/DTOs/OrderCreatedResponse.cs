namespace DesafioLynx.Api.DTOs
{
    public class OrderCreatedResponse
    {
        public int OrderId { get; set; }
        public int TotalCents { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
