using Microsoft.AspNetCore.Mvc;
using DesafioLynx.Api.Services;
using DesafioLynx.Api.DTOs;

namespace DesafioLynx.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrdersController(OrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// Lista todos os pedidos (resumo)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderSummaryResponse>>> GetOrders()
        {
            try
            {
                var orders = await _orderService.GetAllOrdersAsync();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao buscar pedidos: {ex.Message}");
            }
        }

        /// <summary>
        /// Busca pedido por ID (detalhado com itens)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetailResponse>> GetOrderById(int id)
        {
            try
            {
                var order = await _orderService.GetOrderDetailAsync(id);
                if (order == null)
                {
                    return NotFound($"Pedido com ID {id} não encontrado");
                }
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao buscar pedido: {ex.Message}");
            }
        }

        /// <summary>
        /// Cria novo pedido
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<OrderCreatedResponse>> CreateOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                var response = await _orderService.CreateOrderAsync(request);
                return CreatedAtAction(nameof(GetOrderById), new { id = response.OrderId }, response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao criar pedido: {ex.Message}");
            }
        }
    }
}
