namespace DesafioLynx.Api.DTOs
{
    public class ProductFilterRequest
    {
        public string? Category { get; set; }
        public bool? Active { get; set; }
        public string? Name { get; set; }
    }
}