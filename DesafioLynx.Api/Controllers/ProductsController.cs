using Microsoft.AspNetCore.Mvc;
using DesafioLynx.Api.Services;
using DesafioLynx.Api.DTOs;

namespace DesafioLynx.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }

        /// <summary>
        /// Lista produtos com filtros opcionais
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductResponse>>> GetProducts([FromQuery] ProductFilterRequest filter)
        {
            try
            {
                var products = await _productService.GetProductsAsync(filter);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao buscar produtos: {ex.Message}");
            }
        }
    }
}
