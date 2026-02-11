using DesafioLynx.Api.Data;
using DesafioLynx.Api.DTOs;
using DesafioLynx.Api.Models;

namespace DesafioLynx.Api.Services
{
    public class ProductService
    {
        private readonly ProductRepository _productRepository;

        public ProductService(ProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<ProductResponse>> GetProductsAsync(ProductFilterRequest filter)
        {
            var products = await _productRepository.GetAllAsync(filter);
            
            // Map entities to response DTOs
            return products.Select(p => new ProductResponse
            {
                Id = p.Id,
                Name = p.Name,
                Category = p.Category,
                PriceCents = p.Price_Cents,  // Mapeando da propriedade correta
                Active = p.Active
            });
        }

        public async Task<Product?> GetActiveProductByIdAsync(int id)
        {
            return await _productRepository.GetActiveByIdAsync(id);
        }
    }
}
