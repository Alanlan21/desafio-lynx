namespace DesafioLynx.Api.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string Method { get; set; } = string.Empty; // "PIX", "CARD", "BOLETO"
        public int AmountCents { get; set; }
        public DateTime? PaidAt { get; set; }
    }
}