namespace DesafioLynx.Api.DTOs
{
    public class CreatePaymentRequest
    {
        public int OrderId { get; set; }
        public string Method { get; set; } = string.Empty; // "PIX", "CARD", "BOLETO"
        public int AmountCents { get; set; }
    }
}
